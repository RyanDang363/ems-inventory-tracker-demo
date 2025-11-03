import express from 'express';
import Supply from '../models/Supply.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get all supplies with category information
router.get('/supplies', async (req, res) => {
  try {
    const supplies = await Supply.find()
      .populate('category_id', 'name')
      .lean();
    
    // Transform data to match frontend expectations
    const transformedSupplies = supplies.map(supply => ({
      ...supply,
      id: supply._id,
      category_name: supply.category_id?.name || 'Unknown',
      stock_status: getStockStatus(supply),
      stock_percentage: getStockPercentage(supply)
    }));

    res.json(transformedSupplies);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    res.status(500).json({ error: 'Failed to fetch supplies' });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const supplies = await Supply.find({
      $expr: { $lte: ['$current_quantity', '$min_threshold'] }
    })
    .populate('category_id', 'name')
    .lean();

    const transformedSupplies = supplies.map(supply => ({
      ...supply,
      id: supply._id,
      category_name: supply.category_id?.name || 'Unknown',
      stock_status: getStockStatus(supply),
      stock_percentage: getStockPercentage(supply)
    }));

    res.json(transformedSupplies);
  } catch (error) {
    console.error('Error fetching low stock supplies:', error);
    res.status(500).json({ error: 'Failed to fetch low stock supplies' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const transformedCategories = categories.map(cat => ({
      ...cat,
      id: cat._id
    }));
    res.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const supplies = await Supply.find().lean();
    
    const stats = {
      total_supplies: supplies.length,
      out_of_stock: supplies.filter(s => s.current_quantity === 0).length,
      low_stock: supplies.filter(s => s.current_quantity > 0 && s.current_quantity <= s.min_threshold).length,
      good_stock: supplies.filter(s => s.current_quantity > s.min_threshold).length
    };

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .populate({
        path: 'supply_id',
        populate: { path: 'category_id', select: 'name' }
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const transformedTransactions = recentTransactions.map(trans => ({
      ...trans,
      id: trans._id,
      supply_name: trans.supply_id?.name || 'Unknown',
      category_name: trans.supply_id?.category_id?.name || 'Unknown'
    }));

    // Get low stock items
    const lowStockSupplies = supplies
      .filter(s => s.current_quantity <= s.min_threshold)
      .slice(0, 5);

    res.json({
      stats,
      recent_transactions: transformedTransactions,
      low_stock_items: lowStockSupplies
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get transactions
router.get('/transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const total = await Transaction.countDocuments();
    const transactions = await Transaction.find()
      .populate({
        path: 'supply_id',
        populate: { path: 'category_id', select: 'name' }
      })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const transformedTransactions = transactions.map(trans => ({
      ...trans,
      id: trans._id,
      supply_name: trans.supply_id?.name || 'Unknown',
      category_name: trans.supply_id?.category_id?.name || 'Unknown'
    }));

    res.json({
      transactions: transformedTransactions,
      total
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Update supply quantity
router.put('/supplies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { current_quantity, min_threshold } = req.body;

    const supply = await Supply.findById(id);
    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    const oldQuantity = supply.current_quantity;
    
    // Update supply
    if (current_quantity !== undefined) supply.current_quantity = current_quantity;
    if (min_threshold !== undefined) supply.min_threshold = min_threshold;
    supply.last_updated = new Date();
    
    await supply.save();

    // Record transaction if quantity changed
    if (current_quantity !== undefined && current_quantity !== oldQuantity) {
      const quantityChange = current_quantity - oldQuantity;
      const type = quantityChange > 0 ? 'restock' : 'adjustment';
      
      await Transaction.create({
        supply_id: id,
        quantity_change: quantityChange,
        type,
        employee_name: req.user?.fullName || 'Manager'
      });
    }

    res.json({ 
      success: true, 
      message: 'Supply updated successfully',
      supply: {
        ...supply.toObject(),
        stock_status: getStockStatus(supply),
        stock_percentage: getStockPercentage(supply)
      }
    });
  } catch (error) {
    console.error('Error updating supply:', error);
    res.status(500).json({ error: 'Failed to update supply' });
  }
});

// Delete supply
router.delete('/supplies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const supply = await Supply.findByIdAndDelete(id);
    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    // Also delete related transactions
    await Transaction.deleteMany({ supply_id: id });

    res.json({ success: true, message: 'Supply deleted successfully' });
  } catch (error) {
    console.error('Error deleting supply:', error);
    res.status(500).json({ error: 'Failed to delete supply' });
  }
});

// Add new supply
router.post('/supplies', async (req, res) => {
  try {
    const { name, category_id, current_quantity, min_threshold, unit } = req.body;

    // Validate required fields
    if (!name || !category_id) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    // Create new supply
    const supply = await Supply.create({
      name,
      category_id,
      current_quantity: current_quantity || 0,
      min_threshold: min_threshold || 10,
      unit: unit || 'units'
    });

    // Record initial stock transaction
    await Transaction.create({
      supply_id: supply._id,
      quantity_change: current_quantity || 0,
      type: 'restock',
      employee_name: req.user?.fullName || 'Manager'
    });

    const populatedSupply = await Supply.findById(supply._id).populate('category_id', 'name');

    res.json({ 
      success: true, 
      message: 'Supply added successfully',
      supply: {
        ...populatedSupply.toObject(),
        id: populatedSupply._id,
        category_name: populatedSupply.category_id?.name || 'Unknown',
        stock_status: getStockStatus(populatedSupply),
        stock_percentage: getStockPercentage(populatedSupply)
      }
    });
  } catch (error) {
    console.error('Error adding supply:', error);
    res.status(500).json({ error: 'Failed to add supply' });
  }
});

// Helper functions
function getStockStatus(supply) {
  if (supply.current_quantity === 0) return 'out_of_stock';
  if (supply.current_quantity <= supply.min_threshold) return 'low';
  if (supply.current_quantity <= supply.min_threshold * 1.5) return 'medium';
  return 'good';
}

function getStockPercentage(supply) {
  if (supply.min_threshold === 0) return 0;
  return Math.round((supply.current_quantity * 100.0 / supply.min_threshold) * 10) / 10;
}

export default router;
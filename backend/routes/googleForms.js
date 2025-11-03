import express from 'express';
import Supply from '../models/Supply.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Endpoint for Google Forms to submit supply usage
router.post('/submit', async (req, res) => {
  try {
    const { supply_name, quantity, employee_name } = req.body;

    // Validate input
    if (!supply_name || !quantity || !employee_name) {
      return res.status(400).json({ 
        error: 'Missing required fields: supply_name, quantity, and employee_name are required' 
      });
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ 
        error: 'Quantity must be a positive number' 
      });
    }

    // Find the supply (case-insensitive search)
    // Escape special regex characters in the supply name (parentheses, etc.)
    const escapedSupplyName = supply_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const supply = await Supply.findOne({
      name: { $regex: new RegExp(`^${escapedSupplyName}$`, 'i') }
    }).populate('category_id', 'name');

    if (!supply) {
      return res.status(404).json({ 
        error: `Supply "${supply_name}" not found in inventory` 
      });
    }

    // Check if there's enough quantity
    if (supply.current_quantity < quantityNum) {
      return res.status(400).json({ 
        error: `Insufficient quantity. Only ${supply.current_quantity} ${supply.unit} available.`,
        current_quantity: supply.current_quantity,
        requested_quantity: quantityNum
      });
    }

    // Update the supply quantity
    const oldQuantity = supply.current_quantity;
    const newQuantity = oldQuantity - quantityNum;
    
    supply.current_quantity = newQuantity;
    supply.last_updated = new Date();
    await supply.save();

    // Record the transaction
    await Transaction.create({
      supply_id: supply._id,
      quantity_change: -quantityNum,
      type: 'use',
      employee_name: employee_name
    });

    // Check if item is now low stock
    const isLowStock = newQuantity <= supply.min_threshold;
    const stockStatus = newQuantity === 0 ? 'out_of_stock' : 
                       newQuantity <= supply.min_threshold ? 'low' : 'good';

    res.json({
      success: true,
      message: `Successfully recorded: ${quantityNum} ${supply.unit} of ${supply.name} used by ${employee_name}`,
      supply: {
        name: supply.name,
        category: supply.category_id?.name || 'Unknown',
        previous_quantity: oldQuantity,
        new_quantity: newQuantity,
        unit: supply.unit,
        stock_status: stockStatus,
        is_low_stock: isLowStock
      }
    });

  } catch (error) {
    console.error('Error processing Google Forms submission:', error);
    res.status(500).json({ 
      error: 'Failed to process supply usage',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test endpoint to verify Google Forms integration
router.get('/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Google Forms endpoint is working',
    timestamp: new Date().toISOString()
  });
});

export default router;
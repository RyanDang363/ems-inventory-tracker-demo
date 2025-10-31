import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Get all transactions with supply details
router.get('/', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    const transactions = db.prepare(`
      SELECT 
        t.*,
        s.name as supply_name,
        s.unit as supply_unit,
        c.name as category_name
      FROM transactions t
      JOIN supplies s ON t.supply_id = s.id
      JOIN categories c ON s.category_id = c.id
      ORDER BY t.timestamp DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM transactions').get();

    res.json({
      transactions,
      total: total.count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transactions for a specific supply
router.get('/supply/:supplyId', (req, res) => {
  try {
    const { supplyId } = req.params;
    const transactions = db.prepare(`
      SELECT 
        t.*,
        s.name as supply_name,
        s.unit as supply_unit
      FROM transactions t
      JOIN supplies s ON t.supply_id = s.id
      WHERE t.supply_id = ?
      ORDER BY t.timestamp DESC
    `).all(supplyId);

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching supply transactions:', error);
    res.status(500).json({ error: 'Failed to fetch supply transactions' });
  }
});

// Create a new transaction (used by Google Forms webhook)
router.post('/', (req, res) => {
  try {
    const { supply_id, quantity_change, reason, employee_name, notes } = req.body;

    // Validation
    if (!supply_id || !quantity_change || !reason) {
      return res.status(400).json({ error: 'Missing required fields: supply_id, quantity_change, reason' });
    }

    // Check if supply exists
    const supply = db.prepare('SELECT id, current_quantity, name FROM supplies WHERE id = ?').get(supply_id);
    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    // Start transaction
    const insertTransaction = db.prepare(`
      INSERT INTO transactions (supply_id, quantity_change, reason, employee_name, notes)
      VALUES (?, ?, ?, ?, ?)
    `);

    const updateSupply = db.prepare(`
      UPDATE supplies 
      SET current_quantity = current_quantity + ?,
          last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const transaction = db.transaction(() => {
      const txResult = insertTransaction.run(supply_id, quantity_change, reason, employee_name, notes);
      updateSupply.run(quantity_change, supply_id);
      return txResult;
    });

    const result = transaction();

    // Get the updated supply info
    const updatedSupply = db.prepare('SELECT current_quantity FROM supplies WHERE id = ?').get(supply_id);

    res.status(201).json({
      message: 'Transaction recorded successfully',
      transaction_id: result.lastInsertRowid,
      supply_name: supply.name,
      previous_quantity: supply.current_quantity,
      new_quantity: updatedSupply.current_quantity
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get transaction statistics
router.get('/stats', (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN quantity_change < 0 THEN 1 ELSE 0 END) as items_taken,
        SUM(CASE WHEN quantity_change > 0 THEN 1 ELSE 0 END) as items_restocked,
        COUNT(DISTINCT supply_id) as unique_supplies,
        COUNT(DISTINCT employee_name) as unique_employees
      FROM transactions
      WHERE timestamp >= datetime('now', '-' || ? || ' days')
    `).get(days);

    // Most used supplies
    const mostUsed = db.prepare(`
      SELECT 
        s.name,
        s.unit,
        COUNT(*) as usage_count,
        SUM(ABS(t.quantity_change)) as total_quantity
      FROM transactions t
      JOIN supplies s ON t.supply_id = s.id
      WHERE t.quantity_change < 0 
        AND t.timestamp >= datetime('now', '-' || ? || ' days')
      GROUP BY s.id
      ORDER BY total_quantity DESC
      LIMIT 10
    `).all(days);

    // Activity by day
    const dailyActivity = db.prepare(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as transaction_count,
        SUM(ABS(quantity_change)) as items_moved
      FROM transactions
      WHERE timestamp >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `).all(days);

    res.json({
      period_days: days,
      summary: stats,
      most_used_supplies: mostUsed,
      daily_activity: dailyActivity
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ error: 'Failed to fetch transaction statistics' });
  }
});

export default router;


import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Google Forms endpoint - public (no auth required)
router.post('/submit', (req, res) => {
  try {
    const { supply_name, quantity, employee_name, notes } = req.body;

    // Validation
    if (!supply_name || !quantity || !employee_name) {
      return res.status(400).json({ 
        error: 'Missing required fields: supply_name, quantity, employee_name' 
      });
    }

    // Find supply by name
    const supply = db.prepare('SELECT id, current_quantity, name FROM supplies WHERE name = ?').get(supply_name);
    if (!supply) {
      return res.status(404).json({ error: `Supply not found: ${supply_name}` });
    }

    // Create transaction with negative quantity (items taken)
    const quantity_change = -Math.abs(quantity);

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
      const txResult = insertTransaction.run(
        supply.id, 
        quantity_change, 
        'Item taken via form', 
        employee_name, 
        notes || null
      );
      updateSupply.run(quantity_change, supply.id);
      return txResult;
    });

    const result = transaction();

    // Get the updated supply info
    const updatedSupply = db.prepare('SELECT current_quantity FROM supplies WHERE id = ?').get(supply.id);

    res.status(201).json({
      success: true,
      message: `Successfully recorded: ${Math.abs(quantity_change)} ${supply.name} taken by ${employee_name}`,
      transaction_id: result.lastInsertRowid,
      supply_name: supply.name,
      previous_quantity: supply.current_quantity,
      new_quantity: updatedSupply.current_quantity
    });
  } catch (error) {
    console.error('Error submitting transaction:', error);
    res.status(500).json({ error: 'Failed to submit transaction' });
  }
});

export default router;


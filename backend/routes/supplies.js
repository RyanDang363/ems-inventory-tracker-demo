import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Get all supplies with category information
router.get('/', (req, res) => {
  try {
    const supplies = db.prepare(`
      SELECT 
        s.*,
        c.name as category_name,
        CASE 
          WHEN s.current_quantity <= s.min_threshold THEN 'low'
          WHEN s.current_quantity <= s.min_threshold * 1.5 THEN 'medium'
          ELSE 'good'
        END as stock_status
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      ORDER BY s.name
    `).all();

    res.json(supplies);
  } catch (error) {
    console.error('Error fetching supplies:', error);
    res.status(500).json({ error: 'Failed to fetch supplies' });
  }
});

// Get supplies that are low in stock
router.get('/low', (req, res) => {
  try {
    const lowStockSupplies = db.prepare(`
      SELECT 
        s.*,
        c.name as category_name,
        CASE 
          WHEN s.current_quantity <= s.min_threshold THEN 'low'
          WHEN s.current_quantity <= s.min_threshold * 1.5 THEN 'medium'
          ELSE 'good'
        END as stock_status
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      WHERE s.current_quantity <= s.min_threshold * 1.5
      ORDER BY (s.current_quantity * 1.0 / s.min_threshold) ASC
    `).all();

    res.json(lowStockSupplies);
  } catch (error) {
    console.error('Error fetching low stock supplies:', error);
    res.status(500).json({ error: 'Failed to fetch low stock supplies' });
  }
});

// Get a single supply by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const supply = db.prepare(`
      SELECT 
        s.*,
        c.name as category_name
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `).get(id);

    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    res.json(supply);
  } catch (error) {
    console.error('Error fetching supply:', error);
    res.status(500).json({ error: 'Failed to fetch supply' });
  }
});

// Create a new supply
router.post('/', (req, res) => {
  try {
    const { name, category_id, current_quantity, min_threshold, unit, location, description } = req.body;

    // Validation
    if (!name || !category_id || current_quantity === undefined || min_threshold === undefined || !unit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = db.prepare(`
      INSERT INTO supplies (name, category_id, current_quantity, min_threshold, unit, location, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category_id, current_quantity, min_threshold, unit, location, description);

    const newSupply = db.prepare(`
      SELECT 
        s.*,
        c.name as category_name
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(newSupply);
  } catch (error) {
    console.error('Error creating supply:', error);
    res.status(500).json({ error: 'Failed to create supply' });
  }
});

// Update a supply
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, current_quantity, min_threshold, unit, location, description } = req.body;

    // Check if supply exists
    const existing = db.prepare('SELECT id FROM supplies WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    db.prepare(`
      UPDATE supplies 
      SET name = ?, 
          category_id = ?, 
          current_quantity = ?, 
          min_threshold = ?, 
          unit = ?, 
          location = ?, 
          description = ?,
          last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, category_id, current_quantity, min_threshold, unit, location, description, id);

    const updatedSupply = db.prepare(`
      SELECT 
        s.*,
        c.name as category_name
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `).get(id);

    res.json(updatedSupply);
  } catch (error) {
    console.error('Error updating supply:', error);
    res.status(500).json({ error: 'Failed to update supply' });
  }
});

// Delete a supply
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Check if supply exists
    const existing = db.prepare('SELECT id FROM supplies WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Supply not found' });
    }

    // Delete associated transactions first
    db.prepare('DELETE FROM transactions WHERE supply_id = ?').run(id);
    
    // Delete the supply
    db.prepare('DELETE FROM supplies WHERE id = ?').run(id);

    res.json({ message: 'Supply deleted successfully' });
  } catch (error) {
    console.error('Error deleting supply:', error);
    res.status(500).json({ error: 'Failed to delete supply' });
  }
});

// Search supplies
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const supplies = db.prepare(`
      SELECT 
        s.*,
        c.name as category_name
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      WHERE s.name LIKE ? OR c.name LIKE ? OR s.location LIKE ?
      ORDER BY s.name
    `).all(`%${query}%`, `%${query}%`, `%${query}%`);

    res.json(supplies);
  } catch (error) {
    console.error('Error searching supplies:', error);
    res.status(500).json({ error: 'Failed to search supplies' });
  }
});

export default router;


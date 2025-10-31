import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT 
        c.*,
        COUNT(s.id) as supply_count
      FROM categories c
      LEFT JOIN supplies s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a single category
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create a new category
router.post('/', (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newCategory);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

export default router;


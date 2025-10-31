import express from 'express';
import db from '../database/db.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', (req, res) => {
  try {
    // Overall inventory stats
    const inventoryStats = db.prepare(`
      SELECT 
        COUNT(*) as total_supplies,
        SUM(CASE WHEN current_quantity <= min_threshold THEN 1 ELSE 0 END) as critical_low,
        SUM(CASE WHEN current_quantity > min_threshold AND current_quantity <= min_threshold * 1.5 THEN 1 ELSE 0 END) as low_stock,
        SUM(CASE WHEN current_quantity > min_threshold * 1.5 THEN 1 ELSE 0 END) as good_stock
      FROM supplies
    `).get();

    // Recent transactions (last 7 days)
    const recentTransactions = db.prepare(`
      SELECT COUNT(*) as count
      FROM transactions
      WHERE timestamp >= datetime('now', '-7 days')
    `).get();

    // Total value estimate (assuming average cost per category)
    const categoryBreakdown = db.prepare(`
      SELECT 
        c.name as category,
        COUNT(s.id) as item_count,
        SUM(s.current_quantity) as total_quantity,
        SUM(CASE WHEN s.current_quantity <= s.min_threshold THEN 1 ELSE 0 END) as low_items
      FROM categories c
      LEFT JOIN supplies s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    // Most critical supplies (lowest stock relative to threshold)
    const criticalSupplies = db.prepare(`
      SELECT 
        s.id,
        s.name,
        s.current_quantity,
        s.min_threshold,
        s.unit,
        c.name as category_name,
        ROUND((s.current_quantity * 100.0 / s.min_threshold), 1) as stock_percentage
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      WHERE s.current_quantity <= s.min_threshold * 1.5
      ORDER BY (s.current_quantity * 1.0 / s.min_threshold) ASC
      LIMIT 10
    `).all();

    // Recent activity
    const recentActivity = db.prepare(`
      SELECT 
        t.id,
        t.quantity_change,
        t.reason,
        t.employee_name,
        t.timestamp,
        s.name as supply_name,
        s.unit,
        c.name as category_name
      FROM transactions t
      JOIN supplies s ON t.supply_id = s.id
      JOIN categories c ON s.category_id = c.id
      ORDER BY t.timestamp DESC
      LIMIT 10
    `).all();

    // Top users (most transactions)
    const topUsers = db.prepare(`
      SELECT 
        employee_name,
        COUNT(*) as transaction_count,
        SUM(ABS(quantity_change)) as total_items
      FROM transactions
      WHERE employee_name IS NOT NULL
        AND timestamp >= datetime('now', '-30 days')
      GROUP BY employee_name
      ORDER BY transaction_count DESC
      LIMIT 5
    `).all();

    res.json({
      inventory: inventoryStats,
      recent_transactions_count: recentTransactions.count,
      category_breakdown: categoryBreakdown,
      critical_supplies: criticalSupplies,
      recent_activity: recentActivity,
      top_users: topUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get supplies by category for charts
router.get('/category-summary', (req, res) => {
  try {
    const summary = db.prepare(`
      SELECT 
        c.name as category,
        COUNT(s.id) as total_items,
        SUM(s.current_quantity) as total_quantity,
        SUM(CASE WHEN s.current_quantity <= s.min_threshold THEN 1 ELSE 0 END) as low_stock_items,
        AVG(s.current_quantity * 1.0 / s.min_threshold) as avg_stock_ratio
      FROM categories c
      LEFT JOIN supplies s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    res.json(summary);
  } catch (error) {
    console.error('Error fetching category summary:', error);
    res.status(500).json({ error: 'Failed to fetch category summary' });
  }
});

// Get usage trends
router.get('/usage-trends', (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    
    const trends = db.prepare(`
      SELECT 
        DATE(t.timestamp) as date,
        c.name as category,
        COUNT(*) as transaction_count,
        SUM(ABS(t.quantity_change)) as items_used
      FROM transactions t
      JOIN supplies s ON t.supply_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE t.quantity_change < 0 
        AND t.timestamp >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(t.timestamp), c.id
      ORDER BY date DESC, category
    `).all(days);

    res.json(trends);
  } catch (error) {
    console.error('Error fetching usage trends:', error);
    res.status(500).json({ error: 'Failed to fetch usage trends' });
  }
});

export default router;


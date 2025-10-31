import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import googleAuthRouter from './routes/googleAuth.js';
import googleFormsRouter from './routes/googleForms.js';
import suppliesRouter from './routes/supplies.js';
import transactionsRouter from './routes/transactions.js';
import dashboardRouter from './routes/dashboard.js';
import categoriesRouter from './routes/categories.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Public routes (no authentication required)
app.use('/api/auth', authRouter);
app.use('/api/auth', googleAuthRouter); // Google OAuth routes
app.use('/api/transactions', googleFormsRouter); // Google Forms endpoint - public (must be before protected routes)

// Protected routes (require authentication)
app.use('/api/supplies', authenticateToken, suppliesRouter);
app.use('/api/transactions', authenticateToken, transactionsRouter);
app.use('/api/dashboard', authenticateToken, dashboardRouter);
app.use('/api/categories', authenticateToken, categoriesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 EMS Inventory API running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for Vercel
export default app;


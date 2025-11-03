import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './database/db.js'; // Initialize MongoDB connection
import inventoryRouter from './routes/inventory.js';
import googleFormsRouter from './routes/googleForms.js';
import authRouter from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/google-forms', googleFormsRouter); // Keep public for Google Forms

// Protected routes (require authentication)
app.use('/api/inventory', authenticateToken, inventoryRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from frontend build (in production)
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  const frontendBuild = join(__dirname, '../frontend/dist');
  app.use(express.static(frontendBuild));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && req.path !== '/health') {
      res.sendFile(join(frontendBuild, 'index.html'));
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  });
} else {
  // 404 handler for API routes only in development
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.status(404).send('Route not found - Frontend should be running separately in development');
    }
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EMS Inventory API running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel
export default app;

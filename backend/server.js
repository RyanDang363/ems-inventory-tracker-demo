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

// Serve static files from frontend build
const frontendBuild = join(__dirname, '../frontend/dist');

// Serve static assets (JS, CSS, images, etc.)
app.use(express.static(frontendBuild));

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes and health check
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  
  // Serve index.html for all other routes (React Router will handle routing)
  res.sendFile(join(frontendBuild, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Page not found');
    }
  });
});

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

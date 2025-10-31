import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'inventory.db');

// Create database directory if it doesn't exist
if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('🗄️  Initializing database...');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'manager',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS supplies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL DEFAULT 0,
    min_threshold INTEGER NOT NULL DEFAULT 10,
    unit TEXT NOT NULL DEFAULT 'units',
    location TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supply_id INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    reason TEXT NOT NULL,
    employee_name TEXT,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supply_id) REFERENCES supplies(id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_supplies_category ON supplies(category_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_supply ON transactions(supply_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
`);

console.log('✅ Tables created successfully');

// Seed default admin user (password: admin123)
// IMPORTANT: Change this password in production!
const defaultPassword = 'admin123';
const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (username, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`);

insertUser.run('admin', 'admin@ems.local', hashedPassword, 'manager');
console.log('✅ Default admin user created (username: admin, password: admin123)');

// Seed categories
const categories = [
  'Airway Management',
  'Breathing & Oxygen',
  'Medications',
  'Bandages & Dressings',
  'IV Supplies',
  'Diagnostic Equipment',
  'Patient Care',
  'Trauma Supplies',
  'Personal Protection'
];

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
categories.forEach(cat => insertCategory.run(cat));

console.log('✅ Categories seeded');

// Seed supplies
const supplies = [
  // Airway Management
  { name: 'Oropharyngeal Airways (Adult)', category: 'Airway Management', quantity: 25, threshold: 10, unit: 'units', location: 'Cabinet A1' },
  { name: 'Nasopharyngeal Airways', category: 'Airway Management', quantity: 20, threshold: 8, unit: 'units', location: 'Cabinet A1' },
  { name: 'Endotracheal Tubes (7.5mm)', category: 'Airway Management', quantity: 15, threshold: 5, unit: 'units', location: 'Cabinet A2' },
  { name: 'Laryngoscope Blades', category: 'Airway Management', quantity: 8, threshold: 4, unit: 'units', location: 'Cabinet A2' },
  
  // Breathing & Oxygen
  { name: 'Oxygen Masks (Non-Rebreather)', category: 'Breathing & Oxygen', quantity: 30, threshold: 15, unit: 'units', location: 'Oxygen Storage' },
  { name: 'Nasal Cannulas', category: 'Breathing & Oxygen', quantity: 45, threshold: 20, unit: 'units', location: 'Oxygen Storage' },
  { name: 'Bag Valve Masks (Adult)', category: 'Breathing & Oxygen', quantity: 6, threshold: 3, unit: 'units', location: 'Cabinet B1' },
  { name: 'Oxygen Tubing', category: 'Breathing & Oxygen', quantity: 25, threshold: 10, unit: 'units', location: 'Oxygen Storage' },
  
  // Medications
  { name: 'Epinephrine 1mg/mL', category: 'Medications', quantity: 12, threshold: 8, unit: 'vials', location: 'Medication Cabinet' },
  { name: 'Aspirin 325mg', category: 'Medications', quantity: 100, threshold: 30, unit: 'tablets', location: 'Medication Cabinet' },
  { name: 'Nitroglycerin Spray', category: 'Medications', quantity: 5, threshold: 3, unit: 'bottles', location: 'Medication Cabinet' },
  { name: 'Glucose Gel', category: 'Medications', quantity: 20, threshold: 10, unit: 'tubes', location: 'Medication Cabinet' },
  { name: 'Naloxone (Narcan) 4mg', category: 'Medications', quantity: 15, threshold: 8, unit: 'doses', location: 'Medication Cabinet' },
  
  // Bandages & Dressings
  { name: 'Gauze Pads 4x4', category: 'Bandages & Dressings', quantity: 200, threshold: 50, unit: 'pads', location: 'Cabinet C1' },
  { name: 'Trauma Dressings', category: 'Bandages & Dressings', quantity: 30, threshold: 15, unit: 'units', location: 'Cabinet C1' },
  { name: 'Elastic Bandages', category: 'Bandages & Dressings', quantity: 25, threshold: 10, unit: 'rolls', location: 'Cabinet C2' },
  { name: 'Adhesive Tape', category: 'Bandages & Dressings', quantity: 40, threshold: 15, unit: 'rolls', location: 'Cabinet C2' },
  { name: 'Chest Seals', category: 'Bandages & Dressings', quantity: 8, threshold: 5, unit: 'units', location: 'Cabinet C1' },
  
  // IV Supplies
  { name: 'IV Catheters 18G', category: 'IV Supplies', quantity: 35, threshold: 15, unit: 'units', location: 'Cabinet D1' },
  { name: 'IV Catheters 20G', category: 'IV Supplies', quantity: 40, threshold: 20, unit: 'units', location: 'Cabinet D1' },
  { name: 'Saline Solution 1000mL', category: 'IV Supplies', quantity: 25, threshold: 10, unit: 'bags', location: 'IV Storage' },
  { name: 'IV Start Kits', category: 'IV Supplies', quantity: 30, threshold: 12, unit: 'kits', location: 'Cabinet D2' },
  { name: 'Tourniquets', category: 'IV Supplies', quantity: 20, threshold: 8, unit: 'units', location: 'Cabinet D2' },
  
  // Diagnostic Equipment
  { name: 'Blood Pressure Cuffs', category: 'Diagnostic Equipment', quantity: 6, threshold: 3, unit: 'units', location: 'Equipment Bay' },
  { name: 'Stethoscopes', category: 'Diagnostic Equipment', quantity: 5, threshold: 2, unit: 'units', location: 'Equipment Bay' },
  { name: 'Pulse Oximeter Probes', category: 'Diagnostic Equipment', quantity: 10, threshold: 4, unit: 'units', location: 'Equipment Bay' },
  { name: 'Thermometer Probe Covers', category: 'Diagnostic Equipment', quantity: 100, threshold: 30, unit: 'covers', location: 'Cabinet E1' },
  
  // Patient Care
  { name: 'Gloves (Large)', category: 'Personal Protection', quantity: 500, threshold: 100, unit: 'pairs', location: 'Supply Room' },
  { name: 'Gloves (Medium)', category: 'Personal Protection', quantity: 600, threshold: 150, unit: 'pairs', location: 'Supply Room' },
  { name: 'N95 Respirators', category: 'Personal Protection', quantity: 50, threshold: 20, unit: 'masks', location: 'PPE Cabinet' },
  { name: 'Face Shields', category: 'Personal Protection', quantity: 40, threshold: 15, unit: 'shields', location: 'PPE Cabinet' },
  { name: 'Blankets', category: 'Patient Care', quantity: 20, threshold: 8, unit: 'units', location: 'Linen Storage' },
  { name: 'Vomit Bags', category: 'Patient Care', quantity: 60, threshold: 20, unit: 'bags', location: 'Cabinet F1' },
  
  // Trauma Supplies
  { name: 'Cervical Collars (Adjustable)', category: 'Trauma Supplies', quantity: 8, threshold: 4, unit: 'units', location: 'Trauma Bay' },
  { name: 'Splints (SAM Splints)', category: 'Trauma Supplies', quantity: 12, threshold: 6, unit: 'units', location: 'Trauma Bay' },
  { name: 'Backboards', category: 'Trauma Supplies', quantity: 4, threshold: 2, unit: 'units', location: 'Trauma Bay' },
  { name: 'Combat Tourniquets (CAT)', category: 'Trauma Supplies', quantity: 10, threshold: 5, unit: 'units', location: 'Trauma Bay' }
];

const getCategoryId = db.prepare('SELECT id FROM categories WHERE name = ?');
const insertSupply = db.prepare(`
  INSERT INTO supplies (name, category_id, current_quantity, min_threshold, unit, location)
  VALUES (?, ?, ?, ?, ?, ?)
`);

supplies.forEach(supply => {
  const category = getCategoryId.get(supply.category);
  if (category) {
    insertSupply.run(
      supply.name,
      category.id,
      supply.quantity,
      supply.threshold,
      supply.unit,
      supply.location
    );
  }
});

console.log('✅ Supplies seeded');

// Add some sample transactions
const insertTransaction = db.prepare(`
  INSERT INTO transactions (supply_id, quantity_change, reason, employee_name, timestamp)
  VALUES (?, ?, ?, ?, ?)
`);

const sampleTransactions = [
  { supply_id: 1, change: -2, reason: 'Used on call', employee: 'John Smith', days_ago: 1 },
  { supply_id: 5, change: -3, reason: 'Patient treatment', employee: 'Sarah Johnson', days_ago: 1 },
  { supply_id: 9, change: -1, reason: 'Emergency response', employee: 'Mike Davis', days_ago: 2 },
  { supply_id: 14, change: -10, reason: 'Training session', employee: 'Emily White', days_ago: 3 },
  { supply_id: 19, change: -2, reason: 'IV start', employee: 'John Smith', days_ago: 2 },
  { supply_id: 29, change: -20, reason: 'Shift usage', employee: 'Sarah Johnson', days_ago: 1 },
];

sampleTransactions.forEach(tx => {
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - tx.days_ago);
  insertTransaction.run(
    tx.supply_id,
    tx.change,
    tx.reason,
    tx.employee,
    timestamp.toISOString()
  );
});

console.log('✅ Sample transactions added');

db.close();
console.log('🎉 Database initialization complete!');


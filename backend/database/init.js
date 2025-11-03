import mongoose, { connectDB } from './db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Supply from '../models/Supply.js';
import Transaction from '../models/Transaction.js';

async function initializeDatabase() {
  console.log('🗄️  Initializing MongoDB database...');

  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Wait for connection to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear existing data (optional - comment out to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Supply.deleteMany({});
    await Transaction.deleteMany({});

    // Seed default manager accounts
    console.log('Creating default users...');
    const users = [
      { username: 'manager1', password: 'password123', full_name: 'John Manager' },
      { username: 'manager2', password: 'password123', full_name: 'Sarah Manager' }
    ];
    await User.insertMany(users);
    console.log('✅ Default manager accounts created');

    // Seed categories
    console.log('Creating categories...');
    const categoryNames = [
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
    
    const categories = await Category.insertMany(
      categoryNames.map(name => ({ name }))
    );
    
    // Create category map for supplies
    const categoryMap = {};
    categories.forEach((cat, index) => {
      categoryMap[categoryNames[index]] = cat._id;
    });
    console.log('✅ Categories seeded');

    // Seed supplies
    console.log('Creating supplies...');
    const suppliesData = [
      // Airway Management
      { name: 'Oropharyngeal Airways (Adult)', category: 'Airway Management', quantity: 25, threshold: 10, unit: 'units', location: 'Airway Bag' },
      { name: 'Nasopharyngeal Airways (Adult)', category: 'Airway Management', quantity: 20, threshold: 8, unit: 'units', location: 'Airway Bag' },
      { name: 'Endotracheal Tubes 7.5mm', category: 'Airway Management', quantity: 10, threshold: 5, unit: 'units', location: 'Airway Bag' },
      { name: 'Laryngoscope Blades', category: 'Airway Management', quantity: 5, threshold: 3, unit: 'units', location: 'Airway Bag' },
      
      // Breathing & Oxygen
      { name: 'Oxygen Masks (Non-Rebreather)', category: 'Breathing & Oxygen', quantity: 30, threshold: 15, unit: 'units', location: 'O2 Cabinet' },
      { name: 'Nasal Cannulas', category: 'Breathing & Oxygen', quantity: 40, threshold: 20, unit: 'units', location: 'O2 Cabinet' },
      { name: 'BVM (Adult)', category: 'Breathing & Oxygen', quantity: 8, threshold: 4, unit: 'units', location: 'Airway Bag' },
      { name: 'Oxygen Tubing', category: 'Breathing & Oxygen', quantity: 25, threshold: 10, unit: 'units', location: 'O2 Cabinet' },
      
      // Medications
      { name: 'Epinephrine 1mg/mL', category: 'Medications', quantity: 20, threshold: 10, unit: 'vials', location: 'Med Box' },
      { name: 'Aspirin 325mg', category: 'Medications', quantity: 100, threshold: 50, unit: 'tablets', location: 'Med Box' },
      { name: 'Nitroglycerin 0.4mg', category: 'Medications', quantity: 25, threshold: 10, unit: 'tablets', location: 'Med Box' },
      { name: 'Albuterol Inhalers', category: 'Medications', quantity: 10, threshold: 5, unit: 'units', location: 'Med Box' },
      { name: 'Naloxone (Narcan) 4mg', category: 'Medications', quantity: 15, threshold: 8, unit: 'doses', location: 'Med Box' },
      
      // Bandages & Dressings
      { name: 'Gauze Pads 4x4', category: 'Bandages & Dressings', quantity: 200, threshold: 100, unit: 'pads', location: 'Trauma Cabinet' },
      { name: 'Trauma Dressings 10x30', category: 'Bandages & Dressings', quantity: 30, threshold: 15, unit: 'units', location: 'Trauma Cabinet' },
      { name: 'Elastic Bandages 4"', category: 'Bandages & Dressings', quantity: 40, threshold: 20, unit: 'rolls', location: 'Trauma Cabinet' },
      { name: 'Medical Tape 2"', category: 'Bandages & Dressings', quantity: 50, threshold: 25, unit: 'rolls', location: 'Supply Cabinet' },
      
      // IV Supplies
      { name: 'IV Catheters 18G', category: 'IV Supplies', quantity: 50, threshold: 25, unit: 'units', location: 'IV Drawer' },
      { name: 'IV Catheters 20G', category: 'IV Supplies', quantity: 50, threshold: 25, unit: 'units', location: 'IV Drawer' },
      { name: 'Normal Saline 1000mL', category: 'IV Supplies', quantity: 30, threshold: 15, unit: 'bags', location: 'IV Cabinet' },
      { name: 'IV Start Kits', category: 'IV Supplies', quantity: 40, threshold: 20, unit: 'kits', location: 'IV Drawer' },
      
      // Diagnostic Equipment
      { name: 'Blood Glucose Test Strips', category: 'Diagnostic Equipment', quantity: 100, threshold: 50, unit: 'strips', location: 'Diagnostic Kit' },
      { name: 'Pulse Oximeter Probes', category: 'Diagnostic Equipment', quantity: 10, threshold: 5, unit: 'units', location: 'Monitor Bag' },
      { name: 'ECG Electrodes', category: 'Diagnostic Equipment', quantity: 200, threshold: 100, unit: 'units', location: 'Monitor Bag' },
      { name: 'Thermometer Probe Covers', category: 'Diagnostic Equipment', quantity: 100, threshold: 50, unit: 'units', location: 'Diagnostic Kit' },
      
      // Patient Care
      { name: 'Emesis Bags', category: 'Patient Care', quantity: 50, threshold: 25, unit: 'bags', location: 'Supply Cabinet' },
      { name: 'Blankets', category: 'Patient Care', quantity: 20, threshold: 10, unit: 'units', location: 'Linen Cabinet' },
      { name: 'Sheets', category: 'Patient Care', quantity: 30, threshold: 15, unit: 'units', location: 'Linen Cabinet' },
      { name: 'Pillows', category: 'Patient Care', quantity: 10, threshold: 5, unit: 'units', location: 'Linen Cabinet' },
      
      // Trauma Supplies
      { name: 'Tourniquets (CAT)', category: 'Trauma Supplies', quantity: 10, threshold: 5, unit: 'units', location: 'Trauma Bag' },
      { name: 'Chest Seals', category: 'Trauma Supplies', quantity: 8, threshold: 4, unit: 'units', location: 'Trauma Bag' },
      { name: 'Hemostatic Gauze', category: 'Trauma Supplies', quantity: 10, threshold: 5, unit: 'units', location: 'Trauma Bag' },
      { name: 'C-Collars (Adult)', category: 'Trauma Supplies', quantity: 15, threshold: 8, unit: 'units', location: 'Immobilization Cabinet' },
      
      // Personal Protection
      { name: 'Gloves (Large)', category: 'Personal Protection', quantity: 500, threshold: 200, unit: 'pairs', location: 'PPE Station' },
      { name: 'Gloves (Medium)', category: 'Personal Protection', quantity: 500, threshold: 200, unit: 'pairs', location: 'PPE Station' },
      { name: 'N95 Masks', category: 'Personal Protection', quantity: 100, threshold: 50, unit: 'units', location: 'PPE Station' },
      { name: 'Face Shields', category: 'Personal Protection', quantity: 20, threshold: 10, unit: 'units', location: 'PPE Station' },
      { name: 'Gowns', category: 'Personal Protection', quantity: 50, threshold: 25, unit: 'units', location: 'PPE Station' }
    ];

    const supplies = await Supply.insertMany(
      suppliesData.map(supply => ({
        name: supply.name,
        category_id: categoryMap[supply.category],
        current_quantity: supply.quantity,
        min_threshold: supply.threshold,
        unit: supply.unit,
        location: supply.location
      }))
    );
    console.log('✅ Supplies seeded');

    // Add sample transactions
    console.log('Creating sample transactions...');
    const transactionsData = [
      { supply: 'Gauze Pads 4x4', change: -20, type: 'use', employee: 'John Smith' },
      { supply: 'IV Catheters 18G', change: -5, type: 'use', employee: 'Jane Doe' },
      { supply: 'Gloves (Large)', change: 100, type: 'restock', employee: 'Supply Manager' },
      { supply: 'Epinephrine 1mg/mL', change: -2, type: 'use', employee: 'Mike Johnson' },
      { supply: 'N95 Masks', change: -10, type: 'use', employee: 'Sarah Williams' },
      { supply: 'Normal Saline 1000mL', change: 20, type: 'restock', employee: 'Supply Manager' }
    ];

    // Create supply name to ID map
    const supplyMap = {};
    supplies.forEach(supply => {
      supplyMap[supply.name] = supply._id;
    });

    await Transaction.insertMany(
      transactionsData.map(trans => ({
        supply_id: supplyMap[trans.supply],
        quantity_change: trans.change,
        type: trans.type,
        employee_name: trans.employee
      }))
    );
    console.log('✅ Sample transactions added');
    
    console.log('🎉 Database initialization complete!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Supplies: ${supplies.length}`);
    console.log(`  - Transactions: ${transactionsData.length}`);
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Run initialization if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  console.log('Starting initialization...');
  initializeDatabase()
    .then(() => {
      console.log('✅ Initialization script completed');
      setTimeout(() => process.exit(0), 1000);
    })
    .catch((error) => {
      console.error('❌ Initialization failed:', error);
      console.error(error.stack);
      setTimeout(() => process.exit(1), 1000);
    });
}

export default initializeDatabase;
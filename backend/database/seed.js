import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Supply from '../models/Supply.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🗄️  Starting database initialization...');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Supply.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Data cleared');

    // Seed users
    console.log('Creating users...');
    const users = [
      { username: 'manager1', password: 'password123', full_name: 'John Manager' },
      { username: 'manager2', password: 'password123', full_name: 'Sarah Manager' }
    ];
    await User.insertMany(users);
    console.log('✅ Created 2 manager accounts');

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
    
    const categoryMap = {};
    categories.forEach((cat, index) => {
      categoryMap[categoryNames[index]] = cat._id;
    });
    console.log('✅ Created 9 categories');

    // Seed supplies
    console.log('Creating supplies...');
    const suppliesData = [
      { name: 'Oropharyngeal Airways (Adult)', category: 'Airway Management', quantity: 25, threshold: 10, unit: 'units' },
      { name: 'Nasopharyngeal Airways (Adult)', category: 'Airway Management', quantity: 20, threshold: 8, unit: 'units' },
      { name: 'Endotracheal Tubes 7.5mm', category: 'Airway Management', quantity: 10, threshold: 5, unit: 'units' },
      { name: 'Laryngoscope Blades', category: 'Airway Management', quantity: 5, threshold: 3, unit: 'units' },
      { name: 'Oxygen Masks (Non-Rebreather)', category: 'Breathing & Oxygen', quantity: 30, threshold: 15, unit: 'units' },
      { name: 'Nasal Cannulas', category: 'Breathing & Oxygen', quantity: 40, threshold: 20, unit: 'units' },
      { name: 'BVM (Adult)', category: 'Breathing & Oxygen', quantity: 8, threshold: 4, unit: 'units' },
      { name: 'Oxygen Tubing', category: 'Breathing & Oxygen', quantity: 25, threshold: 10, unit: 'units' },
      { name: 'Epinephrine 1mg/mL', category: 'Medications', quantity: 20, threshold: 10, unit: 'vials' },
      { name: 'Aspirin 325mg', category: 'Medications', quantity: 100, threshold: 50, unit: 'tablets' },
      { name: 'Nitroglycerin 0.4mg', category: 'Medications', quantity: 25, threshold: 10, unit: 'tablets' },
      { name: 'Albuterol Inhalers', category: 'Medications', quantity: 10, threshold: 5, unit: 'units' },
      { name: 'Naloxone (Narcan) 4mg', category: 'Medications', quantity: 15, threshold: 8, unit: 'doses' },
      { name: 'Gauze Pads 4x4', category: 'Bandages & Dressings', quantity: 200, threshold: 100, unit: 'pads' },
      { name: 'Trauma Dressings 10x30', category: 'Bandages & Dressings', quantity: 30, threshold: 15, unit: 'units' },
      { name: 'Elastic Bandages 4"', category: 'Bandages & Dressings', quantity: 40, threshold: 20, unit: 'rolls' },
      { name: 'Medical Tape 2"', category: 'Bandages & Dressings', quantity: 50, threshold: 25, unit: 'rolls' },
      { name: 'IV Catheters 18G', category: 'IV Supplies', quantity: 50, threshold: 25, unit: 'units' },
      { name: 'IV Catheters 20G', category: 'IV Supplies', quantity: 50, threshold: 25, unit: 'units' },
      { name: 'Normal Saline 1000mL', category: 'IV Supplies', quantity: 30, threshold: 15, unit: 'bags' },
      { name: 'IV Start Kits', category: 'IV Supplies', quantity: 40, threshold: 20, unit: 'kits' },
      { name: 'Blood Glucose Test Strips', category: 'Diagnostic Equipment', quantity: 100, threshold: 50, unit: 'strips' },
      { name: 'Pulse Oximeter Probes', category: 'Diagnostic Equipment', quantity: 10, threshold: 5, unit: 'units' },
      { name: 'ECG Electrodes', category: 'Diagnostic Equipment', quantity: 200, threshold: 100, unit: 'units' },
      { name: 'Thermometer Probe Covers', category: 'Diagnostic Equipment', quantity: 100, threshold: 50, unit: 'units' },
      { name: 'Emesis Bags', category: 'Patient Care', quantity: 50, threshold: 25, unit: 'bags' },
      { name: 'Blankets', category: 'Patient Care', quantity: 20, threshold: 10, unit: 'units' },
      { name: 'Sheets', category: 'Patient Care', quantity: 30, threshold: 15, unit: 'units' },
      { name: 'Pillows', category: 'Patient Care', quantity: 10, threshold: 5, unit: 'units' },
      { name: 'Tourniquets (CAT)', category: 'Trauma Supplies', quantity: 10, threshold: 5, unit: 'units' },
      { name: 'Chest Seals', category: 'Trauma Supplies', quantity: 8, threshold: 4, unit: 'units' },
      { name: 'Hemostatic Gauze', category: 'Trauma Supplies', quantity: 10, threshold: 5, unit: 'units' },
      { name: 'C-Collars (Adult)', category: 'Trauma Supplies', quantity: 15, threshold: 8, unit: 'units' },
      { name: 'Gloves (Large)', category: 'Personal Protection', quantity: 500, threshold: 200, unit: 'pairs' },
      { name: 'Gloves (Medium)', category: 'Personal Protection', quantity: 500, threshold: 200, unit: 'pairs' },
      { name: 'N95 Masks', category: 'Personal Protection', quantity: 100, threshold: 50, unit: 'units' },
      { name: 'Face Shields', category: 'Personal Protection', quantity: 20, threshold: 10, unit: 'units' },
      { name: 'Gowns', category: 'Personal Protection', quantity: 50, threshold: 25, unit: 'units' }
    ];

    const supplies = await Supply.insertMany(
      suppliesData.map(supply => ({
        name: supply.name,
        category_id: categoryMap[supply.category],
        current_quantity: supply.quantity,
        min_threshold: supply.threshold,
        unit: supply.unit
      }))
    );
    console.log(`✅ Created ${supplies.length} supplies`);

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

    const supplyMap = {};
    supplies.forEach(supply => {
      supplyMap[supply.name] = supply._id;
    });

    const transactions = await Transaction.insertMany(
      transactionsData.map(trans => ({
        supply_id: supplyMap[trans.supply],
        quantity_change: trans.change,
        type: trans.type,
        employee_name: trans.employee
      }))
    );
    console.log(`✅ Created ${transactions.length} sample transactions`);
    
    console.log('\n🎉 Database seeding complete!');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Supplies: ${supplies.length}`);
    console.log(`   - Transactions: ${transactions.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

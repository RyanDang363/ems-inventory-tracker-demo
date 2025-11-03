import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  supply_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply',
    required: true
  },
  quantity_change: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['use', 'restock', 'adjustment']
  },
  employee_name: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

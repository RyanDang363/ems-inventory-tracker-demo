import mongoose from 'mongoose';

const supplySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  current_quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  min_threshold: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  unit: {
    type: String,
    default: 'units',
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

// Add virtual for stock status
supplySchema.virtual('stock_status').get(function() {
  if (this.current_quantity === 0) return 'out_of_stock';
  if (this.current_quantity <= this.min_threshold) return 'low';
  if (this.current_quantity <= this.min_threshold * 1.5) return 'medium';
  return 'good';
});

// Add virtual for stock percentage
supplySchema.virtual('stock_percentage').get(function() {
  if (this.min_threshold === 0) return 0;
  return Math.round((this.current_quantity * 100.0 / this.min_threshold) * 10) / 10;
});

// Ensure virtuals are included in JSON
supplySchema.set('toJSON', { virtuals: true });

const Supply = mongoose.model('Supply', supplySchema);

export default Supply;

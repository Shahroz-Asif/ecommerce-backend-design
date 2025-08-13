import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    category: { type: String, index: true },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Seller from './models/Seller.js';

dotenv.config();
const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri);
  console.log('Connected, seeding...');

  await Product.deleteMany({});
  await Seller.deleteMany({});

  const sellers = await Seller.create([
    { name: 'Alice Fashion Store', email: 'alice@fashion.com', password: 'password123' },
    { name: 'Bob Electronics Hub', email: 'bob@electronics.com', password: 'password123' },
    { name: 'Charlie Accessories Co', email: 'charlie@accessories.com', password: 'password123' }
  ]);

  console.log('Created', sellers.length, 'sellers');

  const sample = [
    { name: 'T-shirt Cotton Base', description: 'Slim fit breathable cotton.', price: 10.3, image: 'https://picsum.photos/seed/t1/600/400', category: 'Clothing', stock: 100, featured: true, seller: sellers[0]._id },
    { name: 'Jeans Shorts Blue', description: 'Denim shorts for men.', price: 10.3, image: 'https://picsum.photos/seed/t2/600/400', category: 'Clothing', stock: 50, featured: true, seller: sellers[0]._id },
    { name: 'Winter Coat Brown', description: 'Warm and stylish.', price: 12.5, image: 'https://picsum.photos/seed/t3/600/400', category: 'Clothing', stock: 35, featured: true, seller: sellers[0]._id },
    
    { name: 'Canon EOS 2000', description: 'Black 10x zoom camera.', price: 998, image: 'https://picsum.photos/seed/p1/600/400', category: 'Electronics', stock: 12, seller: sellers[1]._id },
    { name: 'GoPro Hero 6', description: '4K action camera', price: 998, image: 'https://picsum.photos/seed/p2/600/400', category: 'Electronics', stock: 20, featured: true, seller: sellers[1]._id },
    { name: 'Laptop Pro 14', description: '16GB/512GB laptop', price: 1298, image: 'https://picsum.photos/seed/p3/600/400', category: 'Computers', stock: 9, seller: sellers[1]._id },
    
    { name: 'Leather Wallet', description: 'Genuine leather wallet.', price: 34, image: 'https://picsum.photos/seed/t4/600/400', category: 'Accessories', stock: 120, featured: true, seller: sellers[2]._id },
    { name: 'Backpack 28L', description: 'Durable urban backpack.', price: 99, image: 'https://picsum.photos/seed/t5/600/400', category: 'Accessories', stock: 60, featured: true, seller: sellers[2]._id },
    { name: 'Smart Watch Series 8', description: 'Silver aluminum', price: 199, image: 'https://picsum.photos/seed/p4/600/400', category: 'Electronics', stock: 45, seller: sellers[2]._id }
  ];

  await Product.insertMany(sample);
  console.log('Seeded', sample.length, 'products');
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
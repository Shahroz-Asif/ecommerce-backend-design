import express from 'express';
import Seller from '../models/Seller.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';
import { sellerAuthMiddleware, optionalSellerAuth } from '../middleware/sellerAuth.js';
const router = express.Router();

const redirectIfAuthenticated = (req, res, next) => {
  if (req.seller) {
    return res.redirect('/sellers/dashboard');
  }
  next();
};

router.get('/signup', optionalSellerAuth, redirectIfAuthenticated, (req, res) => {
  res.render('seller-signup', {
    title: 'Seller Signup',
    categories: [],
    q: "",
    category: "",
    seller: res.locals.seller
  });
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await Seller.create({ name, email, password });
    res.redirect('/sellers/login');
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(400).send('Error creating seller account');
  }
});

router.get('/login', optionalSellerAuth, redirectIfAuthenticated, (req, res) => {
  res.render('seller-login', {
    title: 'Seller Login',
    categories: [],
    q: "",
    category: "",
    seller: res.locals.seller
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const seller = await Seller.findOne({ email });
  if (!seller || !(await seller.comparePassword(password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ sellerId: seller._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return res.redirect('/sellers/dashboard');
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/sellers/login');
});

router.get('/dashboard', sellerAuthMiddleware, async (req, res) => {
  const sellerId = req.sellerId;
  const listings = await Product.find({ seller: sellerId });
  
  res.locals.title = 'Dashboard';
  res.locals.categories = [];
  res.locals.q = "";
  res.locals.category = "";
  
  res.render('seller-dashboard', { 
    title: 'Dashboard',
    listings,
    categories: [],
    q: "",
    category: "",
    seller: res.locals.seller
  });
});

router.post('/dashboard/add', sellerAuthMiddleware, async (req, res) => {
  const sellerId = req.sellerId;
  const { name, price, image, description, category, stock } = req.body;
  await Product.create({ name, price, image, description, category, stock, seller: sellerId });
  res.redirect('/sellers/dashboard');
});

router.post('/dashboard/remove/:id', sellerAuthMiddleware, async (req, res) => {
  const sellerId = req.sellerId;
  await Product.deleteOne({ _id: req.params.id, seller: sellerId });
  res.redirect('/sellers/dashboard');
});

export default router;
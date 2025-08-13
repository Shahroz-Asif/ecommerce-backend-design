import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    const featured = await Product.find({ featured: true }).limit(6);
    
    res.locals.title = 'Home';
    res.locals.categories = categories;
    res.locals.q = '';
    res.locals.category = '';
    
    res.render('home', {
      featured,
      title: 'Home',
      categories,
      q: '',
      category: '',
      seller: res.locals.seller
    });
  } catch (err) {
    next(err);
  }
});

export default router;
import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();

    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const categories = await Product.distinct('category');

    res.locals.title = 'Products';
    res.locals.q = q;
    res.locals.category = category;
    res.locals.categories = categories;

    res.render('product-list', {
      title: 'Products',
      products,
      total,
      page,
      totalPages,
      q,
      category,
      categories,
      seller: res.locals.seller
    });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).send('Product not found');

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(6);

    const categories = await Product.distinct('category');

    res.locals.title = product.name;
    res.locals.categories = categories;
    res.locals.category = '';
    res.locals.q = '';

    res.render('product-details', {
      title: product.name,
      product,
      related,
      categories,
      category: '',
      q: '',
      seller: res.locals.seller
    });
  } catch (err) {
    next(err);
  }
});

export default router;
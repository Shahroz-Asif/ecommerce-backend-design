import jwt from 'jsonwebtoken';
import Seller from '../models/Seller.js';

const sellerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.redirect('/sellers/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.sellerId).select('-password');
    if (!seller) {
      res.clearCookie('token');
      return res.redirect('/sellers/login');
    }

    req.seller = seller;
    req.sellerId = seller._id;
    res.locals.seller = seller;
    next();
  } catch (err) {
    console.error('Seller auth error:', err.message);
    res.clearCookie('token');
    return res.redirect('/sellers/login');
  }
};

const optionalSellerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const seller = await Seller.findById(decoded.sellerId).select('-password');
      if (seller) {
        req.seller = seller;
        req.sellerId = seller._id;
        res.locals.seller = seller;
      }
    }
  } catch (err) {
    console.error('Optional seller auth error:', err.message);
    res.clearCookie('token');
  }
  next();
};

export { sellerAuthMiddleware, optionalSellerAuth };

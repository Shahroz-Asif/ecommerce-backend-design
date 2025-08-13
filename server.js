import express from 'express';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { optionalSellerAuth } from './middleware/sellerAuth.js';
import indexRoutes from './routes/index.js';
import productRoutes from './routes/products.js';
import sellerRoutes from './routes/sellers.js';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(optionalSellerAuth);

app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/sellers', sellerRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
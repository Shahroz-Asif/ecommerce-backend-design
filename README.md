# E-commerce Backend

A full-stack e-commerce application with seller authentication and product management.

## Features

- Seller authentication with JWT
- Product management (CRUD operations)
- Category-based product filtering
- Responsive design

## Deployment on Vercel

### Prerequisites
1. MongoDB Atlas account (for cloud database)
2. Vercel account

### Steps

1. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Replace `MONGO_URI` in environment variables

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

3. **Environment Variables**
   Set these in Vercel dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key (32+ characters)
   - `JWT_EXPIRES_IN`: 7d
   - `NODE_ENV`: production

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Seed database (optional)
npm run seed
```

## Environment Variables

Create a `.env` file:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce_dev
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

## Test Accounts

After seeding:
- alice@fashion.com / password123
- bob@electronics.com / password123  
- charlie@accessories.com / password123

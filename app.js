const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const securityMiddleware = require('./middleware/securityMiddleware');

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(securityMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

const productRoutes = require('./controllers/productController');
const orderRoutes = require('./controllers/orderController');
const userRoutes = require('./controllers/userController');
const analyticsRoutes = require('./controllers/analyticsController');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require('mongoose');
const Product = require('../models/Product'); 
const connectDB = require('../config/db');   

const products = [
  {
    name: 'Espresso',
    description: 'Strong and bold espresso shot, perfect for coffee purists.',
    price: 2.99,
    imageUrl: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-cup-of-espresso-coffee-png-image_13148104.png',
    category: 'Coffee'
  },
  {
    name: 'Americano',
    description: 'Espresso diluted with hot water for a classic, smooth taste.',
    price: 3.49,
    imageUrl: 'https://img.freepik.com/free-vector/realistic-cup-black-brewed-coffee-saucer-vector-illustration_1284-66002.jpg',
    category: 'Coffee'
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and a thick layer of foam on top.',
    price: 3.99,
    imageUrl: 'https://png.pngtree.com/png-clipart/20220130/original/pngtree-cappuccino-png-transparent-layer-material-png-image_7241314.png',
    category: 'Coffee'
  },
  {
    name: 'Latte',
    description: 'Espresso shot with steamed milk, topped with a light layer of foam.',
    price: 4.29,
    imageUrl: 'https://png.pngtree.com/png-clipart/20240603/original/pngtree-coffee-latte-seen-up-close-png-image_15237865.png',
    category: 'Coffee'
  },
  {
    name: 'Mocha',
    description: 'Rich chocolate syrup combined with espresso and steamed milk.',
    price: 4.59,
    imageUrl: 'https://png.pngtree.com/png-clipart/20231016/original/pngtree-cafe-mocha-coffee-ingredient-png-image_13324345.png',
    category: 'Coffee'
  },
  {
    name: 'Macchiato',
    description: 'Espresso with a small dollop of milk foam. Strong and flavorful.',
    price: 3.89,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPSloOa3zqkTw49lze4ku7urDSZuBF6zx-Ag&s',
    category: 'Coffee'
  },
  {
    name: 'Cold Brew',
    description: 'Smooth, less acidic coffee brewed slowly in cold water for 12-24 hours.',
    price: 3.79,
    imageUrl: 'https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-cold-brewed-iced-black-coffee-on-plastic-cup-side-view-generative-png-image_11563976.png',
    category: 'Coffee'
  },
  {
    name: 'Flat White',
    description: 'Espresso with steamed milk but little to no foam, silky texture.',
    price: 4.19,
    imageUrl: 'https://png.pngtree.com/png-vector/20241122/ourmid/pngtree-a-cup-of-flat-white-with-latte-art-png-image_14533474.png',
    category: 'Coffee'
  }
];

async function seedData() {
  try {
    await connectDB();

    await Product.deleteMany({});

    await Product.insertMany(products);
    console.log('Sample products inserted into database successfully!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

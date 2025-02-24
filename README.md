# Coffee Shop

## Base URL
```
https://my-coffee-shop-em45.onrender.com/
```

## Setup Instructions
1. Clone the repository
```bash
git clone <repository-url>
cd coffee-shop
```

2. Install dependencies
```bash
npm install
```

3. Environment Variables
Create a `.env` file in the root directory with:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Users
#### Register User
- **POST** `/api/users/register`
- **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
- **POST** `/api/users/login`
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### Get User Profile
- **GET** `/api/users/profile`
- Protected
- Returns user profile information (excluding password)
- **Response:**
```json
{
  "username": "string",
  "email": "string",
  "createdAt": "string"
}
```

#### Update User Profile
- **PUT** `/api/users/profile`
- Protected
- **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Products
#### Get All Products
- **GET** `/api/products`
- Public route
- **Query Parameters:**
  - `search`: Search products by name

#### Get Product by ID
- **GET** `/api/products/:id`
- Public route

#### Create Product
- **POST** `/api/products`
- Protected (Admin only)
- **Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "category": "string"
}
```

#### Update Product
- **PUT** `/api/products/:id`
- Protected (Admin only)
- **Body:** Same as Create Product

#### Delete Product
- **DELETE** `/api/products/:id`
- Protected (Admin only)

### Orders
#### Get Orders
- **GET** `/api/orders`
- Protected
- Returns all orders for admin, user-specific orders for regular users

#### Create Order
- **POST** `/api/orders`
- Protected
- **Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number"
    }
  ],
  "shippingAddress": {
    "type": "Point",
    "coordinates": [number, number]
  }
}
```

#### Delete Order
- **DELETE** `/api/orders/:id`
- Protected (Admin or order owner)

#### Update Order Status
- **PATCH** `/api/orders/:id/status`
- Protected (Admin only)
- **Body:**
```json
{
  "status": "string" // "Pending" | "Processing" | "Shipped" | "Delivered"
}
```

### Analytics
#### Get Sales Analytics
- **GET** `/api/analytics/sales`
- Protected (Admin only)
- Returns product-wise sales data

## Error Responses
All endpoints return error responses in the following format:
```json
{
  "error": "Error message"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
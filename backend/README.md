# iWingMobile Backend API

A Node.js/Express backend API for the iWingMobile mobile phone and accessories store.

## 🚀 Features

- **RESTful API** for phones and accessories
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** for secure access
- **Input Validation** with express-validator
- **Rate Limiting** for API protection
- **CORS** enabled for frontend integration
- **Security Headers** with Helmet
- **Error Handling** middleware
- **Soft Delete** functionality
- **Search and Filtering** capabilities
- **Pagination** support

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/iwingmobile
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Start the server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Base URL

```
http://localhost:5000
```

### Health Check

- `GET /api/health` - Server health status

### Phones API

- `GET /api/phones` - Get all phones (with filtering & pagination)
- `GET /api/phones/:id` - Get phone by ID
- `GET /api/phones/featured/list` - Get featured phones
- `POST /api/phones` - Create new phone (Admin only)
- `PUT /api/phones/:id` - Update phone (Admin only)
- `DELETE /api/phones/:id` - Delete phone (Admin only)

### Accessories API

- `GET /api/accessories` - Get all accessories (with filtering & pagination)
- `GET /api/accessories/:id` - Get accessory by ID
- `GET /api/accessories/featured/list` - Get featured accessories
- `GET /api/accessories/categories/list` - Get all categories
- `POST /api/accessories` - Create new accessory (Admin only)
- `PUT /api/accessories/:id` - Update accessory (Admin only)
- `DELETE /api/accessories/:id` - Delete accessory (Admin only)

## 🔍 Query Parameters

### Filtering

- `brand` - Filter by brand name
- `category` - Filter by category
- `minPrice` & `maxPrice` - Price range filtering
- `featured` - Show only featured items
- `inStock` - Show only in-stock items
- `search` - Text search across name, brand, description

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Sorting

- `sortBy` - Field to sort by (default: 'createdAt')
- `sortOrder` - 'asc' or 'desc' (default: 'desc')

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Admin routes require a user with `role: 'admin'`.

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "pagination": {...} // For paginated responses
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── Phone.js           # Phone model schema
│   └── Accessory.js       # Accessory model schema
├── routes/
│   ├── phones.js          # Phone API routes
│   └── accessories.js     # Accessory API routes
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
└── server.js             # Express server setup
```

## 🧪 Testing the API

You can test the API using tools like:

- **Postman** - Import the endpoints
- **curl** - Command line testing
- **VS Code REST Client** - With .http files

Example API test:

```bash
# Get all phones
curl http://localhost:5000/api/phones

# Get health status
curl http://localhost:5000/api/health
```

## 🚀 Deployment

1. **Set environment variables for production**
2. **Use a process manager like PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "iwingmobile-api"
   ```
3. **Set up reverse proxy with Nginx**
4. **Use a cloud MongoDB service**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

---

**Happy Coding! 🎉**

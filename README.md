# iWingMobile - Complete Mobile Store Application

A full-stack e-commerce application for mobile phones and accessories built with React.js frontend and Node.js backend.

## 🚀 Features

- **Apple-inspired Design**: Sleek, modern interface mimicking Apple's design language
- **GSAP Animations**: Smooth, professional animations throughout the site
- **Phone Catalog**: Display iPhones with multiple color variants (no prices shown)
- **Contact System**: Buyers contact owner for phone purchases
- **Accessories Store**: Full e-commerce functionality with prices and cart
- **Shopping Cart**: Add accessories, adjust quantities, view total
- **Admin Dashboard**: Manage phones and accessories inventory
- **Responsive Design**: Works seamlessly on all devices

## 📁 Project Structure

```
iwing-mobile/
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Cart)
│   │   └── utils/       # API utilities
│   └── package.json
├── backend/           # Express API server
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── config/        # Configuration files
│   └── server.js
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- React 18
- React Router DOM
- GSAP (GreenSock Animation Platform)
- Axios
- Lucide React (Icons)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd iwing-mobile
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iwing-mobile
NODE_ENV=development
```

Start MongoDB:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

Start the backend server:

```bash
npm start
# or for development with auto-restart
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_PASSWORD=iwing2024admin
```

Start the frontend development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## 🎯 Usage

### For Customers

1. **Browse Phones**: Navigate to the Phones page to view available iPhones
2. **Select Colors**: Click on color options to see different variants
3. **Contact for Purchase**: Click "Contact to Purchase" to see owner's contact information
4. **Browse Accessories**: Visit the Accessories page to see products with prices
5. **Shopping Cart**:
   - Click "Add to Cart" on any accessory
   - Click the cart icon in the navbar to view your cart
   - Adjust quantities or remove items
   - View total price

### For Admin

1. Navigate to `/admin` route
2. Enter admin password (default: `iwing2024admin`)
3. **Add Phones**:
   - Enter phone name, specifications, and image URL
   - Add multiple colors with names and hex codes
   - Submit to add to inventory
4. **Add Accessories**:
   - Enter name, description, price, and image URL
   - Submit to add to inventory
5. **Manage Products**: Delete any phone or accessory from the lists

## 🎨 GSAP Animations

The project uses GSAP for smooth animations:

- **Navbar**: Slides in from top on page load
- **Hero Section**: Staggered fade-in animation
- **Product Cards**: Sequential fade-in with delays
- **Phone Cards**: Scale animation on hover
- **Cart Sidebar**: Slide-in animation
- **Modals**: Scale and fade animations

## 🔐 Security Notes

⚠️ **Important**: This is a demo application. For production use:

- Implement proper authentication (JWT, OAuth)
- Add password hashing (bcrypt)
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables securely
- Enable HTTPS
- Add CSRF protection

## 📱 API Endpoints

### Phones

- `GET /api/phones` - Get all phones
- `GET /api/phones/:id` - Get single phone
- `POST /api/phones` - Create phone
- `PUT /api/phones/:id` - Update phone
- `DELETE /api/phones/:id` - Delete phone

### Accessories

- `GET /api/accessories` - Get all accessories
- `GET /api/accessories/:id` - Get single accessory
- `POST /api/accessories` - Create accessory
- `PUT /api/accessories/:id` - Update accessory
- `DELETE /api/accessories/:id` - Delete accessory

## 🎨 Customization

### Colors

Edit `frontend/src/styles.css` to change the color scheme:

- Primary color: `#0071e3` (Apple blue)
- Background: `#000` (Black)
- Text: `#f5f5f7` (Light gray)

### Admin Password

Change in `frontend/.env`:

```env
REACT_APP_ADMIN_PASSWORD=your_secure_password
```

### Database Connection

Change in `backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables in your hosting dashboard

### Backend (Heroku/Railway/DigitalOcean)

1. Push code to your hosting service
2. Set environment variables
3. Ensure MongoDB is accessible (use MongoDB Atlas for cloud hosting)

## 📝 Sample Data

To test the application, add sample products through the admin panel:

**Sample Phone:**

- Name: iPhone 15 Pro Max
- Specs: 6.7" display, A17 Pro chip, 48MP camera, 256GB storage
- Colors: Titanium Natural, Titanium Blue, Titanium White, Titanium Black

**Sample Accessory:**

- Name: AirPods Pro (2nd Gen)
- Description: Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio
- Price: 249.00

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Contact

For inquiries about iWingMobile:

- Phone: +94 77 123 4567
- Email: sales@iwingmobile.com
- Location: 123 Galle Road, Colombo 03, Sri Lanka

---

Made with ❤️ using React, Node.js, and GSAP

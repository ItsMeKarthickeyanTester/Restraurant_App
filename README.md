# Restaurant Management System

A full-featured restaurant management system with menu CRUD operations, shopping cart, billing, payment processing (QR code), bill printing, and monthly sales reporting.

## Features

### Customer Features
- **Menu Display**: Browse all available menu items
- **Shopping Cart**: Add items to cart by clicking on menu items
- **Cart Management**: Adjust quantities, remove items, clear cart
- **Real-time Billing**: Automatic bill calculation
- **Payment QR Code**: Generate QR code for payment
- **Bill Printing**: Print formatted bill receipt

### Admin Features
- **Menu Management (CRUD)**:
  - Create new menu items
  - Read/View all menu items
  - Update existing menu items
  - Delete menu items
- **Sales Reporting**:
  - Monthly sales reports
  - Total revenue tracking
  - Order statistics
  - Popular items analysis
  - Date range filtering

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Database**: JSON file storage
- **Payment**: QR Code generation using qrcode.js
- **Print**: Browser print API

## Installation

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
   - Customer Menu: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin`

## Project Structure

```
/
├── public/
│   ├── index.html          # Customer menu page
│   ├── admin.html          # Admin dashboard
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   └── js/
│       ├── menu.js         # Menu display logic
│       ├── cart.js         # Cart and billing logic
│       ├── admin.js        # Menu management (CRUD)
│       └── reports.js      # Sales reporting
├── server/
│   ├── server.js           # Express server
│   ├── routes/
│   │   ├── menu.js         # Menu API routes
│   │   ├── orders.js       # Orders API routes
│   │   └── reports.js      # Reports API routes
│   └── data/
│       └── database.json   # JSON database
├── package.json
└── README.md
```

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order

### Reports
- `GET /api/reports/monthly?year=2024&month=1` - Get monthly sales report

## Usage

### Customer Flow
1. Browse menu items on the home page
2. Click on any menu item to add it to cart
3. View cart by clicking the cart button (bottom right)
4. Adjust quantities or remove items
5. Click "Pay Now" to generate payment QR code
6. Click "Print Bill" to print the receipt

### Admin Flow
1. Navigate to `/admin`
2. Click "Add New Item" to create menu items
3. Click "Edit" to modify existing items
4. Click "Delete" to remove items
5. Use the report filters to view sales statistics
6. Click "Generate Report" to see monthly sales data

## Default Menu Items

The system comes pre-loaded with the following items:
- Idly (₹30)
- Puttu (₹40)
- Poori (₹35)
- Coffee (₹20)
- Dosai (₹50)
- Vadai (₹25)
- Pazham Pori (₹30)

## Notes

- Cart data is stored in browser localStorage
- Orders are saved to `server/data/database.json`
- QR codes contain payment information in JSON format
- Bill printing uses browser's native print functionality


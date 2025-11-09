const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

// Helper function to read database
function readDB() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write database
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// POST create new order
router.post('/', (req, res) => {
  try {
    const db = readDB();
    const { items, total, customerName } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    const newOrder = {
      id: db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1,
      items,
      total: parseFloat(total),
      customerName: customerName || 'Guest',
      date: new Date().toISOString(),
      status: 'completed'
    };

    db.orders.push(newOrder);
    writeDB(db);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET all orders
router.get('/', (req, res) => {
  try {
    const db = readDB();
    res.json(db.orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET single order by ID
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const order = db.orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;


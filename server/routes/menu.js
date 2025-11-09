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

// GET all menu items
router.get('/', (req, res) => {
  try {
    const db = readDB();
    res.json(db.menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// GET single menu item by ID
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const item = db.menu.find(m => m.id === parseInt(req.params.id));
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// POST create new menu item
router.post('/', (req, res) => {
  try {
    const db = readDB();
    const { name, description, price, image } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newId = db.menu.length > 0 ? Math.max(...db.menu.map(m => m.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name,
      description: description || '',
      price: parseFloat(price),
      image: image || ''
    };

    db.menu.push(newItem);
    writeDB(db);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// PUT update menu item
router.put('/:id', (req, res) => {
  try {
    const db = readDB();
    const itemId = parseInt(req.params.id);
    const itemIndex = db.menu.findIndex(m => m.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const { name, description, price, image } = req.body;
    const updatedItem = {
      ...db.menu[itemIndex],
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(image !== undefined && { image })
    };

    db.menu[itemIndex] = updatedItem;
    writeDB(db);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE menu item
router.delete('/:id', (req, res) => {
  try {
    const db = readDB();
    const itemId = parseInt(req.params.id);
    const itemIndex = db.menu.findIndex(m => m.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    db.menu.splice(itemIndex, 1);
    writeDB(db);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;


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

// GET monthly sales report
router.get('/monthly', (req, res) => {
  try {
    const db = readDB();
    const { month, year } = req.query;
    
    let filteredOrders = db.orders;

    // Filter by month and year if provided
    if (month && year) {
      filteredOrders = db.orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() + 1 === parseInt(month) && 
               orderDate.getFullYear() === parseInt(year);
      });
    } else if (year) {
      filteredOrders = db.orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getFullYear() === parseInt(year);
      });
    }

    // Calculate statistics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate popular items
    const itemCounts = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.name]) {
          itemCounts[item.name] += item.quantity;
        } else {
          itemCounts[item.name] = item.quantity;
        }
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      period: month && year ? `${month}/${year}` : year || 'All time',
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      averageOrderValue: averageOrderValue.toFixed(2),
      popularItems,
      orders: filteredOrders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;


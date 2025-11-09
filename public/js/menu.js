// Load menu items from API
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuItems = await response.json();
        console.log('Menu items loaded:', menuItems);
        if (menuItems && menuItems.length > 0) {
            displayMenu(menuItems);
        } else {
            console.warn('No menu items found');
            document.getElementById('menu-grid').innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No menu items available. Please add items from the Admin panel.</p>';
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menu-grid').innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 2rem;">Error loading menu. Please check the console for details.</p>';
    }
}

// Display menu items
function displayMenu(menuItems) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">₹${item.price.toFixed(2)}</div>
        `;
        menuItem.addEventListener('click', () => addToCart(item));
        menuGrid.appendChild(menuItem);
    });
}

// Initialize menu on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});


// Load menu items from API
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const menuItems = await response.json();
        displayMenu(menuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
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


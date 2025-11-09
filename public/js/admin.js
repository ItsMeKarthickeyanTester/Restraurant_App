// Admin menu management
let menuItems = [];
let editingItemId = null;

// DOM elements
const addMenuItemBtn = document.getElementById('add-menu-item');
const menuForm = document.getElementById('menu-form');
const menuItemForm = document.getElementById('menu-item-form');
const cancelFormBtn = document.getElementById('cancel-form');
const menuItemsList = document.getElementById('menu-items-list');
const formTitle = document.getElementById('form-title');

// Initialize admin page
async function initAdmin() {
    await loadMenuItems();
    
    addMenuItemBtn.addEventListener('click', () => {
        showMenuForm();
    });
    
    cancelFormBtn.addEventListener('click', () => {
        hideMenuForm();
        resetForm();
    });
    
    menuItemForm.addEventListener('submit', handleFormSubmit);
}

// Load menu items
async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        displayMenuItems();
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

// Display menu items
function displayMenuItems() {
    menuItemsList.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item-admin';
        menuItemDiv.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="price">₹${item.price.toFixed(2)}</div>
            <div class="menu-item-actions">
                <button class="btn btn-edit" onclick="editMenuItem(${item.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMenuItem(${item.id})">Delete</button>
            </div>
        `;
        menuItemsList.appendChild(menuItemDiv);
    });
}

// Show menu form
function showMenuForm() {
    menuForm.style.display = 'block';
    addMenuItemBtn.style.display = 'none';
}

// Hide menu form
function hideMenuForm() {
    menuForm.style.display = 'none';
    addMenuItemBtn.style.display = 'block';
}

// Reset form
function resetForm() {
    editingItemId = null;
    formTitle.textContent = 'Add Menu Item';
    menuItemForm.reset();
    document.getElementById('item-id').value = '';
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('item-name').value,
        description: document.getElementById('item-description').value,
        price: parseFloat(document.getElementById('item-price').value),
        image: document.getElementById('item-image').value
    };
    
    try {
        if (editingItemId) {
            // Update existing item
            const response = await fetch(`/api/menu/${editingItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                await loadMenuItems();
                hideMenuForm();
                resetForm();
                alert('Menu item updated successfully!');
            } else {
                alert('Error updating menu item');
            }
        } else {
            // Create new item
            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                await loadMenuItems();
                hideMenuForm();
                resetForm();
                alert('Menu item added successfully!');
            } else {
                alert('Error adding menu item');
            }
        }
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Error saving menu item');
    }
}

// Edit menu item
function editMenuItem(id) {
    const item = menuItems.find(m => m.id === id);
    if (item) {
        editingItemId = id;
        formTitle.textContent = 'Edit Menu Item';
        document.getElementById('item-id').value = id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-description').value = item.description || '';
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-image').value = item.image || '';
        showMenuForm();
    }
}

// Delete menu item
async function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        try {
            const response = await fetch(`/api/menu/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadMenuItems();
                alert('Menu item deleted successfully!');
            } else {
                alert('Error deleting menu item');
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('Error deleting menu item');
        }
    }
}

// Make functions global
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAdmin);


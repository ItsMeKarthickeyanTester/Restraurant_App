// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart');
const payNowBtn = document.getElementById('pay-now');
const printBillBtn = document.getElementById('print-bill');
const qrModal = document.getElementById('qr-modal');
const closeModal = document.querySelector('.close-modal');

// Initialize cart
function initCart() {
    updateCartDisplay();
    
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    clearCartBtn.addEventListener('click', clearCart);
    payNowBtn.addEventListener('click', showQRCode);
    printBillBtn.addEventListener('click', printBill);
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            qrModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            qrModal.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    cartSidebar.classList.add('open');
}

// Update cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show QR Code
async function showQRCode() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const paymentData = {
        amount: total,
        items: cart,
        timestamp: new Date().toISOString()
    };
    
    const qrData = JSON.stringify(paymentData);
    
    // Generate QR code
    const qrContainer = document.getElementById('qr-code-container');
    qrContainer.innerHTML = '';
    
    QRCode.toCanvas(qrContainer, qrData, {
        width: 300,
        margin: 2
    }, async (error) => {
        if (error) {
            console.error('Error generating QR code:', error);
            alert('Error generating QR code');
        } else {
            qrModal.style.display = 'block';
            
            // Save order to database
            try {
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: cart,
                        total: total,
                        customerName: 'Guest'
                    })
                });
            } catch (error) {
                console.error('Error saving order:', error);
            }
        }
    });
}

// Print Bill
async function printBill() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const billPrint = document.getElementById('bill-print');
    const billDate = document.getElementById('bill-date');
    const billItems = document.getElementById('bill-items');
    const billTotalAmount = document.getElementById('bill-total-amount');
    
    billDate.textContent = new Date().toLocaleString();
    billItems.innerHTML = '';
    
    cart.forEach(item => {
        const billItem = document.createElement('div');
        billItem.className = 'bill-item';
        billItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        `;
        billItems.appendChild(billItem);
    });
    
    billTotalAmount.textContent = total.toFixed(2);
    
    // Save order to database
    try {
        await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                total: total,
                customerName: 'Guest'
            })
        });
    } catch (error) {
        console.error('Error saving order:', error);
    }
    
    // Show and print
    billPrint.style.display = 'block';
    window.print();
    billPrint.style.display = 'none';
}

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCart);


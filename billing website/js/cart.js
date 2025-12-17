// Cart operations
var CART_STORAGE_KEY = 'cartItems';
var TRANSACTIONS_STORAGE_KEY = 'transactions';

// Load cart from localStorage
function loadCart() {
    try {
        var cart = localStorage.getItem(CART_STORAGE_KEY);
        if (!cart) {
            return [];
        }
        var parsed = JSON.parse(cart);
        if (!Array.isArray(parsed)) {
            return [];
        }
        
        var validCart = [];
        for (var i = 0; i < parsed.length; i++) {
            if (parsed[i] && parsed[i].itemId && parsed[i].name) {
                validCart.push(parsed[i]);
            }
        }
        return validCart;
    } catch (error) {
        console.error('Error loading cart:', error);
        return [];
    }
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display cart items
function displayCart() {
    var cartContainer = document.getElementById('cart-items');
    var totalElement = document.getElementById('cart-total');
    
    if (!cartContainer) {
        return;
    }

    var cart = loadCart();
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (totalElement) {
            totalElement.textContent = '₹0';
        }
        return;
    }

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var price = parseFloat(item.price);
        if (isNaN(price)) {
            price = 0;
        }
        var quantity = parseInt(item.quantity);
        if (isNaN(quantity)) {
            quantity = 0;
        }
        var itemTotal = price * quantity;
        
        var cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        var escapedName = escapeHtml(item.name);
        cartItem.innerHTML = '<div class="cart-item-info">' +
            '<h4>' + escapedName + '</h4>' +
            '<p class="cart-item-price">₹' + price.toFixed(2) + ' each</p>' +
            '</div>' +
            '<div class="cart-item-controls">' +
            '<button class="btn-quantity" onclick="updateQuantity(' + i + ', -1)">-</button>' +
            '<span class="quantity">' + quantity + '</span>' +
            '<button class="btn-quantity" onclick="updateQuantity(' + i + ', 1)">+</button>' +
            '<button class="btn-remove" onclick="removeFromCart(' + i + ')">Remove</button>' +
            '</div>' +
            '<div class="cart-item-total">' +
            '<strong>₹' + itemTotal.toFixed(2) + '</strong>' +
            '</div>';
        
        cartContainer.appendChild(cartItem);
    }

    calculateTotal();
}

// Update item quantity
function updateQuantity(index, change) {
    try {
        var cart = loadCart();
        if (index < 0 || index >= cart.length) {
            console.error('Invalid cart index:', index);
            return;
        }

        var currentQty = parseInt(cart[index].quantity);
        if (isNaN(currentQty)) {
            currentQty = 0;
        }
        var newQty = currentQty + change;
        
        if (newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQty;
        }

        saveCart(cart);
        displayCart();
        updateCartCount();
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Error updating quantity. Please try again.');
    }
}

// Make function globally accessible
window.updateQuantity = updateQuantity;

// Remove item from cart
function removeFromCart(index) {
    var cart = loadCart();
    if (index < 0 || index >= cart.length) {
        return;
    }

    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartCount();
}

// Make function globally accessible
window.removeFromCart = removeFromCart;

// Calculate total bill
function calculateTotal() {
    var cart = loadCart();
    var total = 0;
    
    for (var i = 0; i < cart.length; i++) {
        var price = parseFloat(cart[i].price);
        if (isNaN(price)) {
            price = 0;
        }
        var quantity = parseInt(cart[i].quantity);
        if (isNaN(quantity)) {
            quantity = 0;
        }
        var itemTotal = price * quantity;
        total = total + itemTotal;
    }
    
    var totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = '₹' + total.toFixed(2);
    }
    return total;
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        saveCart([]);
        displayCart();
        updateCartCount();
        showNotification('Cart cleared!');
    }
}

// Make function globally accessible
window.clearCart = clearCart;

// Show QR code for payment
function showQRCode() {
    var cart = loadCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    var total = calculateTotal();
    var qrModal = document.getElementById('qr-modal');
    var qrTotalElement = document.getElementById('qr-total-amount');
    if (qrModal) {
        if (qrTotalElement) {
            qrTotalElement.textContent = '₹' + total.toFixed(2);
        }
        qrModal.style.display = 'flex';
    }
}

// Make function globally accessible
window.showQRCode = showQRCode;

// Close QR modal
function closeQRModal() {
    var qrModal = document.getElementById('qr-modal');
    if (qrModal) {
        qrModal.style.display = 'none';
    }
}

// Make function globally accessible
window.closeQRModal = closeQRModal;

// Complete payment and save transaction
function completePayment() {
    var cart = loadCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    var total = calculateTotal();
    var transaction = {
        id: 'TXN' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        items: JSON.parse(JSON.stringify(cart)),
        total: total,
        timestamp: Date.now()
    };

    var transactions = loadTransactions();
    transactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

    saveCart([]);
    displayCart();
    updateCartCount();
    closeQRModal();
    showNotification('Payment completed! Transaction saved.');
}

// Make function globally accessible
window.completePayment = completePayment;

// Load transactions
function loadTransactions() {
    var transactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (transactions) {
        return JSON.parse(transactions);
    }
    return [];
}

// Print bill
function printBill() {
    var cart = loadCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    var total = calculateTotal();
    var printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to print the bill');
        return;
    }
    
    var date = new Date().toLocaleString();
    var billContent = '<!DOCTYPE html><html><head><title>Bill - Restaurant</title><style>' +
        'body { font-family: Arial, sans-serif; padding: 20px; }' +
        '.bill-header { text-align: center; margin-bottom: 20px; }' +
        '.bill-header h1 { margin: 0; }' +
        '.bill-info { margin-bottom: 20px; }' +
        'table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }' +
        'th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }' +
        'th { background-color: #f2f2f2; }' +
        '.total-row { font-weight: bold; font-size: 1.2em; }' +
        '.bill-footer { text-align: center; margin-top: 30px; }' +
        '</style></head><body>' +
        '<div class="bill-header"><h1>Restaurant Bill</h1><p>Date: ' + date + '</p></div>' +
        '<div class="bill-info"><table><thead><tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead><tbody>';
    
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var price = parseFloat(item.price);
        if (isNaN(price)) {
            price = 0;
        }
        var qty = parseInt(item.quantity);
        if (isNaN(qty)) {
            qty = 0;
        }
        var escapedName = escapeHtml(item.name);
        billContent += '<tr><td>' + escapedName + '</td><td>' + qty + '</td><td>₹' + price.toFixed(2) + '</td><td>₹' + (price * qty).toFixed(2) + '</td></tr>';
    }
    
    billContent += '<tr class="total-row"><td colspan="3">Total</td><td>₹' + total.toFixed(2) + '</td></tr>' +
        '</tbody></table></div>' +
        '<div class="bill-footer"><p>Thank you for your visit!</p></div>' +
        '</body></html>';
    
    printWindow.document.write(billContent);
    printWindow.document.close();
    setTimeout(function() {
        printWindow.print();
    }, 250);
}

// Make function globally accessible
window.printBill = printBill;

// Show notification
function showNotification(message) {
    try {
        var existing = document.querySelectorAll('.notification');
        for (var i = 0; i < existing.length; i++) {
            existing[i].remove();
        }
        
        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(function() {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 2000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Update cart count
function updateCartCount() {
    try {
        var cart = loadCart();
        var count = 0;
        
        for (var i = 0; i < cart.length; i++) {
            var qty = parseInt(cart[i].quantity);
            if (isNaN(qty)) {
                qty = 0;
            }
            count = count + qty;
        }
        
        var cartCountElements = document.querySelectorAll('.cart-count');
        for (var i = 0; i < cartCountElements.length; i++) {
            cartCountElements[i].textContent = count;
            if (count > 0) {
                cartCountElements[i].style.display = 'inline-block';
            } else {
                cartCountElements[i].style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize cart page
function initCartPage() {
    if (document.getElementById('cart-items')) {
        displayCart();
    }
    updateCartCount();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
} else {
    initCartPage();
}

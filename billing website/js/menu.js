// Menu data management
var MENU_STORAGE_KEY = 'menuItems';
var CART_STORAGE_KEY = 'cartItems';
var TRANSACTIONS_STORAGE_KEY = 'transactions';

// Default menu items with correct food images
var defaultMenuItems = [
    { id: '1', name: 'Idly', price: 30, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop&q=80' },
    { id: '2', name: 'Puttu', price: 40, image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/08/puttu-recipe-1.jpg' },
    { id: '3', name: 'Poori', price: 35, image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Poori_or_Puri.JPG' },
    { id: '4', name: 'Parotta', price: 45, image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Kerala_Porotta.jpg' },
    { id: '5', name: 'Dosa', price: 50, image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2020/10/dosa-recipe-1.jpg' },
    { id: '6', name: 'Vada', price: 20, image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/08/medu-vada-recipe-1.jpg' },
    { id: '7', name: 'Coffee', price: 25, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop&q=80' },
    { id: '8', name: 'Samosa', price: 15, image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/08/samosa-recipe-1.jpg' }
];

// Initialize menu items in localStorage if not exists
function initializeMenu() {
    if (!localStorage.getItem(MENU_STORAGE_KEY)) {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
    }
}

// Load menu items from localStorage
function loadMenuItems() {
    initializeMenu();
    var items = localStorage.getItem(MENU_STORAGE_KEY);
    if (items) {
        return JSON.parse(items);
    }
    return [];
}

// Save menu items to localStorage
function saveMenuItems(items) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) {
        return '';
    }
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display menu items on the page
function displayMenuItems() {
    var menuContainer = document.getElementById('menu-container');
    if (!menuContainer) {
        return;
    }

    var items = loadMenuItems();
    menuContainer.innerHTML = '';

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var card = document.createElement('div');
        card.className = 'menu-card';
        
        var escapedId = String(item.id).replace(/'/g, "\\'");
        var price = parseFloat(item.price);
        if (isNaN(price)) {
            price = 0;
        }
        
        var escapedName = escapeHtml(item.name);
        var imageUrl = item.image;
        var placeholderUrl = 'https://via.placeholder.com/400x300/cccccc/666666?text=' + encodeURIComponent(item.name);
        
        card.innerHTML = '<img src="' + imageUrl + '" alt="' + escapedName + '" onerror="this.onerror=null; this.src=\'' + placeholderUrl + '\';">' +
            '<div class="menu-card-content">' +
            '<h3>' + escapedName + '</h3>' +
            '<p class="price">₹' + price.toFixed(2) + '</p>' +
            '<button class="btn-add-to-cart" onclick="addToCart(\'' + escapedId + '\')">Add to Cart</button>' +
            '</div>';
        
        menuContainer.appendChild(card);
    }
}

// Add item to cart
function addToCart(itemId) {
    var items = loadMenuItems();
    var item = null;
    
    for (var i = 0; i < items.length; i++) {
        if (items[i].id === itemId) {
            item = items[i];
            break;
        }
    }
    
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }

    var cart = getCart();
    var existingItem = null;
    var existingIndex = -1;
    
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].itemId === itemId) {
            existingItem = cart[i];
            existingIndex = i;
            break;
        }
    }

    if (existingItem) {
        var currentQty = parseInt(existingItem.quantity);
        if (isNaN(currentQty)) {
            currentQty = 0;
        }
        existingItem.quantity = currentQty + 1;
    } else {
        var itemPrice = parseFloat(item.price);
        if (isNaN(itemPrice)) {
            itemPrice = 0;
        }
        cart.push({
            itemId: item.id,
            name: item.name,
            price: itemPrice,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showNotification(item.name + ' added to cart!');
}

// Get cart from localStorage
function getCart() {
    var cart = localStorage.getItem(CART_STORAGE_KEY);
    if (cart) {
        return JSON.parse(cart);
    }
    return [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Update cart count indicator
function updateCartCount() {
    try {
        var cart = getCart();
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

// Toggle mobile menu
function toggleMobileMenu() {
    var navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    var navMenu = document.getElementById('nav-menu');
    var toggle = document.querySelector('.mobile-menu-toggle');
    if (navMenu && toggle) {
        if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// Initialize on page load
function initMenuPage() {
    if (document.getElementById('menu-container')) {
        displayMenuItems();
    }
    updateCartCount();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuPage);
} else {
    initMenuPage();
}

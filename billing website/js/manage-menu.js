// Menu management CRUD operations
var MENU_STORAGE_KEY = 'menuItems';

// Initialize menu if not exists
function initializeMenuIfNeeded() {
    if (!localStorage.getItem(MENU_STORAGE_KEY)) {
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
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
    }
}

// Load menu items
function loadMenuItems() {
    initializeMenuIfNeeded();
    var items = localStorage.getItem(MENU_STORAGE_KEY);
    if (items) {
        return JSON.parse(items);
    }
    return [];
}

// Save menu items
function saveMenuItems(items) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
}

// Display menu items for management
function displayMenuForManagement() {
    var tableBody = document.getElementById('menu-table-body');
    if (!tableBody) {
        return;
    }

    var items = loadMenuItems();
    tableBody.innerHTML = '';

    if (items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No menu items. Add your first item!</td></tr>';
        return;
    }

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var row = document.createElement('tr');
        
        var itemPrice = parseFloat(item.price);
        if (isNaN(itemPrice)) {
            itemPrice = 0;
        }
        var placeholderUrl = 'https://via.placeholder.com/50?text=' + encodeURIComponent(item.name);
        
        row.innerHTML = '<td><img src="' + item.image + '" alt="' + item.name + '" class="menu-thumbnail" onerror="this.src=\'' + placeholderUrl + '\'"></td>' +
            '<td>' + item.name + '</td>' +
            '<td>₹' + itemPrice.toFixed(2) + '</td>' +
            '<td>' +
            '<button class="btn-edit" onclick="editMenuItem(' + i + ')">Edit</button>' +
            '<button class="btn-delete" onclick="deleteMenuItem(' + i + ')">Delete</button>' +
            '</td>';
        
        tableBody.appendChild(row);
    }
}

// Show add/edit form
function showMenuForm(editIndex) {
    var form = document.getElementById('menu-form');
    var formTitle = document.getElementById('form-title');
    var formContainer = document.getElementById('form-container');
    
    if (!form || !formContainer) {
        console.error('Form elements not found');
        return;
    }

    if (editIndex !== null && editIndex !== undefined) {
        var items = loadMenuItems();
        if (items[editIndex]) {
            var item = items[editIndex];
            formTitle.textContent = 'Edit Menu Item';
            document.getElementById('item-name').value = item.name;
            document.getElementById('item-price').value = item.price;
            document.getElementById('item-image').value = item.image || '';
            form.dataset.editIndex = editIndex;
        }
    } else {
        formTitle.textContent = 'Add New Menu Item';
        form.reset();
        if (form.dataset.editIndex) {
            delete form.dataset.editIndex;
        }
    }

    formContainer.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Make function globally accessible
window.showMenuForm = showMenuForm;

// Hide form
function hideMenuForm() {
    var formContainer = document.getElementById('form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    var form = document.getElementById('menu-form');
    if (form) {
        form.reset();
        if (form.dataset.editIndex) {
            delete form.dataset.editIndex;
        }
    }
}

// Make function globally accessible
window.hideMenuForm = hideMenuForm;

// Create new menu item
function createMenuItem(event) {
    event.preventDefault();
    
    var name = document.getElementById('item-name').value.trim();
    var price = parseFloat(document.getElementById('item-price').value);
    var image = document.getElementById('item-image').value.trim();

    if (!name || name.length === 0) {
        alert('Please enter a valid item name.');
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price greater than 0.');
        return;
    }

    var items = loadMenuItems();
    var newItem = {
        id: Date.now().toString(),
        name: name,
        price: price,
        image: image || 'https://via.placeholder.com/400x300?text=' + name
    };

    items.push(newItem);
    saveMenuItems(items);
    displayMenuForManagement();
    hideMenuForm();
    event.target.reset();
    showNotification('Menu item added successfully!');
}

// Update existing menu item
function updateMenuItem(event) {
    event.preventDefault();
    
    var form = event.target;
    var editIndex = form.dataset.editIndex;
    
    if (editIndex === undefined) {
        createMenuItem(event);
        return;
    }

    var name = document.getElementById('item-name').value.trim();
    var price = parseFloat(document.getElementById('item-price').value);
    var image = document.getElementById('item-image').value.trim();

    if (!name || name.length === 0) {
        alert('Please enter a valid item name.');
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price greater than 0.');
        return;
    }

    var items = loadMenuItems();
    var indexNum = parseInt(editIndex);
    if (indexNum >= 0 && indexNum < items.length) {
        items[indexNum].name = name;
        items[indexNum].price = price;
        if (image) {
            items[indexNum].image = image;
        }
        
        saveMenuItems(items);
        displayMenuForManagement();
        hideMenuForm();
        form.reset();
        delete form.dataset.editIndex;
        showNotification('Menu item updated successfully!');
    }
}

// Edit menu item
function editMenuItem(index) {
    showMenuForm(index);
}

// Make function globally accessible
window.editMenuItem = editMenuItem;

// Delete menu item
function deleteMenuItem(index) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
        return;
    }

    var items = loadMenuItems();
    if (index >= 0 && index < items.length) {
        items.splice(index, 1);
        saveMenuItems(items);
        displayMenuForManagement();
        showNotification('Menu item deleted successfully!');
    }
}

// Make function globally accessible
window.deleteMenuItem = deleteMenuItem;

// Handle form submission
function handleMenuFormSubmit(event) {
    event.preventDefault();
    var form = event.target;
    
    if (form.dataset.editIndex !== undefined) {
        updateMenuItem(event);
    } else {
        createMenuItem(event);
    }
}

// Show notification
function showNotification(message) {
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
}

// Initialize on page load
function initManageMenuPage() {
    displayMenuForManagement();
    var form = document.getElementById('menu-form');
    if (form) {
        form.addEventListener('submit', handleMenuFormSubmit);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManageMenuPage);
} else {
    initManageMenuPage();
}

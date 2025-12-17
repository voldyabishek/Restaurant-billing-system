// Sales report calculations
var TRANSACTIONS_STORAGE_KEY = 'transactions';
var MENU_STORAGE_KEY = 'menuItems';

// Load transactions
function loadTransactions() {
    var transactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (transactions) {
        return JSON.parse(transactions);
    }
    return [];
}

// Load menu items (not needed for sales report but kept for compatibility)
function loadMenuItems() {
    var items = localStorage.getItem(MENU_STORAGE_KEY);
    if (items) {
        return JSON.parse(items);
    }
    return [];
}

// Filter transactions by month and year
function filterByMonth(transactions, month, year) {
    var filtered = [];
    for (var i = 0; i < transactions.length; i++) {
        var txn = transactions[i];
        try {
            if (!txn || !txn.date) {
                continue;
            }
            var txnDate = new Date(txn.date);
            if (isNaN(txnDate.getTime())) {
                continue;
            }
            if (txnDate.getMonth() === month && txnDate.getFullYear() === year) {
                filtered.push(txn);
            }
        } catch (error) {
            console.error('Error filtering transaction:', error, txn);
        }
    }
    return filtered;
}

// Calculate sales statistics
function calculateSales(transactions) {
    var totalSales = 0;
    for (var i = 0; i < transactions.length; i++) {
        var total = parseFloat(transactions[i].total);
        if (isNaN(total)) {
            total = 0;
        }
        totalSales = totalSales + total;
    }
    var transactionCount = transactions.length;
    
    // Item-wise breakdown
    var itemSales = {};
    for (var i = 0; i < transactions.length; i++) {
        var txn = transactions[i];
        if (!txn.items || !Array.isArray(txn.items)) {
            continue;
        }
        for (var j = 0; j < txn.items.length; j++) {
            var item = txn.items[j];
            if (!item || !item.name) {
                continue;
            }
            if (!itemSales[item.name]) {
                itemSales[item.name] = {
                    name: item.name,
                    quantity: 0,
                    revenue: 0
                };
            }
            var qty = parseInt(item.quantity);
            if (isNaN(qty)) {
                qty = 0;
            }
            var price = parseFloat(item.price);
            if (isNaN(price)) {
                price = 0;
            }
            itemSales[item.name].quantity = itemSales[item.name].quantity + qty;
            itemSales[item.name].revenue = itemSales[item.name].revenue + (price * qty);
        }
    }

    // Convert object to array and sort
    var itemSalesArray = [];
    for (var key in itemSales) {
        if (itemSales.hasOwnProperty(key)) {
            itemSalesArray.push(itemSales[key]);
        }
    }
    
    // Sort by revenue (descending)
    for (var i = 0; i < itemSalesArray.length - 1; i++) {
        for (var j = i + 1; j < itemSalesArray.length; j++) {
            if (itemSalesArray[i].revenue < itemSalesArray[j].revenue) {
                var temp = itemSalesArray[i];
                itemSalesArray[i] = itemSalesArray[j];
                itemSalesArray[j] = temp;
            }
        }
    }

    return {
        totalSales: totalSales,
        transactionCount: transactionCount,
        itemSales: itemSalesArray
    };
}

// Display sales report
function displayReport() {
    var monthSelect = document.getElementById('report-month');
    var yearSelect = document.getElementById('report-year');
    var reportContainer = document.getElementById('report-container');
    
    if (!monthSelect || !yearSelect || !reportContainer) {
        return;
    }

    var selectedMonth = parseInt(monthSelect.value);
    var selectedYear = parseInt(yearSelect.value);
    
    var allTransactions = loadTransactions();
    var filteredTransactions = filterByMonth(allTransactions, selectedMonth, selectedYear);
    var sales = calculateSales(filteredTransactions);

    var reportHTML = '<div class="report-summary">' +
        '<div class="summary-card">' +
        '<h3>Total Sales</h3>' +
        '<p class="summary-value">₹' + sales.totalSales.toFixed(2) + '</p>' +
        '</div>' +
        '<div class="summary-card">' +
        '<h3>Transactions</h3>' +
        '<p class="summary-value">' + sales.transactionCount + '</p>' +
        '</div>' +
        '<div class="summary-card">' +
        '<h3>Average Order</h3>' +
        '<p class="summary-value">₹';
    
    if (sales.transactionCount > 0) {
        var avgOrder = sales.totalSales / sales.transactionCount;
        reportHTML = reportHTML + avgOrder.toFixed(2);
    } else {
        reportHTML = reportHTML + '0.00';
    }
    
    reportHTML = reportHTML + '</p></div></div>' +
        '<div class="item-breakdown">' +
        '<h3>Item-wise Sales Breakdown</h3>';
    
    if (sales.itemSales.length > 0) {
        reportHTML = reportHTML + '<table class="sales-table">' +
            '<thead><tr><th>Item Name</th><th>Quantity Sold</th><th>Revenue</th></tr></thead>' +
            '<tbody>';
        
        for (var i = 0; i < sales.itemSales.length; i++) {
            var item = sales.itemSales[i];
            reportHTML = reportHTML + '<tr>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>₹' + item.revenue.toFixed(2) + '</td>' +
                '</tr>';
        }
        
        reportHTML = reportHTML + '</tbody></table>';
    } else {
        reportHTML = reportHTML + '<p class="no-data">No sales data for this month.</p>';
    }
    
    reportHTML = reportHTML + '</div>';
    reportContainer.innerHTML = reportHTML;
}

// Initialize month and year dropdowns
function initializeDateSelects() {
    var monthSelect = document.getElementById('report-month');
    var yearSelect = document.getElementById('report-year');
    
    if (!monthSelect || !yearSelect) {
        return;
    }

    var now = new Date();
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    
    yearSelect.innerHTML = '';
    for (var year = currentYear - 5; year <= currentYear + 1; year++) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
    
    monthSelect.value = currentMonth;
    
    monthSelect.addEventListener('change', displayReport);
    yearSelect.addEventListener('change', displayReport);
}

// Initialize on page load
function initSalesReportPage() {
    initializeDateSelects();
    displayReport();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSalesReportPage);
} else {
    initSalesReportPage();
}

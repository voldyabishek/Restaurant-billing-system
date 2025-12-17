# Restaurant Billing Website - Final Version

A complete, fully functional restaurant billing system with menu management, cart operations, billing, and sales reporting features.

## 🎯 Features

### ✅ Core Features
- **Menu Display** - Beautiful card-based menu with images
- **Add to Cart** - One-click add items to cart
- **Cart Management** - Adjust quantities, remove items
- **Bill Calculation** - Automatic total calculation
- **Payment** - Pay Now button with QR code
- **Print Bill** - Professional bill printing
- **Clear Cart** - Easy cart clearing
- **Menu Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Sales Report** - Monthly sales analysis with item-wise breakdown
- **Data Persistence** - All data stored in browser localStorage

### 🎨 Design Features
- **iOS Theme** - Modern iOS-inspired design
- **Glassmorphism** - Beautiful blur effects throughout
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Professional transitions and effects
- **Modern UI** - Clean, intuitive interface

## 📁 File Structure

```
billing website/
├── index.html              # Menu display page
├── cart.html               # Cart and billing page
├── manage-menu.html        # Menu management page
├── sales-report.html       # Sales report page
├── css/
│   └── style.css          # iOS theme with blur effects
├── js/
│   ├── menu.js            # Menu data management
│   ├── cart.js            # Cart operations
│   ├── manage-menu.js     # CRUD operations
│   └── sales-report.js    # Sales calculations
└── images/                # Image storage folder
```

## 🚀 Getting Started

1. **Open the Website**
   - Simply open `index.html` in any modern web browser
   - No server or installation required!

2. **Default Menu Items**
   - Idly - ₹30
   - Puttu - ₹40
   - Poori - ₹35
   - Coffee - ₹25
   - Dosa - ₹50
   - Vada - ₹20
   - Samosa - ₹15

## 📖 How to Use

### For Customers

1. **View Menu** (`index.html`)
   - Browse menu items with images
   - Click "Add to Cart" to add items

2. **Manage Cart** (`cart.html`)
   - View all cart items
   - Adjust quantities (+/- buttons)
   - Remove items
   - View total amount
   - Click "Pay Now" for payment
   - Click "Print Bill" to print
   - Click "Clear Cart" to empty cart

### For Restaurant Staff

1. **Manage Menu** (`manage-menu.html`)
   - Click "Add New Item" to add menu items
   - Edit existing items
   - Delete items
   - All changes save automatically

2. **Sales Report** (`sales-report.html`)
   - Select month and year
   - View total sales
   - See transaction count
   - View item-wise sales breakdown

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Styling with iOS theme and blur effects
- **JavaScript (Vanilla)** - Functionality
- **localStorage** - Data persistence

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

### Data Storage
- All data stored in browser localStorage
- Menu items persist across sessions
- Cart items persist across sessions
- Transaction history saved for reports

## 🎨 Customization

### Change QR Code
Edit `cart.html` line 60:
```html
<img src="YOUR_QR_CODE_IMAGE_URL" alt="QR Code" id="qr-image">
```

### Change UPI ID
Edit `cart.html` line 92:
```javascript
qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI_ID:your-actual-upi-id@paytm&amount=${total.toFixed(2)}`;
```

### Change Colors
Edit `css/style.css`:
```css
:root {
    --ios-blue: #007AFF;      /* Primary color */
    --ios-gray: #8E8E93;      /* Secondary color */
    --ios-light-gray: #F2F2F7; /* Background */
}
```

## ✅ All Features Working

- ✅ Menu display with correct images
- ✅ Add to cart functionality
- ✅ Cart quantity management
- ✅ Remove items from cart
- ✅ Total amount calculation and display
- ✅ Pay Now button with QR code
- ✅ Print Bill button
- ✅ Clear Cart button
- ✅ Add menu items
- ✅ Edit menu items
- ✅ Delete menu items
- ✅ Monthly sales report
- ✅ Item-wise sales breakdown
- ✅ Mobile responsive design
- ✅ iOS theme with blur effects
- ✅ Data persistence

## 📱 Mobile Features

- Hamburger menu for navigation
- Touch-friendly buttons
- Responsive layouts
- Optimized for all screen sizes

## 🔒 Data Management

### Clear All Data
To reset the entire application:
```javascript
localStorage.clear();
```

### Export Data (Manual)
Open browser console and run:
```javascript
// Export menu
console.log(JSON.parse(localStorage.getItem('menuItems')));

// Export transactions
console.log(JSON.parse(localStorage.getItem('transactions')));
```

## 🐛 Troubleshooting

### Images Not Loading
- Check internet connection (images load from external URLs)
- Images have fallback placeholders

### Cart Not Updating
- Clear browser cache
- Check browser console for errors
- Ensure JavaScript is enabled

### Print Not Working
- Allow popups in browser
- Check printer settings

## 📝 Notes

- All prices in Indian Rupees (₹)
- Data is stored locally in browser
- No backend server required
- Works offline after initial load
- Images load from external sources

## 🎉 Final Version Status

**Status: ✅ COMPLETE AND FULLY FUNCTIONAL**

All features tested and working:
- Menu display ✅
- Cart operations ✅
- Billing ✅
- Payment QR code ✅
- Print bill ✅
- Menu management ✅
- Sales reports ✅
- Mobile responsive ✅
- iOS theme ✅

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Ensure all files are in correct folders
3. Verify JavaScript is enabled
4. Try clearing browser cache

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅


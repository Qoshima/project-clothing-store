# TAMYR - Clothing Store

**Web Technologies Final Project | Astana IT University | Group SE-2524 | 2026**

TAMYR is a responsive, client-side clothing store inspired by Kazakh heritage and contemporary streetwear. The Final Project extends our Midterm and Endterm website while preserving its original design and functionality. Visitors can browse the collection, save favorites, manage a shopping cart, explore outfit suggestions based on live weather, preview items, place demo orders, and create their own looks.

## Team

- Yernur Alimbekov
- Ulzhan Musakhan
- Assel Yermekkyzy

### Final-stage contributions

| Participant | Main contributions | Main files |
| --- | --- | --- |
| Yernur Alimbekov | Open-Meteo weather API integration, temperature-based product recommendations, Quick View modal, Recently Viewed history | `products.html`, `js/weather.js`, `js/quick-view.js`, `js/catalog.js`, `catalog-final.css` |
| Ulzhan Musakhan | Three-step checkout with validation, OOP `CartItem`, shopping cart calculations, demo-order saving, Order History | `checkout.html`, `checkout.js`, `checkout-final.css`, `js/order-history.js` |
| Assel Yermekkyzy | My Looks complete CRUD interface, OOP `Look` and `Dashboard` classes, personal shopping statistics | `account.html`, `account.css`, `js/account-final.js` |

## Links

- **Live website:** https://qoshima.github.io/project-clothing-store/
- **Source repository:** https://github.com/Qoshima/project-clothing-store

## Technologies

- HTML5, CSS3, Bootstrap 5
- JavaScript (ES6+), DOM manipulation, jQuery
- `fetch()`, `async/await`, Promises, JSON
- JavaScript classes and objects (OOP)
- `localStorage` for client-side persistence
- Git and GitHub Pages

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home page and featured collections |
| `products.html` | Product catalog, filters, cart actions, weather recommendations, Quick View and Recently Viewed |
| `about.html` | TAMYR brand identity and heritage |
| `size-guide.html` | Clothing measurements and size guidance |
| `contact.html` | Validated contact form and interactive FAQ |
| `account.html` | Demo account forms, Order History, Personal Shopping Dashboard and My Looks |
| `checkout.html` | Shopping cart, order summary and three-step demo checkout |

## Final-stage features

### 1. Live weather recommendations - External API

The catalog can request the current temperature for **Astana, Almaty or Shymkent** using the public **Open-Meteo Forecast API**. The returned JSON is processed with JavaScript, and matching products from the existing catalog are rendered dynamically. The interface handles loading, successful results, missing temperature data, and network/API errors.

- Code: `js/weather.js`
- API: https://open-meteo.com/en/docs
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parameters: `latitude`, `longitude`, `current=temperature_2m`, `timezone=auto`
- Method: `GET` via `fetch()` and `async/await`
- **API key:** not required for this public API use

### 2. Quick View and Recently Viewed

The **Quick View** button opens a centered product-details dialog without leaving the catalog. The most recent **three** viewed products are saved in browser storage, restored after reloading the page, shown as interactive cards and removable with **Clear History**.

- Code: `js/quick-view.js`, `js/catalog.js`
- Storage key: `tamyr-recently-viewed-v1`

### 3. Multi-Step Checkout and OOP CartItem

Checkout is divided into **Contact Information → Shipping Details → Review Order**. Each step validates required user input before proceeding. Users can return to previous steps, change cart quantities, remove items and review calculated totals. `CartItem` objects contain product data and a `getTotal()` method used in order calculations.

- Code: `checkout.js`, `checkout.html`
- Cart key: `tamyr-cart-v1`
- Note: all orders are demonstrations; **no payment is collected**.

### 4. Demo Order History

Confirming a demo order saves its date, items, quantities and total in `localStorage`. The Account page dynamically displays saved orders and provides **Clear History**. Order History uses safe JSON parsing and checks stored order data before displaying it.

- Code: `checkout.js`, `js/order-history.js`
- Storage key: `tamyr-orders-v1`

### 5. My Looks - Complete CRUD

Users can create a named outfit using products from the TAMYR catalog, view saved outfits, edit their names or selected products, and delete outfits with confirmation. The application uses the JavaScript `Look` class and persists records locally.

- **Create:** Create New Look
- **Read:** Saved look cards in My Looks
- **Update:** Edit an existing look
- **Delete:** Delete with confirmation
- Code: `js/account-final.js`
- Storage key: `tamyr-looks-v1`

### 6. Personal Shopping Dashboard

The Account page provides a statistics panel with **Total Orders**, **Total Spent**, **Favorite Items** and **Top Category**, calculated from saved order and favorite data. The `Dashboard` class organizes the calculations.

- Code: `js/account-final.js`
- Sources: `tamyr-orders-v1`, `tamyr-favorites-v1`

## Endterm features retained

- Dynamic rendering of the 12-item women's and men's product collection
- Live text search, category filtering, sorting and reset controls
- Saved favorites and Add to Bag actions
- Shopping cart quantity changes, item removal and automatic price calculations
- Validation and feedback for registration, sign-in, contact and checkout forms
- Interactive FAQ and jQuery effects/events
- Responsive layout and original TAMYR branding

## How to run locally

**Option A - local server (recommended):**

```bash
git clone https://github.com/Qoshima/project-clothing-store.git
cd project-clothing-store
python3 -m http.server 8000
```

Open **http://localhost:8000/** in a browser. You can also use a local server extension such as VS Code Live Server. The website needs an internet connection for the Open-Meteo request and CDN-hosted libraries/fonts.

**Option B - deployed site:** open the GitHub Pages link above. No account or installation is required.

## Manual testing checklist

1. **Catalog:** Verify 12 products; search, filter by category, sort, reset, save favorites and add products to the cart.
2. **Weather API:** Select each city and request the current temperature; verify recommendations, loading status and offline/error handling.
3. **Quick View:** Open/close the dialog, test keyboard Escape, review recently viewed items, reload and clear the history.
4. **Cart:** Check quantity controls, removal, subtotal, delivery fee and total; reload to confirm persistence.
5. **Checkout:** Attempt empty/invalid fields, complete all three steps, review the order and confirm a demo purchase.
6. **Order History:** Check the saved demo order on Account, reload the page and clear the history.
7. **My Looks:** Create with validation, reload, edit, cancel edits and delete with confirmation.
8. **Dashboard:** Confirm totals and category statistics agree with demo orders and favorites, including after data changes and a page reload.
9. **Responsive design:** Test Products, Account and Checkout at mobile, tablet and desktop widths, including dialogs and long content.
10. **Technical check:** Navigate all pages and confirm no missing assets or unexpected errors in the browser developer console.

## Data storage and limitations

TAMYR is a **frontend demonstration**, not a live e-commerce backend. Orders and looks are saved only in the current browser and website origin; clearing browser storage will remove them. Demo sign-in is not real server-side authentication. No real checkout payments, order fulfillment or contact-form delivery are performed. The Open-Meteo weather feature relies on an external network service.

---

**Astana IT University - Web Technologies - Final Project (2026)**
<div align="center">

<img src="public/logo.png" alt="Utsaah" width="320"/>

### Handcrafted with zeal: crochet, custom gifts & home decor, made to order
**Browse → design → pay by UPI → track, one handmade order at a time**

[![License: MIT](https://img.shields.io/badge/License-MIT-F5A524?style=flat-square)](#-license)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-D6336C?style=flat-square&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-D6336C?style=flat-square&logo=nodedotjs&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-D6336C?style=flat-square&logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-D6336C?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Images](https://img.shields.io/badge/Images-Cloudinary-D6336C?style=flat-square&logo=cloudinary&logoColor=white)
![Payments](https://img.shields.io/badge/Payments-UPI%20QR%20%2B%20WhatsApp-D6336C?style=flat-square&logo=googlepay&logoColor=white)
![Deployed](https://img.shields.io/badge/Deployed-Vercel%20%7C%20Render%20%7C%20Atlas-D6336C?style=flat-square&logo=vercel&logoColor=white)

**[🌐 Live Store](https://utsaah.vercel.app) · [📊 Admin Panel](https://utsaah-admin.vercel.app) · [⚙️ API Health](https://utsaah-backend-v1-0.onrender.com/api/health) · [📦 Repository](https://github.com/Oliveya-15/Utsaah-V1.0)**

</div>

<br/>

> 💛 **Utsaah runs on simple UPI payments, with no payment gateway.** Customers scan a UPI QR code (or confirm on WhatsApp first) and the shop owner verifies each payment before crafting begins. Details in [UPI & WhatsApp Payments](#-upi--whatsapp-payments).

<br/>

## 📑 Table of Contents

- [✨ What Utsaah Does](#-what-utsaah-does)
- [📸 Screenshots](#-screenshots)
- [🌸 Kriya Studio](#-kriya-studio)
- [💸 UPI & WhatsApp Payments](#-upi--whatsapp-payments)
- [📦 Orders & After-Sales](#-orders--after-sales)
- [📊 Admin Panel](#-admin-panel)
- [🔐 Authentication & Security](#-authentication--security)
- [🧱 Architecture & Workflow](#-architecture--workflow)
- [🧰 Tech Stack](#-tech-stack)
- [🌍 Deployment](#-deployment)
- [🔗 Live Demo](#-live-demo)
- [⚡ Getting Started](#-getting-started)
- [🔧 Environment Variables](#-environment-variables)
- [🔌 API Overview](#-api-overview)
- [📁 Project Structure](#-project-structure)
- [🧪 Honest Limitations](#-honest-limitations)
- [🧭 Roadmap](#-roadmap)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

<br/>

---

## ✨ What Utsaah Does

<p align="center"><img src="public/screenshot-home.png" alt="Utsaah home page" width="820"/></p>
<p align="center"><sub><strong>Home</strong>: hero, category shortcuts, featured picks, new arrivals and best sellers</sub></p>

- 🛍️ **Storefront:** categories, featured / new / best-seller collections, search, price filters, sorting (newest, best reviewed, fastest to craft, best selling, price) and pagination. Product pages show a gallery, specifications, production time, reviews and similar items. Every product sits on the same soft backdrop, so the catalogue reads as one cohesive shelf whatever the photo behind it.
- 🌸 **Kriya Studio:** a drag-and-drop canvas where customers arrange flowers and paper textures into their own bouquet design, then send it to the shop for a quote.
- 🧶 **Custom Orders:** a request form with up to five inspiration photos, colour and size preferences and a WhatsApp or email contact choice. The owner quotes a price from the admin panel.
- 🛒 **Cart & Wishlist:** guests can fill a cart in the browser, and it merges into their account when they log in. The wishlist is for signed-in customers.
- 💳 **Checkout:** saved addresses with a "use my current location" option, gift wrap and chocolate-box add-ons with a handwritten-style gift note, coupon codes and a store wallet.
- 💸 **Pay your way:** scan a UPI QR code, or reserve the order and confirm on WhatsApp first. The shop owner verifies the payment.
- 📦 **Orders & tracking:** a stitched visual tracker, cancellation before production, one-click reorder, returns and refunds, and reviews once an order is delivered.
- 👤 **Account:** profile and password, addresses, wallet, reviews, returns, custom requests, and **forgot password** through an emailed reset link.
- 🔔 **Notifications:** an in-app bell plus transactional emails for orders, payments, shipping and refunds. The owner is alerted by email about new orders, reported payments and new Kriya designs.
- 📊 **Admin panel:** a separate app for products, orders, customers, coupons, returns, Kriya assets and designs, reviews, messages and payment settings.
- 📱 **Responsive:** the whole store works on phones.

<br/>

---

## 📸 Screenshots

### 🛍️ Storefront

<table>
<tr>
<td width="50%"><img src="public/screenshot-shop.png" alt="Shop"/><p align="center"><sub><strong>Shop</strong>: filters, sorting and uniform product cards</sub></p></td>
<td width="50%"><img src="public/screenshot-product.png" alt="Product page"/><p align="center"><sub><strong>Product</strong>: gallery, specs, production time and reviews</sub></p></td>
</tr>
<tr>
<td width="50%"><img src="public/screenshot-kriya.png" alt="Kriya Studio"/><p align="center"><sub><strong>Kriya Studio</strong>: build a bouquet design on the canvas</sub></p></td>
<td width="50%"><img src="public/screenshot-checkout-upi.png" alt="UPI QR checkout"/><p align="center"><sub><strong>Checkout</strong>: scan the UPI QR, then tap "I've Paid"</sub></p></td>
</tr>
</table>

<p align="center"><img src="public/screenshot-order-tracking.png" alt="Order tracking" width="820"/></p>
<p align="center"><sub><strong>Order tracking</strong>: a stitched progress tracker with payment and shipping details</sub></p>

### 📊 Admin Panel

<p align="center"><img src="public/screenshot-admin-dashboard.png" alt="Admin dashboard" width="820"/></p>
<p align="center"><sub><strong>Dashboard</strong>: revenue, top products, birthdays this month and repeat customers</sub></p>

<table>
<tr>
<td width="50%"><img src="public/screenshot-admin-orders.png" alt="Admin order detail"/><p align="center"><sub><strong>Orders</strong>: verify payments and move orders through the pipeline</sub></p></td>
<td width="50%"><img src="public/screenshot-admin-payment-settings.png" alt="Payment settings"/><p align="center"><sub><strong>Payment Settings</strong>: switch the active UPI owner without a redeploy</sub></p></td>
</tr>
</table>

### 📱 Mobile

<table align="center">
<tr>
<td align="center" width="50%"><img src="public/screenshot-mobile-home.png" alt="Home on mobile" width="260"/><p><sub><strong>Mobile (1/2)</strong>: home page</sub></p></td>
<td align="center" width="50%"><img src="public/screenshot-mobile-shop.png" alt="Shop on mobile" width="260"/><p><sub><strong>Mobile (2/2)</strong>: shop with filters</sub></p></td>
</tr>
</table>

<br/>

---

## 🌸 Kriya Studio

<p align="center"><img src="public/kriya-flow.png" alt="Kriya Studio flow" width="820"/></p>

**Kriya** lets a customer design their own bouquet instead of choosing a fixed product. A bespoke arrangement has no fixed price, so it follows a **request → quote → order** flow instead of instant checkout.

| Step | What happens |
|---|---|
| 1. **Build** | The customer picks a category tab (for example *Flower* or *Paper*) and adds elements to the canvas by dragging them or tapping them. |
| 2. **Arrange** | Each element can be moved, resized, rotated, flipped, duplicated, deleted or sent forward and backward in the layer order. |
| 3. **Finalize** | The canvas is rendered to a **PNG preview** in the browser, and the customer reviews it before adding their name, phone number and notes. Guests can submit too. |
| 4. **Quote** | The design reaches the admin panel with its preview, and the owner is emailed. The owner replies with a quoted price and moves it through `New → In Discussion → Quotation Sent → Accepted → Converted To Order` (or `Declined`). |
| 5. **Notify** | Signed-in customers receive an in-app notification at each status change. |

**Canvas controls:** drag, resize and rotate use native Pointer Events, so the same code works for mouse, trackpad and touch. `Delete` or `Backspace` removes the selected element and `Esc` deselects it.

**Fully admin-driven:** the tabs and the draggable elements are not hardcoded. The owner creates categories and uploads transparent PNG elements from **Admin → Kriya Studio**, and they appear in the customizer immediately. Each saved design stores a snapshot of every image it used, so it still renders correctly if an element is later retired. `npm run seed:kriya` loads a starter set of flower and paper cutouts.

<br/>

---

## 💸 UPI & WhatsApp Payments

<p align="center"><img src="public/payment-flow.png" alt="UPI and WhatsApp payment flow" width="820"/></p>

Utsaah is a small two-person business, so payment is deliberately simple: no gateway, no transaction fees and no dependency on both owners being online.

1. At checkout the customer sees the total and chooses **Pay via UPI** or **Confirm on WhatsApp first**.
2. The order is created straight away as `Order Received` with the payment `pending`, so nothing is lost.
3. **UPI path:** a QR code is generated in the browser for whichever owner is currently *active*. The customer pays in any UPI app and taps **"I've Paid"**, which moves the order to `Payment Reported` and emails the owner.
4. **WhatsApp path:** the order is reserved and WhatsApp opens with a pre-filled message containing the order number and total, for customers who want to talk before paying.
5. The owner opens the order in the admin panel, confirms the money arrived and taps **Mark Payment Verified**. The order becomes `Payment Successful`, the customer is notified and crafting can begin.

| Stage | Order status | Payment status | Who acts |
|---|---|---|---|
| Order placed | `Order Received` | `pending` | Customer |
| Customer taps "I've Paid" | `Payment Reported` | `pending` | Customer |
| Owner confirms the money arrived | `Payment Successful` | `paid` | Owner |
| Wallet covers the whole total | `Payment Successful` | `paid` | Automatic, no QR needed |

| Detail | How it works |
|---|---|
| **Switching owners** | **Admin → Payment Settings** holds two owner cards (name and UPI ID) with an *active* switch. Customers always see the active one, and the change applies to the very next checkout. |
| **QR generation** | The browser builds a standard `upi://pay?pa=…&pn=…&am=…&cu=INR&tn=…` link with the exact amount and order number, and renders it with the `qrcode` package. On phones an **Open in UPI App** button uses the same link. |
| **Reconciliation** | Each order stores which owner's UPI it was shown (`upiOwnerUsed`), so the right person knows to expect the money. |
| **Privacy** | The public settings endpoint exposes only the active owner's UPI ID, never the inactive one's. |
| **Owner alerts** | New orders and "I've Paid" reports are emailed to `ADMIN_EMAIL`, so neither owner has to keep the dashboard open. |

<br/>

---

## 📦 Orders & After-Sales

Orders move through one pipeline, and the customer sees each step in their tracker and notifications.

| Phase | Statuses |
|---|---|
| **Payment** | `Order Received` → `Payment Reported` → `Payment Successful` |
| **Preparation** | `Confirmation Sent` → `Acknowledgement Pending` → `Production Started` → `Gift Packaging` → `Packed` |
| **Dispatch** | `Shipping Assigned` → `Shipped` → `Delivered` → `Completed` |
| **After-sales** | `Return Requested` → `Return Approved` → `Refund Initiated` → `Refund Completed`, or `Cancelled` |

| Rule | Details |
|---|---|
| **Cancellation** | Allowed until production starts. Each piece is handmade for its order, so cancellation closes afterwards. The amount paid is credited to the store wallet. |
| **Returns** | Requested within **7 days of delivery** and approved or rejected by the owner. |
| **Refunds** | The customer chooses the **Utsaah Wallet** (instant) or the **original payment method**, which the owner marks complete after sending the money back. |
| **Reviews** | Only after an order is delivered, one per product, with owner moderation. Ratings update the product's average automatically. |
| **Coupons** | Percentage or flat discounts with a minimum purchase, expiry date, usage limit and an active toggle. |
| **Gift options** | Gift wrap (₹49), chocolate box (₹99) and a gift note. |
| **Wallet** | Holds refunds and can pay for a future order, fully or partly. |
| **Shipping** | The owner records the shipping provider, courier and tracking number, and the customer sees them on their order. |

<br/>

---

## 📊 Admin Panel

A separate single-page app with its own login, so customers never download admin code.

| Module | What the owner can do |
|---|---|
| **Dashboard** | Total revenue, order count, average order value, a six-month revenue chart, top-selling products, birthdays this month and repeat customers. |
| **Products** | Full CRUD with multi-image upload to Cloudinary, specifications, tags, price and compare-at price, production days, availability, featured / new / bestseller flags and show / hide. |
| **Categories** | Create, edit, activate or retire categories with an icon and image. |
| **Orders** | Filter by status, verify payments, update the lifecycle (the customer is notified), assign shipping details, add internal notes and see the full status history. |
| **Customers** | List with order counts and total spend, per-customer order history, and activate or deactivate an account. |
| **Coupons** | Create and manage discount codes. |
| **Returns & Refunds** | Approve or reject returns and finish refunds. |
| **Custom Requests** | View inspiration photos, quote a price, reply and change the status. |
| **Kriya Studio** | Manage design categories and the draggable elements. |
| **Kriya Designs** | Review finalized designs with their preview, then quote and reply. |
| **Reviews** | Approve, hide or delete reviews. |
| **Messages** | Read contact-form messages and mark them resolved. |
| **Payment Settings** | Two UPI owners, the active-owner switch, the WhatsApp number and the business name. |

<br/>

---

## 🔐 Authentication & Security

| Area | Implementation |
|---|---|
| **Passwords** | Hashed with **bcrypt** (10 salt rounds) and excluded from every query and API response by default. |
| **Sessions** | Signed **JWT** sent as a Bearer token. The default lifetime is 30 days, set by `JWT_EXPIRE`. |
| **Roles** | `customer` and `admin`. Every admin endpoint requires a valid token **and** the admin role, and the admin panel signs in through its own endpoint, which rejects non-admin accounts. |
| **Route protection** | Checkout, wishlist and the account area require login. The cart, custom requests and Kriya designs also work for guests. |
| **Forgot password** | A random 32-byte token is emailed as a link, and only its **SHA-256 hash** is stored. The link expires after **30 minutes**, works once, and the response is identical whether or not the email has an account. |
| **Ownership checks** | Customers can only view, cancel or return their own orders. Admins can view any order. |
| **Uploads** | Image-only file filter, an 8 MB limit per file, and storage on Cloudinary rather than the server disk. |
| **CORS** | An allow-list limited to the storefront and admin origins. |
| **Error handling** | A central error handler and an async wrapper, so a database error returns clean JSON instead of hanging the request. |

<br/>

---

## 🧱 Architecture & Workflow

<p align="center"><img src="public/architecture-diagram.png" alt="System architecture" width="820"/></p>

Utsaah is **three independent apps and one API**: a customer storefront, an admin panel, and a REST backend that both talk to over HTTPS with JWT. MongoDB Atlas holds the data and Cloudinary holds every image.

| Layer | Responsibility |
|---|---|
| `routes/` | Thin Express routers that map URLs to controllers and attach auth and upload middleware |
| `controllers/` | Business logic, one file per feature (auth, orders, Kriya, returns and so on) |
| `models/` | Mongoose schemas for users, products, orders, settings, Kriya and more |
| `middleware/` | JWT guards (`protect`, `admin`, `optionalAuth`), Cloudinary upload and error handling |
| `utils/` | Token generation, email, notifications, query helpers and the async wrapper |
| `config/` | MongoDB and Cloudinary setup |
| `frontend/src/` and `admin/src/` | React pages, shared components, context providers and a single axios client each |

**Design principles:**

- **Everything the owners change lives in data.** Categories, Kriya elements and payment owners are edited from the admin panel, so none of it needs a redeploy.
- **Graceful degradation.** Without SMTP, emails are logged instead of sent. The server starts listening even while the database connects.
- **Images never touch the server disk.** Render's filesystem is ephemeral, so every upload streams straight to Cloudinary.
- **Free-tier realism.** Every service in the stack has a free tier that is enough for a small shop.

<br/>

---

## 🧰 Tech Stack

<table>
<tr><th>Layer</th><th>Technology</th></tr>
<tr><td>Frontend</td><td>React 19 · Vite · React Router 7 · Tailwind CSS · Lucide icons · axios · React Helmet (SEO tags) · qrcode</td></tr>
<tr><td>Admin panel</td><td>React 19 · Vite · React Router 7 · Tailwind CSS · Recharts · Lucide icons</td></tr>
<tr><td>Backend</td><td>Node.js 18+ · Express 4 · Mongoose 8</td></tr>
<tr><td>Database</td><td>MongoDB Atlas</td></tr>
<tr><td>Auth & Security</td><td>JWT · bcryptjs · Node <code>crypto</code> (reset tokens) · CORS allow-list</td></tr>
<tr><td>Images</td><td>Cloudinary · Multer · multer-storage-cloudinary</td></tr>
<tr><td>Payments</td><td>UPI deep links · <code>qrcode</code> (client-side QR) · WhatsApp click-to-chat</td></tr>
<tr><td>Email</td><td>Nodemailer (any SMTP provider)</td></tr>
<tr><td>Deployment</td><td>Vercel (storefront and admin) · Render (API) · MongoDB Atlas · Cloudinary</td></tr>
</table>

**No paid service is required anywhere in this stack.** Hosting, database and image storage all run on free tiers.

<br/>

---

## 🌍 Deployment

| Part | Host | Notes |
|---|---|---|
| Storefront | **Vercel** | Root directory `frontend`, build `npm run build`, output `dist`, env `VITE_API_URL` |
| Admin panel | **Vercel** | Root directory `admin`, same build settings and env |
| API | **Render** (web service) | Root directory `backend`, build `npm install`, start `npm start`, plus the backend env vars |
| Database | **MongoDB Atlas** (free M0) | Allow network access from anywhere, because Render's outbound IPs change |
| Images | **Cloudinary** (free) | Permanent storage that survives redeploys |
| Email | Any SMTP provider | For example a Gmail App Password, optional |

**Key decisions:**

- **Cloudinary instead of local uploads.** Render wipes anything written to disk on every redeploy, so image files vanished while their paths stayed in MongoDB. Uploads now go straight to Cloudinary and return a permanent URL.
- **DNS workaround for Atlas.** `config/db.js` points Node at public resolvers (`8.8.8.8`, `1.1.1.1`), because some networks fail the SRV lookup that `mongodb+srv://` strings depend on.
- **SPA routing on Vercel.** Add this `vercel.json` to both `frontend/` and `admin/` so deep links and refreshes (for example `/shop`) don't return 404:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

- **Set the origins.** On the backend, `CLIENT_URL` and `ADMIN_URL` must exactly match the deployed Vercel URLs, without a trailing slash, or the browser will block requests.

> ⏳ The API runs on Render's free tier, so the first request after a period of inactivity can take up to a minute while the service wakes up. That is infrastructure, not a bug.

<br/>

---

## 🔗 Live Demo

| | |
|---|---|
| 🌐 **Storefront** | [utsaah.vercel.app](https://utsaah.vercel.app) |
| 📊 **Admin panel** | [utsaah-admin.vercel.app](https://utsaah-admin.vercel.app) |
| ⚙️ **API health** | [utsaah-backend-v1-0.onrender.com/api/health](https://utsaah-backend-v1-0.onrender.com/api/health) |
| 📦 **Source** | [github.com/Oliveya-15/Utsaah-V1.0](https://github.com/Oliveya-15/Utsaah-V1.0) |

> 🔑 Create a free account on the register page to explore the storefront. The admin panel is for the shop owners only.
> ⚠️ This is a live shop, so please don't pay through the UPI QR unless you really want the order.

<br/>

---

## ⚡ Getting Started

**Requirements:** Node.js 18+ and a MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster works well). For image uploads you also need a free [Cloudinary](https://cloudinary.com) account.

### 1. Clone

```bash
git clone https://github.com/Oliveya-15/Utsaah-V1.0.git
cd Utsaah-V1.0
```

### 2. Backend

```bash
cd backend
npm install
# create backend/.env  (see "Environment Variables" below)

npm run seed          # admin account, categories, sample products and coupons
npm run seed:kriya    # optional: starter Kriya flower and paper elements (needs Cloudinary keys)
npm run dev           # http://localhost:5000
```

### 3. Storefront

```bash
cd frontend
npm install
# create frontend/.env with VITE_API_URL=http://localhost:5000/api
npm run dev           # http://localhost:5173
```

### 4. Admin panel

```bash
cd admin
npm install
# create admin/.env with VITE_API_URL=http://localhost:5000/api
npm run dev           # http://localhost:5174
```

### 5. First-time setup

1. Log in to the admin panel with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your backend `.env`.
2. Open **Payment Settings** and enter both owners' UPI IDs, pick the active owner and add your WhatsApp number (digits only, with country code, for example `919876543210`). Checkout shows no payment options until this is filled in.
3. Add categories and products, or use the seeded ones.

<br/>

---

## 🔧 Environment Variables

**`backend/.env`**

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret used to sign login tokens, so make it long and random |
| `JWT_EXPIRE` | | Token lifetime, default `30d` |
| `CLIENT_URL` | ✅ | Storefront origin, used for CORS and the password-reset link |
| `ADMIN_URL` | ✅ | Admin panel origin, used for CORS |
| `CLOUDINARY_CLOUD_NAME` · `CLOUDINARY_API_KEY` · `CLOUDINARY_API_SECRET` | ✅ | Image storage |
| `ADMIN_NAME` · `ADMIN_EMAIL` · `ADMIN_PASSWORD` | ✅ | The admin account created by `npm run seed`. `ADMIN_EMAIL` also receives owner alerts |
| `SMTP_HOST` · `SMTP_PORT` · `SMTP_USER` · `SMTP_PASS` · `EMAIL_FROM` | | Outgoing email. Without these, emails are skipped and logged to the console |
| `PORT` · `NODE_ENV` | | Server port (default `5000`) and environment |

**`frontend/.env` and `admin/.env`**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the API, for example `https://utsaah-backend-v1-0.onrender.com/api` |

> 🔒 Never commit a real `.env` file. All three apps already list it in `.gitignore`.

<br/>

---

## 🔌 API Overview

Base URL: `https://utsaah-backend-v1-0.onrender.com/api`. Routes marked *admin* need a Bearer token from an admin account.

| Area | Base path | Highlights |
|---|---|---|
| **Auth** | `/auth` | `register` · `login` · `admin-login` · `me` · `forgot-password` · `reset-password/:token` |
| **Users** | `/users` | profile · change password · addresses · wallet · *admin:* customer list, detail, activate / deactivate |
| **Catalog** | `/categories` · `/products` | search, filter and sort · `home/collections` · product by slug · *admin:* CRUD and show / hide |
| **Cart** | `/cart` | get · add · update · remove · clear · `merge` a guest cart |
| **Wishlist** | `/wishlist` | get · add · remove |
| **Orders** | `/orders` | `place` · `my` · `:id` · `cancel` · `reorder` · `report-payment` · *admin:* `verify-payment`, `status`, revenue and CRM dashboards |
| **Returns** | `/returns` | request · mine · *admin:* decision, refund, complete |
| **Reviews** | `/reviews` | create after delivery · mine · *admin:* moderate, delete |
| **Coupons** | `/coupons` | `validate` · *admin:* CRUD |
| **Custom requests** | `/custom-requests` | submit (guests allowed) · mine · *admin:* quote and update |
| **Kriya** | `/kriya` | categories · elements · designs (submit, mine) · *admin:* manage categories and elements, quote designs |
| **Notifications** | `/notifications` | list · mark read · mark all read |
| **Newsletter & Contact** | `/newsletter` · `/contact` | subscribe and send a message · *admin:* list and resolve |
| **Settings** | `/settings` | public active payment details · *admin:* read and update |
| **Health** | `/health` | service status |

```bash
curl https://utsaah-backend-v1-0.onrender.com/api/health
```

<br/>

---

## 📁 Project Structure

```
Utsaah-V1.0/
├── public/                     README images: logo, screenshots, diagrams
│
├── backend/
│   ├── config/                 db.js · cloudinary.js
│   ├── controllers/            one file per feature (auth, order, kriya, return, …)
│   ├── middleware/             auth.js · upload.js · errorHandler.js
│   ├── models/                 Mongoose schemas (User, Product, Order, Settings, Kriya*, …)
│   ├── routes/                 Express routers
│   ├── scripts/                testCloudinary.js (checks your Cloudinary keys)
│   ├── seed/                   seed.js · seedKriya.js · kriya-assets/
│   ├── utils/                  email, notifications, JWT, query helpers
│   └── server.js
│
├── frontend/                   customer storefront
│   ├── public/                 favicon, logos, banners
│   └── src/
│       ├── api/                axios client
│       ├── components/         Navbar, Footer, ProductCard, UpiQrPayment, kriya/ …
│       ├── context/            Auth · Cart · Wishlist · Toast
│       ├── pages/              Home, Shop, Kriya, Checkout, … and profile/
│       └── utils/              kriyaSnapshot.js (canvas → PNG)
│
└── admin/                      owner dashboard
    └── src/
        ├── api/ · context/ · components/
        └── pages/              Dashboard, Products, Orders, Kriya, Settings, …
```

<br/>

---

## 🧪 Honest Limitations

| | |
|---|---|
| **Payments are verified by hand** | There is no gateway or automatic reconciliation. "I've Paid" is customer-reported, and the owner confirms it against their own UPI app. |
| **Email needs SMTP** | Without SMTP credentials, notifications still appear in the app but emails are only logged on the server. |
| **No stock counts** | Products are made to order, so they carry an availability flag and production days rather than inventory quantities. |
| **Kriya is quote-based** | A finalized design is a request, not an instant purchase. The owner quotes a price manually. |
| **Shipping is manual** | The owner enters the courier and tracking number. There is no live carrier API yet. |
| **Free-tier cold starts** | The first request after inactivity can take up to a minute on Render's free plan. |
| **No automated tests or CI yet** | Verification so far has been manual. |
| **No rate limiting** | Authentication endpoints are not yet throttled against repeated attempts. |
| **Orphaned images** | Cloudinary files are not deleted when a product or image is removed in the admin panel. |
| **Static Instagram section** | The home-page Instagram block shows curated images rather than a live feed. |

<br/>

---

## 🧭 Roadmap

- [ ] Automatic UPI reconciliation, or an optional payment gateway, so payments confirm without manual checks
- [ ] Shipping integration (for example Shiprocket) with live tracking
- [ ] WhatsApp Business notifications for order updates
- [ ] Automated test suite and a CI pipeline
- [ ] Rate limiting on login and password-reset endpoints
- [ ] Cloudinary cleanup when products or images are deleted
- [ ] PDF invoices for completed orders
- [ ] An AI shopping assistant for product and order questions

<br/>

---

## 📄 License

Released under the **MIT License**.

<br/>

---

## 🙏 Acknowledgments

[React](https://react.dev) · [Vite](https://vitejs.dev) · [Tailwind CSS](https://tailwindcss.com) · [Express](https://expressjs.com) · [Mongoose](https://mongoosejs.com) · [MongoDB Atlas](https://www.mongodb.com/atlas) · [Cloudinary](https://cloudinary.com) · [Recharts](https://recharts.org) · [Lucide](https://lucide.dev) · [qrcode](https://github.com/soldair/node-qrcode) · [Vercel](https://vercel.com) · [Render](https://render.com) · [Google Fonts](https://fonts.google.com)

<br/>

<div align="center">

**Handmade with care, designed and built end to end on free-tier infrastructure.**

<sub>Utsaah · Handcrafted with Zeal · 2026</sub>

</div>

# 🔄 MarketNest System Flow Diagram

Visual guide to understand how the entire system works.

---

## 🎯 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         MARKETNEST                               │
│                   E-Commerce Platform                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         USER AUTHENTICATION              │
        │    (Supabase Auth + Profiles Table)     │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌───────────────┐           ┌───────────────┐
        │  ADMIN ROLE   │           │   USER ROLE   │
        │  (role=admin) │           │  (role=user)  │
        └───────────────┘           └───────────────┘
                │                           │
                ▼                           ▼
```

---

## 👨‍💼 Admin Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                             │
│                      /admin                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   DASHBOARD   │    │   PRODUCTS    │    │    ORDERS     │
│   /admin      │    │ /admin/       │    │ /admin/       │
│               │    │  products     │    │   orders      │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ • Products    │    │ • List All    │    │ • List All    │
│   Count       │    │ • Add New     │    │ • Filter      │
│ • Orders      │    │ • Edit        │    │ • Update      │
│   Count       │    │ • Delete      │    │   Status      │
│ • Revenue     │    │ • Calculator  │    │ • View        │
│ • Recent      │    │               │    │   Details     │
│   Orders      │    │               │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

### Product Management Flow

```
ADD PRODUCT
    │
    ▼
┌─────────────────────────────────────────┐
│  Fill Product Form                      │
│  • Title                                │
│  • Description                          │
│  • Image URL                            │
│  • Category                             │
│  • Stock                                │
│  • Product Type (local/cj)             │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  PRICING CALCULATOR                     │
│                                         │
│  Option 1: Markup Percentage            │
│  ┌─────────────────────────────────┐   │
│  │ Supplier Price: $100            │   │
│  │ Markup %: 25                    │   │
│  │ ─────────────────────────────   │   │
│  │ Selling Price: $125 (auto)     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Option 2: Fixed Profit                 │
│  ┌─────────────────────────────────┐   │
│  │ Supplier Price: $100            │   │
│  │ Fixed Profit: $30               │   │
│  │ ─────────────────────────────   │   │
│  │ Selling Price: $130 (auto)     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Save to Database                       │
│  (products table)                       │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Product Appears in:                    │
│  • Admin Products List                  │
│  • Public Products Page                 │
└─────────────────────────────────────────┘
```

### Order Management Flow

```
VIEW ORDERS
    │
    ▼
┌─────────────────────────────────────────┐
│  Orders List                            │
│  • Filter by Status                     │
│  • View All Orders                      │
│  • See Customer Info                    │
│  • See Product Info                     │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Update Order Status                    │
│  pending → processing → shipped →       │
│  delivered                              │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Update Payment Status                  │
│  pending → paid / failed                │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  View Order Details                     │
│  • Customer Information                 │
│  • Product Information                  │
│  • Delivery Address                     │
│  • Payment Status                       │
│  • Order Timeline                       │
└─────────────────────────────────────────┘
```

---

## 👤 User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   HOME PAGE     │
                    │   /             │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PRODUCTS      │
                    │   /products     │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   BROWSE      │    │    SEARCH     │    │    FILTER     │
│   All         │    │   Products    │    │   Local/      │
│   Products    │    │               │    │   Global      │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │ PRODUCT DETAILS │
                    │ /products/[id]  │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ • View Details  │
                    │ • Select Qty    │
                    │ • See Price     │
                    │ • Check Stock   │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   BUY NOW       │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌───────────────┐   ┌───────────────┐
            │  NOT LOGGED   │   │   LOGGED IN   │
            │      IN       │   │               │
            └───────────────┘   └───────────────┘
                    │                   │
                    ▼                   │
            ┌───────────────┐           │
            │  REDIRECT TO  │           │
            │    LOGIN      │           │
            └───────────────┘           │
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    ┌─────────────────┐
                    │   CHECKOUT      │
                    │   /checkout     │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Fill Form:      │
                    │ • Name          │
                    │ • Phone         │
                    │ • Address       │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  PLACE ORDER    │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Create Order  │    │ Reduce Stock  │    │ Save to DB    │
│ in Database   │    │ Quantity      │    │ (orders)      │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │ ORDER SUCCESS   │
                    │ /orders/success │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ • Confirmation  │
                    │ • Order Details │
                    │ • Next Steps    │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                                           ▼
┌───────────────┐                         ┌───────────────┐
│  MY ORDERS    │                         │   CONTINUE    │
│  /my-orders   │                         │   SHOPPING    │
└───────────────┘                         └───────────────┘
        │
        ▼
┌───────────────┐
│ • View All    │
│   Orders      │
│ • Filter      │
│ • Track       │
│   Status      │
└───────────────┘
        │
        ▼
┌───────────────┐
│ ORDER DETAILS │
│ /my-orders/   │
│    [id]       │
└───────────────┘
        │
        ▼
┌───────────────┐
│ • Full Info   │
│ • Timeline    │
│ • Status      │
│ • Tracking    │
└───────────────┘
```

---

## 🗄️ Database Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
│                      (Supabase PostgreSQL)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   PROFILES    │    │   PRODUCTS    │    │    ORDERS     │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ • id          │    │ • id          │    │ • id          │
│ • email       │    │ • title       │    │ • user_id     │
│ • full_name   │    │ • description │    │ • product_id  │
│ • phone       │    │ • image_url   │    │ • customer_   │
│ • role        │    │ • supplier_   │    │   name        │
│   (admin/     │    │   price       │    │ • customer_   │
│    user)      │    │ • markup_%    │    │   phone       │
│ • created_at  │    │ • profit_amt  │    │ • customer_   │
│ • updated_at  │    │ • selling_    │    │   address     │
│               │    │   price       │    │ • amount_paid │
│               │    │ • category    │    │ • payment_    │
│               │    │ • stock       │    │   status      │
│               │    │ • product_    │    │ • order_      │
│               │    │   type        │    │   status      │
│               │    │ • created_at  │    │ • created_at  │
│               │    │ • updated_at  │    │ • updated_at  │
└───────────────┘    └───────────────┘    └───────────────┘
```

### RLS Policies Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROW LEVEL SECURITY                            │
└─────────────────────────────────────────────────────────────────┘

PRODUCTS TABLE
    │
    ├─ SELECT: Anyone can view
    ├─ INSERT: Only admin
    ├─ UPDATE: Only admin
    └─ DELETE: Only admin

ORDERS TABLE
    │
    ├─ SELECT: Users view own, Admin view all
    ├─ INSERT: Authenticated users
    ├─ UPDATE: Only admin
    └─ DELETE: Only admin

PROFILES TABLE
    │
    ├─ SELECT: Users view own, Admin view all
    ├─ INSERT: System only (on signup)
    ├─ UPDATE: Users update own, Admin update all
    └─ DELETE: Only admin
```

---

## 🔄 Stock Management Flow

```
INITIAL STATE
    │
    ▼
┌─────────────────────────────────────────┐
│  Product Created                        │
│  Stock: 10 units                        │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Product Visible on Public Page        │
│  (stock > 0)                            │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  User Places Order                      │
│  Quantity: 2 units                      │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Checkout Process                       │
│  1. Create order in database            │
│  2. Get current stock (10)              │
│  3. Calculate new stock (10 - 2 = 8)    │
│  4. Update product stock to 8           │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Updated State                          │
│  Stock: 8 units                         │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Product Still Visible                  │
│  (stock > 0)                            │
└─────────────────────────────────────────┘
    │
    │ (After 8 more orders of 1 unit each)
    ▼
┌─────────────────────────────────────────┐
│  Stock: 0 units                         │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Product Hidden from Public Page        │
│  (stock = 0)                            │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Admin Restocks                         │
│  Updates stock to 20                    │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Product Visible Again                  │
│  (stock > 0)                            │
└─────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
NEW USER
    │
    ▼
┌─────────────────────────────────────────┐
│  Signup Page                            │
│  /signup                                │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Fill Form:                             │
│  • Full Name                            │
│  • Phone                                │
│  • Email                                │
│  • Password                             │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Supabase Auth                          │
│  1. Create auth user                    │
│  2. Store metadata (name, phone)        │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Create Profile                         │
│  1. Insert into profiles table          │
│  2. Set role = 'user' (default)         │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Redirect to Dashboard                  │
│  /dashboard                             │
└─────────────────────────────────────────┘

EXISTING USER
    │
    ▼
┌─────────────────────────────────────────┐
│  Login Page                             │
│  /login                                 │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Enter Credentials:                     │
│  • Email                                │
│  • Password                             │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Supabase Auth Verification             │
└─────────────────────────────────────────┘
    │
    ├─ Success ──────────────────────┐
    │                                 ▼
    │                    ┌─────────────────────────┐
    │                    │  Check Role             │
    │                    └─────────────────────────┘
    │                                 │
    │                    ┌────────────┴────────────┐
    │                    ▼                         ▼
    │         ┌─────────────────┐      ┌─────────────────┐
    │         │  role = 'admin' │      │  role = 'user'  │
    │         └─────────────────┘      └─────────────────┘
    │                    │                         │
    │                    ▼                         ▼
    │         ┌─────────────────┐      ┌─────────────────┐
    │         │  Can Access     │      │  Can Access     │
    │         │  /admin         │      │  /products      │
    │         │  /admin/*       │      │  /checkout      │
    │         │  All Features   │      │  /my-orders     │
    │         └─────────────────┘      └─────────────────┘
    │
    └─ Failure ──────────────────────┐
                                     ▼
                        ┌─────────────────────────┐
                        │  Show Error Message     │
                        │  Stay on Login Page     │
                        └─────────────────────────┘
```

---

## 📊 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                   │
└─────────────────────────────────────────────────────────────────┘

1. PRODUCT CREATION (Admin)
   Admin → Form → Pricing Calculator → Database → Public Page

2. ORDER PLACEMENT (User)
   User → Product Page → Checkout → Database → Stock Update → Success

3. ORDER MANAGEMENT (Admin)
   Admin → Orders List → Update Status → Database → User Sees Update

4. STOCK MANAGEMENT (Automatic)
   Order Placed → Get Current Stock → Calculate New Stock → Update DB

5. AUTHENTICATION (System)
   Signup/Login → Supabase Auth → Profile Creation → Role Check → Access

6. AUTHORIZATION (System)
   Request → Check Auth → Check Role → Allow/Deny → Response
```

---

## 🎯 Key Integration Points

```
┌─────────────────────────────────────────────────────────────────┐
│                   SYSTEM INTEGRATIONS                            │
└─────────────────────────────────────────────────────────────────┘

1. SUPABASE AUTH
   • User authentication
   • Session management
   • Password reset
   • Email verification

2. SUPABASE DATABASE
   • PostgreSQL database
   • Real-time subscriptions
   • Row Level Security
   • Automatic timestamps

3. NEXT.JS APP ROUTER
   • Server components
   • Client components
   • Dynamic routes
   • API routes

4. TYPESCRIPT
   • Type safety
   • Interface definitions
   • Compile-time checks
   • Better IDE support

5. REACT HOOKS
   • useState for state
   • useEffect for side effects
   • useRouter for navigation
   • useParams for route params
```

---

## 🚀 Deployment Flow

```
LOCAL DEVELOPMENT
    │
    ▼
┌─────────────────────────────────────────┐
│  npm run dev                            │
│  http://localhost:3000                  │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Test All Features                      │
│  • Admin dashboard                      │
│  • Product management                   │
│  • Order management                     │
│  • Public pages                         │
│  • Checkout                             │
│  • User orders                          │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Push to GitHub                         │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Deploy to Vercel                       │
│  • Import from GitHub                   │
│  • Add environment variables            │
│  • Deploy                               │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Production URL                         │
│  https://your-app.vercel.app            │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Monitor & Maintain                     │
│  • Check logs                           │
│  • Monitor performance                  │
│  • Update as needed                     │
└─────────────────────────────────────────┘
```

---

## 📈 Success Flow

```
LAUNCH
    │
    ▼
┌─────────────────────────────────────────┐
│  Add Products                           │
│  (Admin adds inventory)                 │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Customers Browse                       │
│  (Users discover products)              │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Orders Come In                         │
│  (Users place orders)                   │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Process Orders                         │
│  (Admin manages fulfillment)            │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Track Revenue                          │
│  (Monitor dashboard stats)              │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Scale & Grow                           │
│  (Add features, expand catalog)         │
└─────────────────────────────────────────┘
```

---

## 🎉 Complete System Ready!

All flows are implemented and working. Your e-commerce platform is production-ready!

**Next:** Follow [QUICK_START.md](./QUICK_START.md) to get started!

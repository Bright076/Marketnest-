# 🛍️ MarketNest - Complete E-Commerce Platform

A modern, full-featured e-commerce platform with admin dashboard, product management, order tracking, and user authentication.

## ✨ Features

### 🎯 Admin Dashboard
- **Product Management:** Add, edit, delete products with automatic pricing calculator
- **Order Management:** View, filter, and update orders with status tracking
- **Analytics:** Real-time stats (products count, orders count, revenue, pending orders)
- **Role-Based Access:** Admin-only routes with automatic protection

### 🛒 Customer Features
- **Product Browsing:** Search and filter products by type (local/global)
- **Product Details:** Full product information with quantity selector
- **Checkout System:** Secure checkout with delivery information
- **Order History:** Track orders with status updates
- **Order Details:** View complete order information and timeline

### 💰 Pricing Calculator
- **Markup Percentage:** Supplier Price + Markup % = Selling Price
- **Fixed Profit:** Supplier Price + Fixed Profit = Selling Price
- **Auto-Calculate:** Real-time price calculation
- **Manual Override:** Adjust prices as needed

### 📦 Stock Management
- Automatic stock reduction on order placement
- Out-of-stock products hidden from public view
- Stock count displayed on product cards
- Low stock warnings (coming soon)

### 🔒 Security
- Role-based access control (admin/user)
- Row Level Security (RLS) policies
- Protected routes
- Secure authentication with Supabase

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
1. Open Supabase Dashboard: https://yuhevckzxzzkazxickir.supabase.co
2. Go to SQL Editor
3. Run `ADMIN_SYSTEM_SETUP.sql`
4. Make yourself admin:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Access Admin Dashboard
1. Login at `/login`
2. Go to `/admin`
3. Start adding products!

**📖 For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)**

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[SYSTEM_COMPLETE.md](./SYSTEM_COMPLETE.md)** - Complete feature documentation
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[ADMIN_SYSTEM_PLAN.md](./ADMIN_SYSTEM_PLAN.md)** - System architecture and plan
- **[ADMIN_SYSTEM_SETUP.sql](./ADMIN_SYSTEM_SETUP.sql)** - Database setup script

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Inline styles (modern premium UI)
- **Deployment:** Vercel-ready

---

## 📁 Project Structure

```
marketnest/
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── products/       # Product management
│   │   └── orders/         # Order management
│   ├── products/           # Public product pages
│   ├── checkout/           # Checkout system
│   ├── my-orders/          # User order history
│   └── orders/success/     # Order confirmation
├── lib/
│   ├── supabaseClient.ts   # Supabase client
│   ├── adminAuth.ts        # Admin authentication
│   └── createProfile.ts    # Profile helpers
└── ADMIN_SYSTEM_SETUP.sql  # Database setup
```

---

## 🎯 Key Routes

### Admin Routes (Protected)
- `/admin` - Dashboard with stats
- `/admin/products` - Product management
- `/admin/products/add` - Add new product
- `/admin/products/edit/[id]` - Edit product
- `/admin/orders` - Order management
- `/admin/orders/[id]` - Order details

### Public Routes
- `/` - Home page
- `/products` - Product listing
- `/products/[id]` - Product details
- `/checkout` - Checkout page
- `/my-orders` - User order history
- `/my-orders/[id]` - Order details
- `/orders/success` - Order confirmation

### Auth Routes
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - User dashboard

---

## 💡 Features in Detail

### Pricing Calculator
The admin can set product prices in two ways:
1. **Markup Percentage:** Enter supplier price and markup %, selling price auto-calculates
2. **Fixed Profit:** Enter supplier price and fixed profit amount, selling price auto-calculates

Example:
- Supplier Price: $100
- Markup: 25%
- **Selling Price: $125** (auto-calculated)

### Order Workflow
1. **Pending** → Order placed, awaiting processing
2. **Processing** → Order being prepared
3. **Shipped** → Order dispatched for delivery
4. **Delivered** → Order completed successfully
5. **Cancelled** → Order cancelled

### Payment Status
- **Pending** → Payment on delivery (default)
- **Paid** → Payment received
- **Failed** → Payment failed

---

## 🔧 Configuration

### Environment Variables
Already configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yuhevckzxzzkazxickir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Tables
- **profiles** - User profiles with role (admin/user)
- **products** - Product catalog with pricing
- **orders** - Order tracking with status

---

## 🎨 Design Features

- ✅ Modern premium e-commerce UI
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Loading states
- ✅ Error handling
- ✅ Color-coded status badges
- ✅ Professional color scheme

---

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The app is production-ready and optimized for Vercel deployment.

---

## 🐛 Troubleshooting

### Can't access admin dashboard?
Make sure you ran the UPDATE query to set your role to 'admin'

### Products not showing?
Add products via `/admin/products/add`

### Orders not showing?
Place a test order as a user first

**For more troubleshooting, see [SYSTEM_COMPLETE.md](./SYSTEM_COMPLETE.md)**

---

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] CJdropshipping API integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Bulk product import
- [ ] Analytics dashboard
- [ ] Multi-currency support

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the troubleshooting section
3. Check Supabase logs
4. Review the code comments

---

## 📄 License

This project is ready for commercial use.

---

## 🎉 Credits

Built with Next.js, TypeScript, and Supabase.

**Ready to launch your e-commerce business!** 🚀

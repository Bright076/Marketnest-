# 🚀 MarketNest - Quick Start Guide

## Get Started in 5 Minutes!

---

## Step 1: Database Setup (2 minutes)

1. Open Supabase Dashboard: https://yuhevckzxzzkazxickir.supabase.co
2. Go to **SQL Editor**
3. Copy and paste the entire content of `ADMIN_SYSTEM_SETUP.sql`
4. Click **Run**
5. Wait for "Setup complete!" message

---

## Step 2: Make Yourself Admin (30 seconds)

In the same SQL Editor, run:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL_HERE@example.com';
```

Replace `YOUR_EMAIL_HERE@example.com` with your actual email.

---

## Step 3: Start the App (30 seconds)

```bash
cd marketnest
npm run dev
```

Open: http://localhost:3000

---

## Step 4: Login (30 seconds)

1. Go to http://localhost:3000/login
2. Login with your email and password
3. You should see your profile icon in the navbar

---

## Step 5: Access Admin Dashboard (30 seconds)

1. Go to http://localhost:3000/admin
2. You should see the admin dashboard with stats
3. If redirected to home, check Step 2 again

---

## Step 6: Add Your First Product (1 minute)

1. Click **"Products"** in the sidebar
2. Click **"Add Product"** button
3. Fill in the form:
   - **Title:** iPhone 15 Pro Max
   - **Description:** Latest iPhone with A17 Pro chip
   - **Image URL:** https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
   - **Supplier Price:** 800
   - **Markup %:** 25 (selling price auto-calculates to $1000)
   - **Category:** Phones
   - **Stock:** 10
   - **Product Type:** local
4. Click **"Add Product"**

---

## Step 7: Test as a User (1 minute)

1. Open a new incognito/private window
2. Go to http://localhost:3000
3. Browse products at http://localhost:3000/products
4. Click on a product
5. Click **"Buy Now"**
6. Login if prompted
7. Fill delivery form
8. Click **"Place Order"**
9. See order success page
10. Go to http://localhost:3000/my-orders to see your order

---

## Step 8: Manage Orders as Admin (30 seconds)

1. Back in your admin window
2. Go to http://localhost:3000/admin/orders
3. You should see the order you just placed
4. Update order status to "processing"
5. Update payment status to "paid"
6. Click on the order to see full details

---

## 🎉 Done!

You now have a fully functional e-commerce system with:

✅ Admin dashboard
✅ Product management with pricing calculator
✅ Order management
✅ Public product pages
✅ Checkout system
✅ User order history
✅ Stock management

---

## 📋 Quick Reference

### Admin Routes
- Dashboard: `/admin`
- Products: `/admin/products`
- Add Product: `/admin/products/add`
- Edit Product: `/admin/products/edit/[id]`
- Orders: `/admin/orders`
- Order Details: `/admin/orders/[id]`

### Public Routes
- Home: `/`
- Products: `/products`
- Product Details: `/products/[id]`
- Checkout: `/checkout`
- My Orders: `/my-orders`
- Order Details: `/my-orders/[id]`
- Order Success: `/orders/success`

### Auth Routes
- Login: `/login`
- Signup: `/signup`
- Dashboard: `/dashboard`

---

## 🎯 What to Do Next

### Add More Products
1. Go to `/admin/products/add`
2. Add products in different categories
3. Mix local and global products
4. Use different images from Unsplash

### Test the Complete Flow
1. Browse products as a user
2. Place multiple orders
3. Manage orders as admin
4. Update order statuses
5. Check stock reduction

### Customize
1. Update colors in the code
2. Add your logo
3. Change product categories
4. Modify order statuses
5. Add more features

---

## 💡 Pro Tips

### Pricing Calculator
- Enter supplier price + markup % for percentage-based pricing
- Enter supplier price + fixed profit for fixed profit pricing
- Selling price auto-calculates in real-time
- You can manually override if needed

### Stock Management
- Stock automatically reduces when order is placed
- Out of stock products are hidden from public listing
- Admin can update stock in edit product page

### Order Workflow
1. **Pending** → Just placed
2. **Processing** → Being prepared
3. **Shipped** → On the way
4. **Delivered** → Completed
5. **Cancelled** → Cancelled

### Payment Status
- **Pending** → Payment on delivery
- **Paid** → Payment received
- **Failed** → Payment failed

---

## 🐛 Common Issues

### "Can't access admin dashboard"
→ Make sure you ran the UPDATE query in Step 2 with your correct email

### "Products not showing"
→ Add products via `/admin/products/add`

### "Orders not showing"
→ Place a test order as a user first

### "Stock not reducing"
→ Check that the product has stock > 0 before ordering

---

## 📚 More Documentation

- **Complete Guide:** `SYSTEM_COMPLETE.md`
- **Setup Guide:** `SETUP_GUIDE.md`
- **Admin Plan:** `ADMIN_SYSTEM_PLAN.md`
- **Database Setup:** `ADMIN_SYSTEM_SETUP.sql`

---

## 🚀 Ready to Launch!

Your e-commerce system is production-ready. You can now:

1. Deploy to Vercel/Netlify
2. Add payment gateway (Stripe, PayPal)
3. Integrate CJdropshipping API
4. Add email notifications
5. Customize design
6. Add more features

**Happy selling!** 🎉

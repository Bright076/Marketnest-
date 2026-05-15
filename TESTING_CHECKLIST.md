# ✅ MarketNest Testing Checklist

Use this checklist to verify all features are working correctly.

---

## 🗄️ Database Setup

- [ ] Ran `ADMIN_SYSTEM_SETUP.sql` in Supabase SQL Editor
- [ ] Saw "Setup complete!" message
- [ ] Verified tables exist:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'products', 'orders');
  ```
- [ ] Made yourself admin:
  ```sql
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = 'your-email@example.com';
  ```
- [ ] Verified admin role:
  ```sql
  SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
  ```

---

## 🔐 Authentication

- [ ] Can access login page at `/login`
- [ ] Can login with email and password
- [ ] Profile icon appears in navbar after login
- [ ] Can access dashboard at `/dashboard`
- [ ] Can logout successfully
- [ ] Can signup new account at `/signup`
- [ ] New user profile created automatically

---

## 👨‍💼 Admin Dashboard

### Access Control
- [ ] Admin can access `/admin`
- [ ] Non-admin redirected to home from `/admin`
- [ ] Sidebar navigation visible
- [ ] All sidebar links work

### Dashboard Stats
- [ ] Products count displays correctly
- [ ] Orders count displays correctly
- [ ] Pending orders count displays correctly
- [ ] Total revenue displays correctly
- [ ] Recent orders table shows data

---

## 📦 Product Management (Admin)

### Products List (`/admin/products`)
- [ ] Can access products list page
- [ ] Products display in grid layout
- [ ] Product images load correctly
- [ ] Product info displays (title, price, stock, category)
- [ ] Edit button works
- [ ] Delete button works
- [ ] Delete confirmation dialog appears
- [ ] Product deleted successfully

### Add Product (`/admin/products/add`)
- [ ] Can access add product page
- [ ] All form fields present
- [ ] Image preview works
- [ ] **Pricing Calculator - Markup %:**
  - [ ] Enter supplier price: $100
  - [ ] Enter markup %: 25
  - [ ] Selling price auto-calculates to $125
- [ ] **Pricing Calculator - Fixed Profit:**
  - [ ] Enter supplier price: $100
  - [ ] Enter profit amount: $30
  - [ ] Selling price auto-calculates to $130
- [ ] Can select category
- [ ] Can enter stock quantity
- [ ] Can select product type (local/cj)
- [ ] Form validation works
- [ ] Product created successfully
- [ ] Redirected to products list
- [ ] New product appears in list

### Edit Product (`/admin/products/edit/[id]`)
- [ ] Can access edit page from products list
- [ ] Form pre-filled with product data
- [ ] Can update all fields
- [ ] Pricing calculator works in edit mode
- [ ] Product updated successfully
- [ ] Changes reflected in products list

---

## 📋 Order Management (Admin)

### Orders List (`/admin/orders`)
- [ ] Can access orders list page
- [ ] Orders display in table
- [ ] All filter buttons work (all, pending, processing, shipped, delivered, cancelled)
- [ ] Order status dropdown works
- [ ] Payment status dropdown works
- [ ] Status updates save correctly
- [ ] Product images display in table
- [ ] Customer info displays correctly
- [ ] View button works

### Order Details (`/admin/orders/[id]`)
- [ ] Can access order details page
- [ ] All order information displays
- [ ] Customer details visible
- [ ] Product information visible
- [ ] Status badges display correctly
- [ ] Can update order status
- [ ] Can update payment status
- [ ] Back button works

---

## 🛍️ Public Product Pages

### Products Listing (`/products`)
- [ ] Can access products page
- [ ] Products display in grid
- [ ] Product images load
- [ ] Product info displays (title, price, stock, category)
- [ ] **Filter - All Products:** Shows all products
- [ ] **Filter - Local Deals:** Shows only local products
- [ ] **Filter - Global Deals:** Shows only global products
- [ ] **Search:** Can search by product name
- [ ] **Search:** Can search by description
- [ ] Out of stock products hidden
- [ ] Product cards clickable
- [ ] Hover effects work

### Product Details (`/products/[id]`)
- [ ] Can access product details page
- [ ] Product image displays
- [ ] Product info displays (title, description, price, category)
- [ ] Stock status displays
- [ ] Product type badge displays (local/global)
- [ ] **Quantity Selector:**
  - [ ] Can increase quantity
  - [ ] Can decrease quantity
  - [ ] Can't go below 1
  - [ ] Can't exceed stock
  - [ ] Total price updates correctly
- [ ] **Buy Now Button:**
  - [ ] Redirects to login if not logged in
  - [ ] Redirects to checkout if logged in
- [ ] Back button works

---

## 🛒 Checkout System

### Checkout Page (`/checkout`)
- [ ] Can access checkout page with product ID
- [ ] Redirects to login if not logged in
- [ ] Form pre-filled with user profile data
- [ ] Product info displays correctly
- [ ] Product image displays
- [ ] Quantity from URL parameter works
- [ ] Total amount calculates correctly
- [ ] **Form Fields:**
  - [ ] Customer name field works
  - [ ] Phone field works
  - [ ] Address field works
  - [ ] All fields required
- [ ] **Place Order:**
  - [ ] Order created in database
  - [ ] Stock quantity reduced
  - [ ] Redirected to success page

### Order Success (`/orders/success`)
- [ ] Can access success page with order ID
- [ ] Success animation displays
- [ ] Order details display correctly
- [ ] Product info displays
- [ ] Delivery info displays
- [ ] Order status displays
- [ ] Payment status displays
- [ ] "View My Orders" button works
- [ ] "Continue Shopping" button works

---

## 📦 User Order History

### My Orders (`/my-orders`)
- [ ] Can access my orders page
- [ ] Redirects to login if not logged in
- [ ] User's orders display
- [ ] Order cards show product images
- [ ] Order info displays (ID, date, amount)
- [ ] Status badges display correctly
- [ ] **Filters work:**
  - [ ] All orders
  - [ ] Pending orders
  - [ ] Processing orders
  - [ ] Shipped orders
  - [ ] Delivered orders
  - [ ] Cancelled orders
- [ ] "View Details" button works
- [ ] Empty state shows if no orders

### Order Details (`/my-orders/[id]`)
- [ ] Can access order details page
- [ ] Redirects to login if not logged in
- [ ] Only shows user's own orders
- [ ] Product info displays with image
- [ ] Delivery info displays
- [ ] Payment info displays
- [ ] Order status timeline displays
- [ ] Progress tracker shows current status
- [ ] Order dates display (created, updated)
- [ ] Back button works

---

## 🔄 Stock Management

- [ ] Stock displays on product cards
- [ ] Stock displays on product details
- [ ] Out of stock products hidden from public listing
- [ ] Stock reduces when order placed
- [ ] Stock reduction amount matches order quantity
- [ ] Can't order more than available stock
- [ ] Admin can update stock in edit product

---

## 🎨 UI/UX Testing

### Responsive Design
- [ ] **Mobile (< 768px):**
  - [ ] Navbar responsive
  - [ ] Product grid responsive
  - [ ] Forms responsive
  - [ ] Tables responsive (horizontal scroll)
  - [ ] Admin sidebar responsive
- [ ] **Tablet (768px - 1024px):**
  - [ ] Layout adjusts correctly
  - [ ] Grid columns adjust
  - [ ] Navigation works
- [ ] **Desktop (> 1024px):**
  - [ ] Full layout displays
  - [ ] All features accessible

### Animations & Interactions
- [ ] Loading spinners display
- [ ] Hover effects work on buttons
- [ ] Hover effects work on cards
- [ ] Transitions smooth
- [ ] Success animation on order success page
- [ ] Status badges color-coded correctly

### Error Handling
- [ ] Form validation errors display
- [ ] Network errors handled gracefully
- [ ] 404 pages work
- [ ] Error messages user-friendly
- [ ] Loading states prevent double-clicks

---

## 🔒 Security Testing

### Access Control
- [ ] Non-admin can't access `/admin/*` routes
- [ ] Users can only see own orders
- [ ] Admin can see all orders
- [ ] Login required for checkout
- [ ] Login required for my orders

### RLS Policies
- [ ] Anyone can view products
- [ ] Only admin can create products
- [ ] Only admin can update products
- [ ] Only admin can delete products
- [ ] Users can view own orders
- [ ] Admin can view all orders
- [ ] Authenticated users can create orders
- [ ] Only admin can update orders

---

## 🧪 End-to-End Flow

### Complete User Journey
1. [ ] User visits home page
2. [ ] User browses products at `/products`
3. [ ] User searches for product
4. [ ] User filters by local/global
5. [ ] User clicks on product
6. [ ] User views product details
7. [ ] User adjusts quantity
8. [ ] User clicks "Buy Now"
9. [ ] User redirected to login (if not logged in)
10. [ ] User logs in
11. [ ] User redirected to checkout
12. [ ] User fills delivery form
13. [ ] User places order
14. [ ] Stock reduces automatically
15. [ ] User sees success page
16. [ ] User clicks "View My Orders"
17. [ ] User sees order in list
18. [ ] User clicks "View Details"
19. [ ] User sees complete order info

### Complete Admin Journey
1. [ ] Admin logs in
2. [ ] Admin goes to `/admin`
3. [ ] Admin sees dashboard stats
4. [ ] Admin clicks "Products"
5. [ ] Admin clicks "Add Product"
6. [ ] Admin fills product form
7. [ ] Admin uses pricing calculator
8. [ ] Admin adds product
9. [ ] Product appears in list
10. [ ] Admin clicks "Orders"
11. [ ] Admin sees user's order
12. [ ] Admin updates order status to "processing"
13. [ ] Admin updates payment status to "paid"
14. [ ] Admin clicks order to view details
15. [ ] Admin sees complete order info
16. [ ] Admin goes back to products
17. [ ] Admin edits product
18. [ ] Admin updates stock
19. [ ] Changes saved successfully

---

## 📊 Data Verification

### Database Checks
- [ ] Products table has data:
  ```sql
  SELECT COUNT(*) FROM products;
  ```
- [ ] Orders table has data:
  ```sql
  SELECT COUNT(*) FROM orders;
  ```
- [ ] Profiles table has admin:
  ```sql
  SELECT * FROM profiles WHERE role = 'admin';
  ```
- [ ] Stock updated after order:
  ```sql
  SELECT id, title, stock FROM products WHERE id = 'product-id';
  ```
- [ ] Order created correctly:
  ```sql
  SELECT * FROM orders WHERE id = 'order-id';
  ```

---

## 🎯 Performance Testing

- [ ] Pages load quickly (< 2 seconds)
- [ ] Images load efficiently
- [ ] No console errors
- [ ] No console warnings
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No layout shifts

---

## 📱 Browser Testing

- [ ] **Chrome:** All features work
- [ ] **Firefox:** All features work
- [ ] **Safari:** All features work
- [ ] **Edge:** All features work
- [ ] **Mobile Safari:** All features work
- [ ] **Mobile Chrome:** All features work

---

## ✅ Final Checks

- [ ] All documentation files present
- [ ] README.md updated
- [ ] Environment variables set
- [ ] Database setup complete
- [ ] Admin account created
- [ ] Test products added
- [ ] Test orders placed
- [ ] All features tested
- [ ] No critical bugs
- [ ] Ready for production

---

## 🎉 Completion

Once all items are checked:

✅ **System is fully functional and ready to use!**

---

## 📝 Notes

Use this space to note any issues found during testing:

```
Issue 1: [Description]
Solution: [How it was fixed]

Issue 2: [Description]
Solution: [How it was fixed]
```

---

## 🚀 Next Steps After Testing

1. [ ] Deploy to production (Vercel)
2. [ ] Add real products
3. [ ] Configure payment gateway
4. [ ] Set up email notifications
5. [ ] Add analytics
6. [ ] Monitor performance
7. [ ] Gather user feedback
8. [ ] Iterate and improve

---

**Happy Testing!** 🧪

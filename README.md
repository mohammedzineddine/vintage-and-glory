Vintage & Glory — Simple Clothes Store Demo

Overview
- Frontend: `index.html` using Tailwind CDN and `app.js` for UI logic.
- Supabase: `supabase.js` holds your Supabase URL and anon key.
- Dynamic Products: Generate sample products directly from the admin panel — no static SQL seed needed.

Setup
1. Create a Supabase project at https://app.supabase.com.
2. Open `supabase.js` and replace `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your project's values.
3. Run the SQL in `seed.sql` from the Supabase SQL editor to create the `products` table schema.
4. Run the SQL in `orders.sql` to create `orders` and `order_items` tables.

Generating Products
- Sign in to the admin panel at `admin.html` with these demo credentials:
  - **Email:** admin@vintage.local
  - **Password:** admin123
- Click **"Generate Sample Products"** to dynamically create 6 sample items in your database.
- Or manually add products one by one via the admin form.

Admin Panel
- Navigate to `admin.html` to manage products (add, edit, delete).
- Uses simple password-based authentication (demo credentials above).
- Admin session is stored in localStorage for convenience.
- For production, integrate Supabase Auth or your own authentication system.

Notes & next steps
- This demo uses the Supabase client in the browser (public anon key). For production, add server-side protections and role-based access control.
- Checkout now persists orders and items to Supabase (guest or authenticated user). Next: integrate Stripe for payments and secure server-side endpoints.

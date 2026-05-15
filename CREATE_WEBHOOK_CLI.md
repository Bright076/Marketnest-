# Create Webhook Using Command Line (Alternative Method)

## What You Need:
- Supabase CLI installed
- Your Supabase project linked

## Step 1: Install Supabase CLI

Open your terminal and run:
```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window. Login to your Supabase account.

## Step 3: Link Your Project

```bash
supabase link --project-ref yuhevckzxzzkazxickir
```

It will ask for your database password. Enter it.

## Step 4: Run the SQL File

```bash
supabase db push
```

Or run the SQL directly:
```bash
supabase db execute -f supabase-setup.sql
```

## Done!

The webhook is now created in your Supabase database.

---

## Verify It Worked

```bash
supabase db diff
```

This shows what changed in your database.

---

## Note:

This is more technical. If you're not comfortable with command line, just use the Supabase Dashboard method (SQL Editor) instead.

# 🚀 Database Setup - Quick Start Guide

This guide will walk you through setting up the Supabase database for the Lotus app.

## Prerequisites

- Supabase project created (lotus - eonnbueqowenorscxugz)
- Environment variables configured in `.env.local`

## Step 1: Install Dependencies

```bash
npm install
```

This will install `tsx` which we need for the test script.

## Step 2: Create Database Tables

### Option A: Supabase Dashboard (Recommended - Takes 2 minutes)

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/eonnbueqowenorscxugz
   - Log in if needed

2. **Open SQL Editor:**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Migration:**
   - Open the file: `supabase/migrations/001_initial_schema.sql`
   - Copy ALL the contents (the entire file)
   - Paste into the Supabase SQL editor
   - Click **Run** (or press `Cmd + Enter`)

4. **Verify Success:**
   - You should see: "Success. No rows returned"
   - This is normal! It means the tables were created.

### Option B: Command Line (Advanced)

```bash
# Install Supabase CLI globally
npm install -g supabase

# Link to your project
npx supabase link --project-ref eonnbueqowenorscxugz

# Push the migration
npx supabase db push
```

## Step 3: Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. You should see 3 tables:
   - ✅ **contractors**
   - ✅ **customers**
   - ✅ **projects**

## Step 4: Test Database Connection

Run this command from your project root:

```bash
npm run db:test
```

You should see:
```
🔌 Testing Supabase Connection...

1️⃣  Testing contractors table...
   ✅ Success! Found 0 contractor(s)

2️⃣  Testing customers table...
   ✅ Success! Found 0 customer(s)

3️⃣  Testing projects table...
   ✅ Success! Found 0 project(s)

==================================================
✅ All tests passed! Database is ready.

💡 Next step: Create Jason's contractor account
   See: documentation/database-setup-instructions.md (Step 3)
==================================================
```

## Step 5: Create Jason's Account

This is a two-part process:

### Part A: Create Auth User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Fill in:
   ```
   Email: jason@thebesthardwoodfloor.com
   Password: [create a strong password - Jason will need this]
   Auto Confirm User: ✅ YES (check this!)
   ```
4. Click **Create User**
5. **IMPORTANT:** Copy the User ID (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Part B: Create Contractor Record

1. Go back to **SQL Editor**
2. Click **New Query**
3. Paste this SQL (replace `PASTE_USER_ID_HERE` with the ID from Part A):

```sql
INSERT INTO public.contractors (
  id,
  company_name,
  contact_name,
  email,
  phone,
  address,
  city,
  state,
  zip_code,
  subscription_plan,
  is_active
) VALUES (
  'PASTE_USER_ID_HERE'::uuid,  -- ⚠️ REPLACE THIS!
  'The Best Hardwood Flooring Co.',
  'Jason Dixon',
  'jason@thebesthardwoodfloor.com',
  '708-762-1003',
  '1234 Main St',
  'Downers Grove',
  'IL',
  '60515',
  'professional',
  true
);
```

4. Click **Run**
5. You should see: "Success. 1 rows affected"

## Step 6: Verify Jason's Account

Run the test script again:

```bash
npm run db:test
```

You should now see:
```
1️⃣  Testing contractors table...
   ✅ Success! Found 1 contractor(s)
      - The Best Hardwood Flooring Co. (Jason Dixon)
```

## ✅ Done! What We Created

### Tables:
- **contractors** - Jason's company info
- **customers** - Will store customer records
- **projects** - Will store estimates/projects

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Jason can only see his own data
- ✅ Other contractors can't access Jason's data

### Features:
- ✅ Automatic timestamp updates
- ✅ Foreign key relationships
- ✅ Indexed for fast queries
- ✅ Data validation

## What's Next?

Now that the database is set up:
1. ✅ Database schema created
2. ✅ Jason's account created
3. 🚧 Build login page (next step)
4. 🚧 Connect customer wizard to database
5. 🚧 Build dashboard
6. 🚧 Add PDF generation
7. 🚧 Add email sending

---

## Troubleshooting

### ❌ "relation 'contractors' does not exist"
- You haven't run the migration yet
- Go back to Step 2 and run the SQL

### ❌ "Missing environment variables"
- Check that `.env.local` exists
- Verify it has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ❌ Can't login to Supabase
- Make sure you're using the correct Supabase account
- Project URL: https://supabase.com/dashboard/project/eonnbueqowenorscxugz

### ❌ Test script errors
```bash
# Try running with explicit env vars
npx tsx scripts/test-db-connection.ts
```

---

**Need help?** Check the detailed instructions in `documentation/database-setup-instructions.md`

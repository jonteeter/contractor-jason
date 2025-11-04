# Database Setup Instructions

## Step 1: Run the Migration in Supabase

You have two options to create the database tables:

### Option A: Using Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard/project/eonnbueqowenorscxugz
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd+Enter)
7. Verify success - you should see "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if you don't have it
npm install -g supabase

# Link to your project (one-time setup)
npx supabase link --project-ref eonnbueqowenorscxugz

# Run the migration
npx supabase db push
```

## Step 2: Verify Tables Were Created

In the Supabase Dashboard:
1. Go to **Table Editor**
2. You should see three tables:
   - `contractors`
   - `customers`
   - `projects`

## Step 3: Create Jason's Account

We'll do this in two parts:

### Part A: Create Auth User (Manual - First Time Only)

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **Add User** → **Create new user**
3. Fill in:
   - **Email:** jason@thebestHardwoodfloor.com (or his preferred email)
   - **Password:** (create a strong password - Jason will need this to log in)
   - **Auto Confirm User:** YES (check this box)
4. Click **Create User**
5. **IMPORTANT:** Copy the User ID (UUID) that was generated - you'll need it for Part B

### Part B: Create Contractor Record

1. Go back to **SQL Editor**
2. Run this query (replace `YOUR_USER_ID_HERE` with the UUID from Part A):

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
  'YOUR_USER_ID_HERE'::uuid,  -- REPLACE THIS with Jason's auth user ID
  'The Best Hardwood Flooring Co.',
  'Jason Dixon',
  'jason@thebesthardwoodfloor.com',
  '708-762-1003',
  '1234 Main St',  -- Update with Jason's actual address
  'Downers Grove',
  'IL',
  '60515',
  'professional',
  true
);
```

## Step 4: Verify Everything Works

Run this test query in SQL Editor:

```sql
-- This should return Jason's contractor record
SELECT * FROM public.contractors;

-- This should return nothing (no customers yet)
SELECT * FROM public.customers;

-- This should return nothing (no projects yet)
SELECT * FROM public.projects;
```

## What We Created

### Tables:
1. **contractors** - Contractor companies (Jason's company)
2. **customers** - Customer records linked to contractors
3. **projects** - Estimate/project records with full floor specifications

### Security:
- Row Level Security (RLS) enabled
- Contractors can only see their own data
- Authentication required for all operations

### Features:
- Automatic timestamp updates
- Proper foreign key relationships
- Indexed for performance
- Data validation with CHECK constraints

## Next Steps

Once the database is set up:
1. We'll build login/signup pages
2. Connect the customer wizard to save data
3. Build the dashboard to view saved estimates
4. Add PDF generation and email sending

---

**Need Help?**
If you run into issues:
1. Check the Supabase Dashboard logs
2. Verify your project URL matches: `https://eonnbueqowenorscxugz.supabase.co`
3. Make sure .env.local has the correct credentials

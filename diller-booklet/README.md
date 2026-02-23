# Diller Booklet System (Supabase + Next.js)

## What this is
One website:
- Admin edits the fixed template text and creates a booklet per coordinator
- Coordinators fill only their variables and export a booklet PDF (Print -> Save as PDF)

## Deploy fast (recommended)
1) Create a Supabase project and run the SQL (from our chat)
2) Create an Admin user in Supabase Authentication
3) In `profiles` table set `role` to `admin` (lowercase)
4) Create a GitHub repo, upload all files from this zip
5) Import repo in Vercel
6) In Vercel Project Settings -> Environment Variables set:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
7) Deploy

## Local run (optional)
npm install
npm run dev
Open http://localhost:3000

## Routes
/login
/dashboard
/admin
/edit
/booklet

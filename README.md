# Next.js + Supabase Starter

A modern full-stack web application built with Next.js 15 and Supabase, ready for deployment on Vercel.

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Supabase** for authentication and database
- **Tailwind CSS** for styling
- **Server-side rendering** with Supabase SSR
- **Environment configuration** for secure deployment
- **Vercel deployment** ready
- **Authentication flow** with sign up/sign in
- **Protected routes** and middleware
- **Modern UI components**

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Vercel account (for deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to find your project URL and anon key
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secure-random-string
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see your app.

## 🗄️ Database Setup

This starter includes authentication out of the box. For additional database tables:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create your tables and enable Row Level Security (RLS)
4. Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
   ```

## 🚀 Deployment on Vercel

### 1. Environment Variables

In your Vercel dashboard, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`

### 2. Deploy

```bash
# Connect to Vercel
npx vercel

# Deploy
npx vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Update Supabase Settings

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Add your production URL to "Site URL"
3. Add your production URL to "Redirect URLs"

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── login/             # Authentication page
│   └── page.tsx           # Home page
├── components/
│   ├── LogoutButton.tsx   # Client component for logout
│   └── UserProfile.tsx    # User information display
└── lib/
    └── supabase/
        ├── client.ts      # Browser client
        ├── server.ts      # Server client
        └── middleware.ts  # Auth middleware
```

## 🔐 Authentication Flow

1. Users can sign up/sign in on `/login`
2. Middleware protects routes and redirects unauthenticated users
3. Dashboard at `/dashboard` shows user information
4. Logout functionality clears session and redirects

## 🔧 Development

- **Linting**: `npm run lint`
- **Build**: `npm run build`
- **Start**: `npm run start`

## 📚 Key Dependencies

- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `@supabase/auth-ui-react` - Pre-built auth components
- `next` - React framework
- `tailwindcss` - Utility-first CSS framework

## 🔒 Security Features

- Environment variables for sensitive data
- Row Level Security (RLS) ready
- Protected routes with middleware
- Secure cookie handling
- CSRF protection

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for better TypeScript support
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {
  // Add your database types here
  // You can generate these using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
}
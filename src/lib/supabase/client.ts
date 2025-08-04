import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Handle demo mode with placeholder URLs
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key-placeholder';
  
  // Check for demo/placeholder values
  if (supabaseUrl.includes('demo.supabase.co') || supabaseKey === 'demo-key-placeholder') {
    console.log('Demo mode: Supabase client disabled');
    // Return a mock client that won't cause errors
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode' } }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode' } }),
        signOut: () => Promise.resolve({ error: null })
      }
    } as any;
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NVIDIA Bug Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Track bugs across TransformerEngine, Thunder, and NVFuser repositories
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Dashboard (Demo Mode)
          </Link>
          
          <Link 
            href="/login"
            className="block w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Login (Requires Supabase Setup)
          </Link>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Dashboard works in demo mode without authentication.</p>
          <p>Set up Supabase credentials for full authentication.</p>
        </div>
      </div>
    </div>
  );
}
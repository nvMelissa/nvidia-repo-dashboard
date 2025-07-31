import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Next.js + Supabase
          </h1>
          <p className="text-lg text-gray-600">
            A modern full-stack starter template
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li>✅ Next.js 15 with App Router</li>
              <li>✅ Supabase Authentication</li>
              <li>✅ TypeScript Support</li>
              <li>✅ Tailwind CSS</li>
              <li>✅ Vercel Deployment Ready</li>
              <li>✅ Environment Configuration</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started - Sign In
            </Link>
            
            <Link
              href="/dashboard"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              View Dashboard
            </Link>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>
            Make sure to configure your Supabase environment variables in{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code>
          </p>
        </div>
      </div>
    </div>
  );
}

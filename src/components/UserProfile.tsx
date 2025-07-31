import { User } from '@supabase/supabase-js'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-3">
      <div>
        <dt className="text-sm font-medium text-gray-500">Email</dt>
        <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">User ID</dt>
        <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">Created At</dt>
        <dd className="mt-1 text-sm text-gray-900">
          {new Date(user.created_at).toLocaleDateString()}
        </dd>
      </div>
      <div>
        <dt className="text-sm font-medium text-gray-500">Last Sign In</dt>
        <dd className="mt-1 text-sm text-gray-900">
          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
        </dd>
      </div>
    </div>
  )
}
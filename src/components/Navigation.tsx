'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Home, Upload, User, LogOut, LogIn } from 'lucide-react'

export function Navigation() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-600">EduGram</h1>
            <div className="animate-pulse h-6 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
            EduGram
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/" 
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Home size={20} />
                  <span className="hidden sm:inline">Feed</span>
                </Link>
                
                <Link 
                  href="/upload" 
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Upload size={20} />
                  <span className="hidden sm:inline">Upload</span>
                </Link>
                
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600 hover:text-red-700"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
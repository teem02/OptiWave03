'use client'

import { useAuth } from '@/hooks/useAuth'
import { VideoFeed } from '@/components/VideoFeed'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to EduGram
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A social platform dedicated to programming, AI, and educational content. 
          Share knowledge, learn from others, and grow your skills.
        </p>
        <div className="space-x-4">
          <Link
            href="/auth/signup"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="inline-block border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 border rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Programming</h3>
            <p className="text-gray-600">Share coding tutorials, tips, and programming concepts</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI & Machine Learning</h3>
            <p className="text-gray-600">Explore artificial intelligence and machine learning topics</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <p className="text-gray-600">Educational content across various tech topics</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Discover the latest educational content from the community
        </p>
      </div>
      
      <VideoFeed />
    </div>
  )
}

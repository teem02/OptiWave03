'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { VideoCard } from './VideoCard'

export type Post = {
  id: string
  user_id: string
  video_url: string
  caption: string | null
  category: 'Programming' | 'AI' | 'Education'
  created_at: string
  users: {
    full_name: string | null
    avatar_url: string | null
  }
}

const categories = ['All', 'Programming', 'AI', 'Education'] as const

export function VideoFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [error, setError] = useState('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <div key={category} className="h-10 w-20 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPosts}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No posts found
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'All' 
              ? 'Be the first to share educational content!'
              : `No posts in the ${selectedCategory} category yet.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <VideoCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
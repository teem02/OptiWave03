'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { VideoCard } from '@/components/VideoCard'
import { User, Edit, Camera } from 'lucide-react'
import { Post } from '@/components/VideoFeed'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [userProfile, setUserProfile] = useState<{
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    created_at: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchUserData = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUserProfile(profile)
        setFullName(profile.full_name || '')
        setBio(profile.bio || '')
      }

      // Fetch user posts
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          *,
          users (
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setUserPosts(posts || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user, fetchUserData])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (!user) {
    return null
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName.trim(),
          bio: bio.trim() || null,
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      setUserProfile(prev => prev ? ({
        ...prev,
        full_name: fullName.trim(),
        bio: bio.trim() || null,
      }) : null)
      
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setFullName(userProfile?.full_name || '')
    setBio(userProfile?.bio || '')
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              {userProfile?.avatar_url ? (
                <Image
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name || 'User'}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-500" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          {editing ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  maxLength={50}
                />
              </div>
              <div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio (optional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  maxLength={200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {bio.length}/200 characters
                </p>
              </div>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {userProfile?.full_name || 'No name set'}
              </h1>
              <p className="text-gray-600">
                {userProfile?.email}
              </p>
              {userProfile?.bio && (
                <p className="text-gray-700 max-w-md mx-auto">
                  {userProfile.bio}
                </p>
              )}
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mt-4">
                <span>{userPosts.length} posts</span>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 mt-4"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Videos
        </h2>
        
        {userPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No videos yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start sharing your educational content!
            </p>
            <button
              onClick={() => router.push('/upload')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Upload Your First Video
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPosts.map((post) => (
              <VideoCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
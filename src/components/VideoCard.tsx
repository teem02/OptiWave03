'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Pause, User } from 'lucide-react'
import { Post } from './VideoFeed'

interface VideoCardProps {
  post: Post
}

export function VideoCard({ post }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const handleVideoClick = () => {
    const video = document.getElementById(`video-${post.id}`) as HTMLVideoElement
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Programming':
        return 'bg-blue-100 text-blue-800'
      case 'AI':
        return 'bg-green-100 text-green-800'
      case 'Education':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Video Container */}
      <div 
        className="relative aspect-video bg-gray-900 cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleVideoClick}
      >
        <video
          id={`video-${post.id}`}
          className="w-full h-full object-cover"
          src={post.video_url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted
          loop
          preload="metadata"
        />
        
        {/* Play/Pause Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-black bg-opacity-50 rounded-full p-3">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {post.users.avatar_url ? (
              <Image
                src={post.users.avatar_url}
                alt={post.users.full_name || 'User'}
                width={32}
                height={32}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {post.users.full_name || 'Anonymous User'}
            </p>
            <p className="text-xs text-gray-500">
              {formatTimeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-gray-700 line-clamp-3">
            {post.caption}
          </p>
        )}
      </div>
    </div>
  )
}
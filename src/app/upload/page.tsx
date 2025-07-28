'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Upload, X } from 'lucide-react'

export default function UploadPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState<'Programming' | 'AI' | 'Education'>('Programming')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['video/mp4', 'video/mov', 'video/webm']
    const maxSize = 100 * 1024 * 1024 // 100MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid video file (MP4, MOV, or WebM)'
    }

    if (file.size > maxSize) {
      return 'File size must be less than 100MB'
    }

    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }

    setFile(selectedFile)
    setError('')

    // Create preview URL
    const videoURL = URL.createObjectURL(selectedFile)
    setPreview(videoURL)

    // Validate video duration
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      if (video.duration > 300) { // 5 minutes
        setError('Video must be 5 minutes or less')
        setFile(null)
        setPreview('')
        URL.revokeObjectURL(videoURL)
      }
    }
    video.src = videoURL
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !user) return

    setUploading(true)
    setError('')

    try {
      // Upload video to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `videos/${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath)

      // Save post to database
      const { error: dbError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            video_url: publicUrl,
            caption: caption.trim() || null,
            category,
          }
        ])

      if (dbError) {
        throw dbError
      }

      // Redirect to home page
      router.push('/')
    } catch (err: unknown) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload video'
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Upload Video
        </h1>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File
            </label>
            
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-400">
                  MP4, MOV, or WebM up to 100MB (max 5 minutes)
                </p>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={preview}
                  controls
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mov,video/webm"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'Programming' | 'AI' | 'Education')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Programming">Programming</option>
              <option value="AI">AI & Machine Learning</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption (Optional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your video..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {caption.length}/500 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  )
}
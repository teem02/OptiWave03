'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import toast from 'react-hot-toast'
import { 
  Upload, 
  FileAudio, 
  FileVideo, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Clock,
  Download
} from 'lucide-react'
import { Meeting } from '@/lib/database.types'

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const supabase = createClient()

  const fetchMeetings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to fetch meetings')
        console.error(error)
      } else {
        setMeetings(data || [])
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  const handleFileSelect = (file: File) => {
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '50000000')
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'video/mp4', 'audio/wav', 'audio/m4a']
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB')
      return
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload an audio (.mp3, .wav, .m4a) or video (.mp4) file')
      return
    }

    setSelectedFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const uploadAndProcessFile = async () => {
    if (!selectedFile) return

    setUploading(true)
    
    try {
      // Create meeting record
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('User not authenticated')
        return
      }

      const meetingTitle = `Meeting - ${new Date().toLocaleDateString()}`
      
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          title: meetingTitle,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          processing_status: 'pending'
        })
        .select()
        .single()

      if (meetingError) {
        toast.error('Failed to create meeting record')
        console.error(meetingError)
        return
      }

      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${meeting.id}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('meeting-files')
        .upload(fileName, selectedFile)

      if (uploadError) {
        toast.error('Failed to upload file')
        console.error(uploadError)
        return
      }

      // Update meeting with upload URL
      const { data: { publicUrl } } = supabase.storage
        .from('meeting-files')
        .getPublicUrl(fileName)

      await supabase
        .from('meetings')
        .update({ 
          upload_url: publicUrl,
          processing_status: 'processing'
        })
        .eq('id', meeting.id)

      // Process the file
      await processFile(meeting.id, selectedFile)
      
      setSelectedFile(null)
      fetchMeetings()
      toast.success('File uploaded and processing started!')
      
    } catch (error) {
      toast.error('Failed to upload file')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const processFile = async (meetingId: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('meetingId', meetingId)

      const response = await fetch('/api/process-meeting', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

    } catch (error) {
      console.error('Processing error:', error)
      // Update status to failed
      await supabase
        .from('meetings')
        .update({ processing_status: 'failed' })
        .eq('id', meetingId)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Meeting Recording</h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      {selectedFile.type.startsWith('audio') ? (
                        <FileAudio className="w-12 h-12 text-blue-500" />
                      ) : (
                        <FileVideo className="w-12 h-12 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={uploadAndProcessFile}
                        disabled={uploading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {uploading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {uploading ? 'Processing...' : 'Upload & Process'}
                      </button>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your meeting recording here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to browse (.mp3, .mp4, .wav, .m4a files up to 50MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".mp3,.mp4,.wav,.m4a,audio/*,video/mp4"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Meetings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Meetings</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No meetings uploaded yet</p>
                  <p className="text-sm">Upload your first meeting recording to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => meeting.processing_status === 'completed' && window.open(`/meeting/${meeting.id}`, '_blank')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                          <p className="text-sm text-gray-500">{meeting.file_name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(meeting.created_at).toLocaleDateString()} at{' '}
                            {new Date(meeting.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(meeting.processing_status)}
                            <span className="text-sm font-medium">
                              {getStatusText(meeting.processing_status)}
                            </span>
                          </div>
                          {meeting.processing_status === 'completed' && (
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              title="View Results"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
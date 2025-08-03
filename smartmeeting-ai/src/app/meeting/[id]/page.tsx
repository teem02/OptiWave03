import { createServerClientComponent } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Brain, 
  CheckSquare, 
  Mail, 
  Copy,
  Calendar,
  Clock,
  Download
} from 'lucide-react'
import { Meeting } from '@/lib/database.types'

interface MeetingPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const resolvedParams = await params
  const supabase = await createServerClientComponent()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch meeting data
  const { data: meeting, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', user.id)
    .single()

  if (error || !meeting) {
    notFound()
  }

  if (meeting.processing_status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Meeting</h2>
          <p className="text-gray-600">Please wait while we analyze your meeting...</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You would typically show a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{meeting.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(meeting.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(meeting.created_at).toLocaleTimeString()}
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {meeting.file_name}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Meeting Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="w-6 h-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Meeting Summary</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(meeting.summary || '', 'summary')}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {meeting.summary}
              </p>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckSquare className="w-6 h-6 text-purple-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Action Items</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(
                    meeting.action_items?.join('\n• ') || '', 
                    'action items'
                  )}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
            </div>
            <div className="p-6">
              {meeting.action_items && meeting.action_items.length > 0 ? (
                <ul className="space-y-2">
                  {meeting.action_items.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No action items identified.</p>
              )}
            </div>
          </div>

          {/* Follow-up Email */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-orange-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Follow-up Email</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(meeting.follow_up_email || '', 'follow-up email')}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                  {meeting.follow_up_email}
                </pre>
              </div>
            </div>
          </div>

          {/* Full Transcript */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Full Transcript</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(meeting.transcript || '', 'transcript')}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="max-h-96 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {meeting.transcript}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
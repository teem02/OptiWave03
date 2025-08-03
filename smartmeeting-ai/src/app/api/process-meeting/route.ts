import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { transcribeAudio, generateMeetingSummary } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const meetingId = formData.get('meetingId') as string

    if (!file || !meetingId) {
      return NextResponse.json(
        { error: 'File and meeting ID are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Update status to processing
    await supabase
      .from('meetings')
      .update({ processing_status: 'processing' })
      .eq('id', meetingId)

    try {
      // Step 1: Transcribe the audio
      console.log('Starting transcription...')
      const transcript = await transcribeAudio(file)
      
      if (!transcript) {
        throw new Error('Failed to generate transcript')
      }

      // Update with transcript
      await supabase
        .from('meetings')
        .update({ transcript })
        .eq('id', meetingId)

      // Step 2: Generate meeting analysis
      console.log('Generating meeting analysis...')
      const analysis = await generateMeetingSummary(transcript)
      
      if (!analysis) {
        throw new Error('Failed to generate meeting analysis')
      }

      // Step 3: Update meeting with all results
      await supabase
        .from('meetings')
        .update({
          summary: analysis.summary,
          action_items: analysis.actionItems,
          follow_up_email: analysis.followUpEmail,
          processing_status: 'completed'
        })
        .eq('id', meetingId)

      return NextResponse.json({
        success: true,
        meetingId,
        transcript,
        analysis
      })

    } catch (processingError) {
      console.error('Processing error:', processingError)
      
      // Update status to failed
      await supabase
        .from('meetings')
        .update({ processing_status: 'failed' })
        .eq('id', meetingId)

      return NextResponse.json(
        { error: 'Failed to process meeting' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
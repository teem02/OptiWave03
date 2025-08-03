import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function transcribeAudio(audioFile: File): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    })
    
    return transcription
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export async function generateMeetingSummary(transcript: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that analyzes meeting transcripts. Your task is to:
1. Create a concise meeting summary
2. Extract exactly 3 action items as bullet points
3. Generate a professional follow-up email

Please format your response as a JSON object with the following structure:
{
  "summary": "Brief meeting summary here",
  "actionItems": ["Action item 1", "Action item 2", "Action item 3"],
  "followUpEmail": "Professional follow-up email content here"
}`
        },
        {
          role: 'user',
          content: `Please analyze this meeting transcript and provide the summary, action items, and follow-up email:\n\n${transcript}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from GPT-4')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating meeting summary:', error)
    throw new Error('Failed to generate meeting summary')
  }
}

export type MeetingAnalysis = {
  summary: string
  actionItems: string[]
  followUpEmail: string
}
# SmartMeeting.ai

A full-stack AI-powered SaaS application that transforms meeting recordings into actionable insights using Next.js 14, Supabase, and OpenAI.

## 🚀 Features

- **User Authentication**: Secure email-based authentication with Supabase
- **File Upload**: Drag-and-drop or click-to-upload meeting recordings (.mp3, .mp4, .wav, .m4a)
- **AI Transcription**: Automatic audio-to-text conversion using OpenAI Whisper API
- **Meeting Analysis**: Generate summaries, action items, and follow-up emails with GPT-4
- **Protected Dashboard**: Secure user dashboard with meeting history
- **Real-time Status**: Live processing status updates with loading states
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Copy to Clipboard**: Easy copying of transcripts, summaries, and emails
- **Settings Management**: User profile and notification preferences
- **Toast Notifications**: User-friendly success and error messages

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI Services**: OpenAI Whisper API, GPT-4
- **Deployment**: Vercel
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key with access to Whisper and GPT-4

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartmeeting-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Next.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # File Upload Configuration
   MAX_FILE_SIZE=50000000
   ```

## 🗄️ Database Setup

1. **Create Supabase project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Get your project URL and API keys

2. **Run database migrations**
   - Copy the SQL from `database.sql`
   - Run it in your Supabase SQL editor
   - This will create the meetings table, RLS policies, and storage bucket

3. **Configure Storage**
   - The SQL script will create a storage bucket called `meeting-files`
   - Ensure storage is properly configured in your Supabase project

## 🏃‍♂️ Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Import the project

2. **Configure Environment Variables**
   In your Vercel dashboard, add all environment variables from `.env.local`

3. **Deploy**
   - Vercel will automatically deploy your application
   - The `vercel.json` configuration is already set up for optimal performance

### Environment Variables for Production

Set these in your Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `MAX_FILE_SIZE` (optional, defaults to 50MB)

## 📁 Project Structure

```
smartmeeting-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── process-meeting/route.ts  # Meeting processing API
│   │   ├── dashboard/page.tsx            # Main dashboard
│   │   ├── login/page.tsx                # Login page
│   │   ├── signup/page.tsx               # Signup page
│   │   ├── settings/page.tsx             # Settings page
│   │   ├── meeting/[id]/page.tsx         # Meeting results page
│   │   ├── layout.tsx                    # Root layout
│   │   └── page.tsx                      # Landing page
│   ├── components/
│   │   ├── DashboardLayout.tsx           # Dashboard layout component
│   │   └── SuccessModal.tsx              # Success notification modal
│   └── lib/
│       ├── supabase.ts                   # Supabase client configuration
│       ├── api.ts                        # OpenAI API functions
│       └── database.types.ts             # TypeScript types
├── database.sql                          # Database schema
├── vercel.json                          # Vercel deployment config
└── README.md                            # This file
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own meetings
- **Authentication Middleware**: Protects all routes except public pages
- **File Type Validation**: Only allows audio/video files
- **File Size Limits**: Configurable file size restrictions
- **Secure Storage**: Files stored in Supabase with proper access controls

## 🎯 Usage

1. **Sign Up**: Create an account with your email
2. **Upload**: Drag and drop or select a meeting recording
3. **Process**: The AI automatically transcribes and analyzes your meeting
4. **Review**: View the transcript, summary, action items, and follow-up email
5. **Copy**: Use the copy buttons to easily share results

## 🔧 API Endpoints

- `POST /api/process-meeting`: Process uploaded meeting files
  - Accepts: FormData with file and meetingId
  - Returns: Processing status and results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check that all environment variables are correctly set
2. Ensure your Supabase project is properly configured
3. Verify your OpenAI API key has access to required models
4. Check the browser console and server logs for error messages

## 🔮 Future Features

- Team collaboration
- Advanced AI insights
- Custom meeting templates
- API access for integrations
- Mobile app
- Slack/Teams integration
- Calendar integration
- Meeting scheduling

---

Built with ❤️ using Next.js, Supabase, and OpenAI

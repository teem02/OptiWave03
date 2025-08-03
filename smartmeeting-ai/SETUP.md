# Quick Setup Guide

## 🚀 Get SmartMeeting.ai Running in 10 Minutes

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd smartmeeting-ai
npm install
```

### Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and name your project
   - Wait for the project to be created

2. **Get Your Keys**
   - Go to Settings → API
   - Copy the "Project URL" and "anon/public" key
   - Copy the "service_role" key (keep this secret!)

3. **Set Up Database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the content from `database.sql`
   - Click "Run" to execute the SQL

### Step 3: Set Up OpenAI

1. **Get OpenAI API Key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an account or log in
   - Go to API Keys and create a new secret key
   - Make sure you have access to GPT-4 and Whisper models

### Step 4: Configure Environment Variables

1. **Copy Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local` with your actual values:**
   ```env
   # Replace with your Supabase values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Replace with your OpenAI key
   OPENAI_API_KEY=sk-your_openai_key_here

   # Generate a random 32+ character string
   NEXTAUTH_SECRET=your_random_32_character_secret_here
   NEXTAUTH_URL=http://localhost:3000

   # File size limit (50MB default)
   MAX_FILE_SIZE=50000000
   ```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start using SmartMeeting.ai!

## 🧪 Test the Application

1. **Sign Up**
   - Create a new account with your email
   - Check your email for verification (if enabled)

2. **Upload a Meeting**
   - Go to the dashboard
   - Upload a short audio/video file (test with a small file first)
   - Watch the processing status update

3. **View Results**
   - Once processing is complete, click on your meeting
   - Review the transcript, summary, action items, and follow-up email

## 🚨 Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Verify your Supabase URL format is correct
- Check that your OpenAI API key is valid

### Upload Issues
- Verify your Supabase storage bucket is created
- Check file size limits
- Ensure file types are supported (.mp3, .mp4, .wav, .m4a)

### Processing Failures
- Verify your OpenAI API key has access to Whisper and GPT-4
- Check API usage limits
- Look at browser console and server logs for errors

## 🚀 Deploy to Production

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Deploy!

3. **Update Environment Variables**
   - Set `NEXTAUTH_URL` to your production domain
   - Verify all other variables are correct

## 💡 Next Steps

- Customize the UI to match your brand
- Add more AI models or features
- Integrate with calendar applications
- Set up monitoring and analytics
- Add team collaboration features

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review error logs for specific issues
- Ensure all API keys have proper permissions
- Verify database tables and policies are created correctly
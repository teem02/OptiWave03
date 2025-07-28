# EduGram

EduGram is a modern social media web application built with Next.js, Tailwind CSS, and Supabase, designed specifically for educational content sharing. Users can upload and share short videos (max 5 minutes) focused on Programming, AI, and Education topics.

## 🚀 Features

- **User Authentication**: Sign up/sign in using Supabase Auth with email/password
- **Video Upload**: Upload short educational videos (max 5 minutes) with file validation
- **Content Categories**: Organize content into Programming, AI, and Education categories
- **Global Feed**: Browse all public videos with category filtering
- **User Profiles**: View and edit user profiles with bio and avatar support
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Real-time Updates**: Built with Supabase for real-time data synchronization

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for videos and images
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OptiWave03
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from the project settings
3. Run the SQL commands from `DATABASE_SETUP.md` in the Supabase SQL editor
4. Set up storage buckets as described in the database setup guide

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update the following variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile page
│   ├── upload/            # Video upload page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Navigation bar
│   ├── VideoCard.tsx      # Video display component
│   └── VideoFeed.tsx      # Video feed component
├── hooks/                 # Custom React hooks
│   └── useAuth.ts         # Authentication hook
└── lib/                   # Utility libraries
    └── supabase.ts        # Supabase client configuration
```

## 🎯 Core Features

### Authentication
- Email/password signup and login
- User profile creation and management
- Protected routes for authenticated users

### Video Management
- Upload videos with file type validation (MP4, MOV, WebM)
- Maximum 5-minute duration limit
- File size limit (100MB)
- Category selection (Programming, AI, Education)
- Caption support

### Social Features
- Global video feed
- Category-based filtering
- User profiles with bio and avatar
- Video grid layout

### Responsive Design
- Mobile-first approach
- Instagram-style card layout
- Optimized for all screen sizes

## 🔒 Database Schema

### Tables
- **users**: Extended user profiles
- **posts**: Video posts with metadata
- **likes**: Post likes (optional MVP)
- **comments**: Post comments (optional MVP)

### Storage
- **videos**: User-uploaded video files
- **avatars**: User profile images

See `DATABASE_SETUP.md` for detailed schema and setup instructions.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Deployment Options

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🎨 Customization

### Styling
- All styles use Tailwind CSS
- Colors can be customized in `tailwind.config.js`
- Component styles are in individual component files

### Categories
- Video categories can be modified in the database schema
- Update the category type in `src/lib/supabase.ts`
- Modify category options in upload and feed components

## 📝 Future Enhancements

- [ ] Like and comment functionality
- [ ] Video search and advanced filtering
- [ ] User following/followers system
- [ ] Push notifications
- [ ] Video analytics
- [ ] AI content moderation
- [ ] Dark mode support
- [ ] Progressive Web App (PWA) features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the `DATABASE_SETUP.md` file for database configuration
2. Verify your environment variables are correct
3. Ensure your Supabase project is properly configured
4. Check the browser console for any JavaScript errors

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database and auth powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

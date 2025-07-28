# EduGram Database Setup

This document contains the SQL commands needed to set up the Supabase database for EduGram.

## Required Tables

### 1. Users Table
This extends the default auth.users table with additional profile information.

```sql
-- Create users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
```

### 2. Posts Table
Stores video posts with metadata.

```sql
-- Create posts table
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    video_url TEXT NOT NULL,
    caption TEXT,
    category TEXT NOT NULL CHECK (category IN ('Programming', 'AI', 'Education')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);
```

### 3. Likes Table (Optional MVP)
For storing post likes.

```sql
-- Create likes table
CREATE TABLE public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON public.likes FOR ALL USING (auth.uid() = user_id);
```

### 4. Comments Table (Optional MVP)
For storing post comments.

```sql
-- Create comments table
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
```

## Storage Setup

### Create Storage Bucket for Videos

```sql
-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true);

-- Create policy for video uploads
CREATE POLICY "Users can upload videos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for viewing videos
CREATE POLICY "Anyone can view videos" ON storage.objects 
FOR SELECT USING (bucket_id = 'videos');

-- Create policy for users to delete their own videos
CREATE POLICY "Users can delete their own videos" ON storage.objects 
FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Create Storage Bucket for Avatars (Optional)

```sql
-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Create policy for avatar uploads
CREATE POLICY "Users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for viewing avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

-- Create policy for users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects 
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Environment Variables

Make sure to update your `.env.local` file with your Supabase project credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Authentication Setup

1. Go to Supabase Dashboard > Authentication > Settings
2. Enable email confirmations if desired
3. Configure any additional auth providers if needed
4. Set up email templates for auth flows

## Additional Notes

- All tables use Row Level Security (RLS) for secure access
- The storage buckets are configured to be public for easy video/image serving
- Video files are organized by user ID in the storage bucket
- Make sure to run all SQL commands in the Supabase SQL editor
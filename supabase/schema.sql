-- XPLAIN Database Schema
-- Run this in your Supabase SQL editor

-- Cards cache (ELI5 generated content)
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  hook TEXT NOT NULL,
  explanation TEXT NOT NULL,
  key_points TEXT[] NOT NULL,
  fun_fact TEXT NOT NULL,
  analogy TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions cache
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress per topic
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  mastery_score FLOAT DEFAULT 0,
  cards_read INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- User streaks + XP
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  xp INTEGER DEFAULT 0
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Enable Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Cards: readable + insertable by all authenticated users (shared cache)
CREATE POLICY "Cards readable by authenticated" ON cards
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Cards insertable by authenticated" ON cards
  FOR INSERT TO authenticated WITH CHECK (true);

-- Quiz questions: readable + insertable by all authenticated users
CREATE POLICY "Quiz questions readable by authenticated" ON quiz_questions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Quiz questions insertable by authenticated" ON quiz_questions
  FOR INSERT TO authenticated WITH CHECK (true);

-- User progress: users own their data
CREATE POLICY "Users manage own progress" ON user_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User streaks: users own their data
CREATE POLICY "Users manage own streaks" ON user_streaks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bookmarks: users own their data
CREATE POLICY "Users manage own bookmarks" ON bookmarks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

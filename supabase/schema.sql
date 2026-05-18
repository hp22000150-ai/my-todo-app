-- categories 테이블
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6b7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS categories_user_id_idx ON categories (user_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own categories"
  ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE USING (auth.uid() = user_id);

-- todos 테이블
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  due_time TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos (created_at DESC);
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos (user_id);
CREATE INDEX IF NOT EXISTS todos_sort_order_idx ON todos (sort_order);
CREATE INDEX IF NOT EXISTS todos_category_id_idx ON todos (category_id);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own todos"
  ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE USING (auth.uid() = user_id);

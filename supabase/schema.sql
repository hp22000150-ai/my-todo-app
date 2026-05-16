-- todos 테이블 생성
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 최신 항목이 먼저 오도록 인덱스 추가
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON todos (created_at DESC);

-- Row Level Security 활성화 (필요 시 인증 추가)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 모든 사용자 읽기/쓰기 허용 (인증 없이 테스트용)
CREATE POLICY "Allow all" ON todos FOR ALL USING (true) WITH CHECK (true);

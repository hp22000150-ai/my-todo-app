# My Todo App

Next.js App Router + TypeScript + Tailwind CSS + Supabase 할 일 관리 앱.

## 시작하기

### 1. Supabase 프로젝트 설정

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Project Settings → API에서 URL과 anon key 복사

### 2. 환경 변수 설정

`.env.local` 파일에 Supabase 정보를 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인하세요.

## Vercel 배포

1. GitHub에 푸시
2. [vercel.com](https://vercel.com)에서 레포 임포트
3. 환경 변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) 추가
4. Deploy

## 기술 스택

- **Next.js 15** — App Router, Server Actions
- **TypeScript**
- **Tailwind CSS**
- **Supabase** — PostgreSQL DB
- **Vercel** — 배포

# 설정 가이드

## 1. 패키지 설치

```bash
npm install
```

## 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Supabase Storage (이미지 업로드용)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="랜덤 문자열 (아래 방법 중 하나로 생성)"

# Admin Password (로그인 비밀번호)
ADMIN_PASSWORD="원하는 비밀번호"
```

## 3. NEXTAUTH_SECRET 생성 방법

다음 중 하나의 방법으로 랜덤 문자열을 생성하세요:

**방법 1: Node.js 사용 (모든 OS)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**방법 2: PowerShell 사용 (Windows)**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**방법 3: 온라인 생성기**
- https://generate-secret.vercel.app/32 사용

생성된 문자열을 `NEXTAUTH_SECRET`에 설정하세요.

## 4. 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정 → Database → Connection string으로 이동
3. **중요**: Prisma 마이그레이션을 위해서는 **Direct connection** (포트 5432)을 사용해야 합니다
   - "Connection string" 섹션에서 "URI" 탭 선택
   - 또는 "Direct connection" 옵션 선택
   - 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
4. 비밀번호에 특수 문자가 포함된 경우 URL 인코딩 필요 (예: `@` → `%40`, `#` → `%23`)
5. `DATABASE_URL`에 설정

**참고**: Transaction Pooler (포트 6543)는 애플리케이션에서 사용하지만, 마이그레이션에는 Direct Connection을 사용해야 합니다.

## 5. Supabase Storage 설정

1. Supabase 대시보드에서 Storage 메뉴로 이동
2. "Create a new bucket" 버튼 클릭
3. 버킷 이름: `images` (소문자)
4. Public bucket 옵션 활성화 (체크)
5. Create 버튼 클릭

**환경 변수 설정:**
- Supabase 대시보드 → Settings → API
- `Project URL`을 `NEXT_PUBLIC_SUPABASE_URL`에 설정
- `anon public` 키를 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 설정

## 6. Prisma 마이그레이션

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 실행
npx prisma migrate dev --name init
```

## 6. 개발 서버 실행

```bash
npm run dev
```

## 로그인 접근 방법

로그인 UI는 숨겨져 있습니다. 다음 방법으로 접근할 수 있습니다:

1. 직접 URL 접근: `http://localhost:3000/api/auth/signin`
2. 포트폴리오 페이지에서 특정 키 조합 사용 (구현 필요 시)

## 데이터베이스 관리

Prisma Studio를 사용하여 데이터베이스를 시각적으로 관리할 수 있습니다:

```bash
npx prisma studio
```


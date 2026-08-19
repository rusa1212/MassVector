This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 공공데이터포털 주식시세 API

금융위원회 `주식시세정보` API를 사용하려면 `.env.example`을 참고해 프로젝트 루트의
`.env.local`에 인증키를 설정하세요.

```env
PUBLIC_DATA_SERVICE_KEY=공공데이터포털_인증키
```

인증키는 서버에서만 사용됩니다. 서비스는 국내 6자리 종목만 지원하며 가격과
과거 시세는 공공데이터 API 응답만 사용합니다. API 오류 시에는 가짜 데이터를
대신 표시하지 않고 오류 상태를 안내합니다.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 일별 종가 기록

`.github/workflows/record-daily-stock-prices.yml`이 월요일부터 금요일까지
한국시간 오후 2시 10분에 실행되어 전 영업일 종가를 Supabase의
`stock_prices` 테이블에 누적합니다 (`supabase/migrations/0001_create_stock_prices.sql`
참고). 최근 30일을 매번 다시 조회해 `(ticker, date)` 기준으로 upsert하므로
휴장일이나 일시적인 실행 실패로 생긴 누락도 다음 실행에서 보완하고,
같은 날짜가 재수집돼도 중복 레코드가 쌓이지 않습니다.

GitHub 저장소의 Actions secret에 `PUBLIC_DATA_SERVICE_KEY`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`를 등록해야 합니다. 첫 실행은 Actions 화면에서
수동으로 실행할 수 있으며 종목별로 저장된 데이터가 없으면 약 1년치를
백필합니다. 로컬에서는 다음 명령으로 같은 작업을 실행할 수 있습니다
(`.env.local`에 `.env.example`과 동일한 변수 필요).

```bash
npm run prices:update
```

### Supabase 설정

1. Supabase 프로젝트의 SQL Editor에서 `supabase/migrations/0001_create_stock_prices.sql`을 실행해 `stock_prices` 테이블을 만듭니다.
2. `.env.example`을 참고해 `.env.local`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 채웁니다.
3. 기존에 `stock-prices.json`으로 쌓아둔 이력이 있다면 한 번만 다음 명령으로 옮깁니다.

```bash
npm run prices:migrate
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

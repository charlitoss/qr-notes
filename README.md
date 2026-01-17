# QR Notes

Create notes and share them instantly with QR codes. Simple, fast, and printable.

## Features

- Create text notes with auto-generated QR codes
- Editable labels for printed QR codes
- Print-friendly QR code output
- Mobile-responsive design
- Public note sharing via URL or QR scan

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Prisma** - Database ORM
- **PostgreSQL** - Database (via Neon)

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (recommended: [Neon](https://neon.tech) - free tier available)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/qr-notes.git
cd qr-notes
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
# Create a .env file with your database URL
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"
```

4. Run database migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deploy to Vercel

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Create a new project
3. Copy your connection string (it looks like `postgresql://...`)

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the environment variable:
   - `DATABASE_URL` = your Neon connection string
4. Deploy!

Vercel will automatically run the build and deploy your app.

### 3. Run Migrations on Production

After your first deploy, run migrations:
```bash
npx prisma migrate deploy
```

Or add this to your `package.json` build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

## Project Structure

```
qr-notes/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── page.tsx       # Home page (create notes)
│   │   ├── notes/[id]/    # View note page
│   │   └── api/notes/     # API routes
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   └── PrintableQR.tsx
│   └── lib/
│       └── prisma.ts      # Database client
└── package.json
```

## Future Features

- [ ] User authentication
- [ ] Private notes
- [ ] Media attachments
- [ ] Batch QR printing

## License

MIT

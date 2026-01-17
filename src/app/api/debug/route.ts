import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  
  return NextResponse.json({
    databaseUrlSet: !!dbUrl,
    databaseUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
  });
}

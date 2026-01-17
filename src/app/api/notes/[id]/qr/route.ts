import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // Generate the URL that the QR code will point to
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const noteUrl = `${protocol}://${host}/notes/${id}`;

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(noteUrl, {
      type: "png",
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return new NextResponse(qrBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}

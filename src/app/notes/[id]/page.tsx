import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    return { title: "Note Not Found" };
  }

  return {
    title: note.label || "QR Note",
    description: note.content.substring(0, 160),
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;

  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    notFound();
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          {note.label && (
            <CardTitle className="text-xl">{note.label}</CardTitle>
          )}
          <CardDescription>
            Created {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">
              {note.content}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Create your own QR Note →
        </Link>
      </div>
    </main>
  );
}

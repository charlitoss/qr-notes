"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  label: string | null;
  createdAt: string;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdNote, setCreatedNote] = useState<Note | null>(null);
  const [label, setLabel] = useState("");
  const [isUpdatingLabel, setIsUpdatingLabel] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please enter some content for your note");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const note: Note = await response.json();
      setCreatedNote(note);
      setLabel(note.label || "");
      toast.success("Note created successfully!");
    } catch {
      toast.error("Failed to create note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLabel = async () => {
    if (!createdNote) return;

    setIsUpdatingLabel(true);

    try {
      const response = await fetch(`/api/notes/${createdNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });

      if (!response.ok) {
        throw new Error("Failed to update label");
      }

      toast.success("Label updated!");
    } catch {
      toast.error("Failed to update label");
    } finally {
      setIsUpdatingLabel(false);
    }
  };

  const handleCopyUrl = () => {
    if (!createdNote) return;
    
    const url = `${window.location.origin}/notes/${createdNote.id}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateAnother = () => {
    setCreatedNote(null);
    setContent("");
    setLabel("");
  };

  const noteUrl = createdNote ? `${typeof window !== "undefined" ? window.location.origin : ""}/notes/${createdNote.id}` : "";

  // Success view after creating a note
  if (createdNote) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Print-only view */}
        <div className="print-only hidden print:flex print:flex-col print:items-center print:justify-center print:min-h-screen">
          <img
            src={`/api/notes/${createdNote.id}/qr`}
            alt="QR Code"
            className="w-64 h-64"
          />
          <p className="mt-4 text-lg font-medium text-center">{label}</p>
        </div>

        {/* Screen view */}
        <Card className="w-full max-w-md print:hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Note Created!</CardTitle>
            <CardDescription>
              Scan the QR code or share the URL to view this note
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg shadow-sm border">
                <img
                  src={`/api/notes/${createdNote.id}/qr`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            {/* Editable Label */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Label (appears below QR when printed)
              </label>
              <div className="flex gap-2">
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Enter a label..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleUpdateLabel}
                  disabled={isUpdatingLabel}
                  size="sm"
                >
                  {isUpdatingLabel ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            {/* URL Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Shareable URL
              </label>
              <div className="flex gap-2">
                <Input
                  value={noteUrl}
                  readOnly
                  className="flex-1 text-sm bg-muted"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyUrl}
                  size="sm"
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handlePrint} className="w-full" size="lg">
                Print QR Code
              </Button>
              <Button
                variant="outline"
                onClick={handleCreateAnother}
                className="w-full"
              >
                Create Another Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Note creation form
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">QR Notes</CardTitle>
          <CardDescription>
            Create a note and get a QR code to share it instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Your Note
              </label>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <Textarea
                  id="content"
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-32 resize-none"
                  disabled={isLoading}
                />
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? "Creating..." : "Create Note & Generate QR"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground text-center max-w-md">
        Notes are publicly accessible to anyone with the QR code or URL.
      </p>
    </main>
  );
}

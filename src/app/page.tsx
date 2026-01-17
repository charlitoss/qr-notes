"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PrintableQR } from "@/components/PrintableQR";

interface Note {
  id: string;
  content: string;
  label: string;
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
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) throw new Error("Failed to create note");

      const note = await response.json();
      setCreatedNote(note);
      setLabel(note.label);
      toast.success("Note created successfully!");
    } catch (error) {
      console.error(error);
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

      if (!response.ok) throw new Error("Failed to update label");

      toast.success("Label updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update label");
    } finally {
      setIsUpdatingLabel(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/notes/${createdNote?.id}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
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
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Background pattern */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

        {/* Print-only view */}
        <PrintableQR noteId={createdNote.id} label={label} />

        {/* Screen view */}
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm print:hidden">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">Note Created!</CardTitle>
            <CardDescription>
              Scan the QR code or share the URL to view this note
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                <img
                  src={`/api/notes/${createdNote.id}/qr`}
                  alt="QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56"
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
                  {isUpdatingLabel ? "..." : "Save"}
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
                  className="flex-1 text-xs bg-muted/50 font-mono"
                />
                <Button variant="outline" onClick={handleCopyUrl} size="sm">
                  Copy
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={handlePrint} size="lg" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print QR Code
              </Button>
              <Button variant="outline" onClick={handleCreateAnother} className="w-full">
                Create Another Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Create note form
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">QR Notes</h1>
          <p className="text-muted-foreground">
            Create a note, get a QR code, share it instantly
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Your Note
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your note here... It could be instructions, a message, contact info, or anything you want to share."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] resize-none"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!content.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Note & Generate QR"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground">
          Notes are publicly accessible to anyone with the QR code or URL.
        </p>
      </div>
    </main>
  );
}

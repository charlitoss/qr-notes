"use client";

interface PrintableQRProps {
  noteId: string;
  label: string;
}

export function PrintableQR({ noteId, label }: PrintableQRProps) {
  return (
    <div className="printable-qr hidden print:flex print:flex-col print:items-center print:justify-center print:min-h-screen print:bg-white">
      <div className="flex flex-col items-center">
        <img
          src={`/api/notes/${noteId}/qr`}
          alt="QR Code"
          className="w-72 h-72"
        />
        {label && (
          <p className="mt-6 text-xl font-medium text-center text-black max-w-xs">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

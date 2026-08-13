'use client';

import React, { useState } from 'react';
import './globals.css';
import { Sidebar } from '../components/sidebar';
import { UploadModal } from '../components/upload-modal';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();

  const handleUploadSuccess = (newMeetingId: number) => {
    router.push(`/meetings/${newMeetingId}`);
  };

  return (
    <html lang="en">
      <head>
        <title>Fireflies.ai — AI Meeting Assistant Workspace</title>
        <meta name="description" content="Functional clone of Fireflies.ai meeting assistant with interactive transcripts, audio sync, AI summaries, and Ask Fred bot." />
      </head>
      <body className="bg-[#0B0F17] text-white min-h-screen flex antialiased">
        <Sidebar onOpenUploadModal={() => setIsUploadOpen(true)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </div>

        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      </body>
    </html>
  );
}

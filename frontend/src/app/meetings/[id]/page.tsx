import React from 'react';
import { MeetingDetailClient } from './meeting-detail-client';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const meetingId = Number(params.id) || 1;
  return <MeetingDetailClient meetingId={meetingId} />;
}

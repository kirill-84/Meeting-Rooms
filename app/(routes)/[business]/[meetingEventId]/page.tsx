"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MeetingTimeDateSelection from '../_components/MeetingTimeDateSelection';

interface BusinessInfo {
  id: string;
  businessName: string;
  userName: string;
  email?: string;
  daysAvailable?: Record<string, boolean>;
  startTime?: string;
  endTime?: string;
}

interface EventInfo {
  id: string;
  eventName: string;
  duration: number;
  locationType: string;
  locationUrl?: string;
  description?: string;
  themeColor: string;
}

interface MeetingEventPageProps {
  params: {
    business: string;
    meetingEventId: string;
  };
}

const MeetingEventPage: React.FC<MeetingEventPageProps> = ({ params }) => {
  const router = useRouter();
  const { business, meetingEventId } = params;

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch business info by slug
        const busRes = await fetch(`/api/business?businessName=${encodeURIComponent(business)}`);
        if (!busRes.ok) throw new Error('Не удалось загрузить данные бизнеса');
        const busData: BusinessInfo = await busRes.json();
        setBusinessInfo(busData);

        // Fetch event info by ID
        const evtRes = await fetch(`/api/meeting-events/${encodeURIComponent(meetingEventId)}`);
        if (!evtRes.ok) throw new Error('Не удалось загрузить данные события');
        const evtData: EventInfo = await evtRes.json();
        setEventInfo(evtData);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [business, meetingEventId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error || !businessInfo || !eventInfo) {
    return <div>Ошибка: {error || 'Данные не найдены'}</div>;
  }

  return (
    <div>
      <MeetingTimeDateSelection
        businessInfo={businessInfo}
        eventInfo={eventInfo}
      />
    </div>
  );
};

export default MeetingEventPage;

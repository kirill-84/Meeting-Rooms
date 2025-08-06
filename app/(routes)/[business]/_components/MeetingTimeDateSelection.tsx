"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TimeDateSelection from './TimeDateSelection';
import UserFormInfo from './UserFormInfo';
import { Button } from '@/components/ui/button';

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

interface MeetingTimeDateSelectionProps {
  businessInfo: BusinessInfo;
  eventInfo: EventInfo;
}

const MeetingTimeDateSelection: React.FC<MeetingTimeDateSelectionProps> = ({ businessInfo, eventInfo }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [prevBooking, setPrevBooking] = useState<{ selectedTime: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Generate slots when date changes
  useEffect(() => {
    if (!date || !businessInfo.startTime || !businessInfo.endTime) return;
    const slots: string[] = [];
    const [startH, startM] = businessInfo.startTime.split(':').map(Number);
    const [endH, endM] = businessInfo.endTime.split(':').map(Number);
    let current = new Date(date);
    current.setHours(startH, startM, 0, 0);
    const end = new Date(date);
    end.setHours(endH, endM, 0, 0);
    while (current <= end) {
      slots.push(current.toTimeString().substr(0,5));
      current = new Date(current.getTime() + eventInfo.duration * 60000);
    }
    setTimeSlots(slots);

    // fetch previous bookings
    (async () => {
      try {
        const res = await fetch(
          `/api/scheduled-meetings?businessId=${businessInfo.id}&eventId=${eventInfo.id}&date=${date.toISOString().split('T')[0]}`
        );
        if (!res.ok) throw new Error('Не удалось получить занятые слоты');
        const data = await res.json();
        setPrevBooking(data);
      } catch (err: any) {
        toast.error(err.message || 'Error fetching bookings');
      }
    })();

    setSelectedTime('');
  }, [date, businessInfo, eventInfo]);

  const handleSubmit = async () => {
    if (!date || !selectedTime || !userName) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setLoading(true);
    try {
      const isoDate = date.toISOString().split('T')[0];
      const res = await fetch('/api/scheduled-meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now().toString(),
          businessId: businessInfo.id,
          businessName: businessInfo.businessName,
          businessEmail: businessInfo.email,
          eventId: eventInfo.id,
          selectedDate: isoDate,
          selectedTime,
          duration: eventInfo.duration,
          userName,
          userEmail: userEmail || null,
          userNote: userNote || null,
        }),
      });
      if (!res.ok) throw new Error('Не удалось сохранить встречу');
      toast.success('Встреча успешно забронирована!');
      setDate(undefined);
      setSelectedTime('');
      setUserName('');
      setUserEmail('');
      setUserNote('');
    } catch (err: any) {
      toast.error(err.message || 'Error booking meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: eventInfo.themeColor }}>
          {eventInfo.eventName}
        </h1>
        {eventInfo.description && <p>{eventInfo.description}</p>}
      </div>
      <TimeDateSelection
        date={date}
        handleDateChange={setDate}
        timeSlots={timeSlots}
        setSelectedTime={setSelectedTime}
        enableTimeSlot={!!date}
        selectedTime={selectedTime}
        prevBooking={prevBooking}
      />
      {selectedTime && (
        <>
          <UserFormInfo
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserNote={setUserNote}
          />
          <div className="px-8">
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? 'Сохраняем...' : 'Подтвердить встречу'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MeetingTimeDateSelection;

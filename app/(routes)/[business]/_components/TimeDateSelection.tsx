import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface TimeDateSelectionProps {
  date?: Date;
  handleDateChange: (d: Date) => void;
  timeSlots: string[];
  setSelectedTime: (time: string) => void;
  enableTimeSlot: boolean;
  selectedTime: string;
  prevBooking: { selectedTime: string }[];
}

const TimeDateSelection: React.FC<TimeDateSelectionProps> = ({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  enableTimeSlot,
  selectedTime,
  prevBooking,
}) => {
  const checkTimeSlot = (time: string) => {
    return prevBooking.some(item => item.selectedTime === time);
  };

  return (
    <div className="md:col-span-2 flex px-4">
      <div className="flex flex-col">
        <h2 className="font-bold text-lg">Select Date &amp; Time</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={d => d && handleDateChange(d)}
          className="rounded-md border mt-5"
          disabled={(d: Date) => d <= new Date()}
        />
      </div>
      <div
        className="flex flex-col w-full overflow-auto gap-4 p-5"
        style={{ maxHeight: '400px' }}
      >
        {timeSlots.map(time => (
          <Button
            key={time}
            disabled={!enableTimeSlot || checkTimeSlot(time)}
            onClick={() => setSelectedTime(time)}
            className={`border-primary text-primary ${
				time === selectedTime ? 'bg-primary text-white' : ''
			}`}
            variant="outline"
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeDateSelection;

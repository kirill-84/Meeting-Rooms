import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';

interface FormValue {
	eventName?: string;
	duration?: number;
	locationType?: string;
	locationUrl?: string;
	themeColor?: string;
}

interface PreviewMeetingProps {
	formValue: FormValue;
}

function PreviewMeeting({ formValue }: PreviewMeetingProps) {
	const [date, setDate] = useState<Date>(new Date());
	const [timeSlots, setTimeSlots] = useState<string[]>([]);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	// Используем useCallback для createTimeSlot чтобы функция была стабильной
	const createTimeSlot = useCallback((interval: number) => {
		const startTime = 8 * 60; // 8 AM in minutes
		const endTime = 22 * 60; // 10 PM in minutes
		const totalSlots = Math.floor((endTime - startTime) / interval);

		const slots = Array.from({ length: totalSlots }, (_, i) => {
			const totalMinutes = startTime + i * interval;
			const hours = Math.floor(totalMinutes / 60);
			const minutes = totalMinutes % 60;
			const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
			const period = hours >= 12 ? 'PM' : 'AM';
			return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
		});

		setTimeSlots(slots);
	}, []);

	// Обновляем временные слоты только при изменении продолжительности
	useEffect(() => {
		if (formValue?.duration) {
			createTimeSlot(formValue.duration);
		}
	}, [formValue?.duration, createTimeSlot]);

	// Функция для выбора времени
	const handleTimeSelect = (time: string) => {
		setSelectedTime(time);
	};

	return (
		<div
			className='p-5 py-10 shadow-lg border-t-8 mx-0 md:m-5'
			style={{ borderTopColor: formValue?.themeColor || '#4F75FE' }}
		>
			<Image src='/logo.svg' alt='logo' width={150} height={150} priority={false} />
			<div className='grid grid-cols-1 md:grid-cols-3 mt-5 gap-4'>
				{/* Meeting Info */}
				<div className='p-4 md:border-r'>
					<h2>Business Name</h2>
					<h2 className='font-bold text-3xl'>
						{formValue?.eventName ? formValue.eventName : 'Meeting Name'}
					</h2>
					<div className='mt-5 flex flex-col gap-4'>
						<h2 className='flex gap-2'>
							<Clock />{formValue?.duration || 30} Min
						</h2>
						<h2 className='flex gap-2'>
							<MapPin />{formValue?.locationType || 'Location'} Meeting
						</h2>
						{selectedTime && (
							<h2 className='flex gap-2'>Selected: {selectedTime}</h2>
						)}
						{formValue?.locationUrl && (
							<Link
								href={formValue.locationUrl}
								className='text-primary'
							>
								{formValue.locationUrl}
							</Link>
						)}
					</div>
				</div>
				{/* Time & Date Selection */}
				<div className='md:col-span-2 flex flex-col md:flex-row gap-4 px-0 md:px-4'>
					<div className='flex flex-col'>
						<h2 className='font-bold text-lg'>Select Date & Time</h2>
						<Calendar
							mode="single"
							selected={date}
							onSelect={(newDate) => newDate && setDate(newDate)}
							className="rounded-md border mt-5"
							disabled={(currentDate) => currentDate < new Date()}
						/>
					</div>
					<div
						className='flex flex-col w-full overflow-auto gap-4 p-2 md:p-5'
						style={{ maxHeight: '400px' }}
					>
						{timeSlots.map((time, index) => (
							<Button
								key={index}
								onClick={() => handleTimeSelect(time)}
								className={`border-primary ${
									selectedTime === time ? 'bg-primary text-white' : 'text-primary'
								}`}
								variant="outline"
							>
								{time}
							</Button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PreviewMeeting;

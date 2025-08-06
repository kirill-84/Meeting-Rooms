"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationOption from '@/app/_utils/LocationOption';
import Image from 'next/image';
import Link from 'next/link';
import ThemeOptions from '@/app/_utils/ThemeOptions';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FormValue {
	eventName?: string;
	duration?: number;
	locationType?: string;
	locationUrl?: string;
	themeColor?: string;
}

interface MeetingFormProps {
	setFormValue: (value: FormValue) => void;
}

function MeetingForm({ setFormValue }: MeetingFormProps) {
	const [themeColor, setThemeColor] = useState<string>(ThemeOptions[0] || '#4F75FE');
	const [eventName, setEventName] = useState<string>('');
	const [duration, setDuration] = useState<number>(30);
	const [locationType, setLocationType] = useState<string>('');
	const [locationUrl, setLocationUrl] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { data: session, status } = useSession();
	const router = useRouter();

	// Обновляем родительское состояние только когда любое из этих значений меняется,
	// но используем useEffect с проверкой предыдущих значений для предотвращения лишних обновлений
	useEffect(() => {
		// Используем объект с актуальными значениями
		const newFormValue = {
			eventName,
			duration,
			locationType,
			locationUrl,
			themeColor
		};

		setFormValue(newFormValue);

		// Зависимости включают все значения, которые влияют на формирование newFormValue
	}, [eventName, duration, locationType, locationUrl, themeColor, setFormValue]);

	const onCreateClick = async () => {
		if (!session?.user?.id || !eventName || !duration || !locationType || !locationUrl) {
			toast.error('Please fill all required fields');
			return;
		}

		setIsLoading(true);
		try {
			// Сначала получаем информацию о бизнесе
			const businessResponse = await fetch(`/api/business?userId=${session.user.id}`);
			if (!businessResponse.ok) {
				const errorData = await businessResponse.json();
				toast.error(errorData.error || 'Failed to get business information');
				return;
			}

			const businessData = await businessResponse.json();
			const id = Date.now().toString();

			// Создаем событие встречи
			const response = await fetch('/api/meeting-events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
					eventName,
					duration,
					locationType,
					locationUrl,
					themeColor,
					businessId: businessData.id,
					createdBy: session.user.id
				}),
			});

			if (response.ok) {
				toast.success('New Meeting Event Created!');
				router.replace('/dashboard/meeting-type');
			} else {
				const data = await response.json();
				console.error("Meeting creation error:", data);
				toast.error(data.error || 'Failed to create meeting event');
			}
		} catch (error) {
			console.error('Error creating meeting event:', error);
			toast.error('An error occurred while creating the meeting event');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='p-0'>
			<Link href={'/dashboard'}>
				<h2 className='flex gap-2'>
					<ChevronLeft /> Cancel
				</h2>
			</Link>
			<div className='mt-4'>
				<h2 className='font-bold text-2xl my-4'>Create New Event</h2>
				<hr />
			</div>
			<div className='flex flex-col gap-3 my-4'>
				<h2 className='font-bold'>Event Name *</h2>
				<Input
					placeholder="Name of your meeting event"
					value={eventName}
					onChange={(event) => setEventName(event.target.value)}
				/>

				<h2 className='font-bold'>Duration *</h2>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="max-w-40">{duration} Min</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => setDuration(15)}>15 Min</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setDuration(30)}>30 Min</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setDuration(45)}>45 Min</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setDuration(60)}>60 Min</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<h2 className='font-bold'>Location *</h2>
				<div className='grid grid-cols-4 gap-3'>
					{LocationOption.map((option, index) => (
						<div
							key={index}
							className={`border flex flex-col justify-center items-center p-3 rounded-lg cursor-pointer
                hover:bg-blue-100 hover:border-primary
                ${locationType === option.name ? 'bg-blue-100 border-primary' : ''}
              `}
							onClick={() => setLocationType(option.name)}
						>
							<Image
								src={option.icon}
								width={30}
								height={30}
								alt={option.name}
							/>
							<h2>{option.name}</h2>
						</div>
					))}
				</div>
				{locationType && (
					<>
						<h2 className='font-bold'>Add {locationType} Url *</h2>
						<Input
							placeholder='Add Url'
							value={locationUrl}
							onChange={(event) => setLocationUrl(event.target.value)}
						/>
					</>
				)}
				<h2 className='font-bold'>Select Theme Color</h2>
				<div className='flex justify-evenly'>
					{ThemeOptions.map((color, index) => (
						<div
							key={index}
							className={`h-7 w-7 rounded-full
                ${themeColor === color ? ' border-4 border-black' : ''}
              `}
							style={{ backgroundColor: color }}
							onClick={() => setThemeColor(color)}
						/>
					))}
				</div>
			</div>

			<Button
				className="w-full mt-9"
				disabled={!eventName || !duration || !locationType || !locationUrl || isLoading}
				onClick={onCreateClick}
			>
				{isLoading ? 'Creating...' : 'Create'}
			</Button>
		</div>
	);
}

export default MeetingForm;

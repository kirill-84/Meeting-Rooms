"use client"

import DaysList from '@/app/_utils/DaysList';
import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface DaysAvailable {
	[key: string]: boolean;
}

function Availability() {
	const [daysAvailable, setDaysAvailable] = useState<DaysAvailable>({
		Sunday: false,
		Monday: false,
		Tuesday: false,
		Wednesday: false,
		Thursday: false,
		Friday: false,
		Saturday: false
	});

	const [startTime, setStartTime] = useState<string>('09:00');
	const [endTime, setEndTime] = useState<string>('17:00');
	const { data: session, status } = useSession();

	useEffect(() => {
		let isMounted = true; // Флаг для предотвращения обновления состояния при размонтировании

		if (status === 'authenticated' && session?.user?.id) {
			(async () => {
				try {
					const business = await fetch(`/api/business?userId=${session.user.id}`);

					// Проверяем, что компонент все еще смонтирован
					if (!isMounted) return;

					if (business.ok) {
						const businessData = await business.json();

						if (isMounted) {
							if (businessData.daysAvailable) {
								setDaysAvailable(businessData.daysAvailable);
							}
							if (businessData.startTime) {
								setStartTime(businessData.startTime);
							}
							if (businessData.endTime) {
								setEndTime(businessData.endTime);
							}
						}
					}
				} catch (error) {
					console.error("Error fetching business info:", error);
				}
			})();
		}

		// Функция очистки для предотвращения обновления state после размонтирования
		return () => {
			isMounted = false;
		};
	}, [session, status]);

	const getBusinessInfo = async () => {
		try {
			if (!session?.user?.id) return; // Защита от отсутствия ID

			const business = await fetch(`/api/business?userId=${session.user.id}`);
			if (business.ok) {
				const businessData = await business.json();

				// Используем один вызов setState для групповых обновлений,
				// чтобы избежать нескольких перерендеров
				const updates = {
					daysAvailable: businessData.daysAvailable || {
						Sunday: false,
						Monday: false,
						Tuesday: false,
						Wednesday: false,
						Thursday: false,
						Friday: false,
						Saturday: false
					},
					startTime: businessData.startTime || '09:00',
					endTime: businessData.endTime || '17:00'
				};

				// Обновляем все состояния сразу
				setDaysAvailable(updates.daysAvailable);
				setStartTime(updates.startTime);
				setEndTime(updates.endTime);
			}
		} catch (error) {
			console.error("Error fetching business info:", error);
			// НЕ используем toast здесь, чтобы избежать обновления во время рендеринга
		}
	};

	const onHandleChange = (day: string, value: boolean) => {
		setDaysAvailable({
			...daysAvailable,
			[day]: value
		});
	};

	const handleSave = async () => {
		try {
			const business = await fetch(`/api/business?userId=${session?.user?.id}`);
			if (business.ok) {
				const businessData = await business.json();

				const response = await fetch(`/api/business/${businessData.id}/availability`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						daysAvailable,
						startTime,
						endTime
					}),
				});

				if (response.ok) {
					toast.success('Changes Updated!');
				} else {
					toast.error('Failed to update availability');
				}
			}
		} catch (error) {
			console.error("Error updating availability:", error);
			toast.error('An error occurred while saving changes');
		}
	};

	return (
		<div className='p-10'>
			<h2 className='font-bold text-2xl'>Availability</h2>
			<hr className='my-7' />
			<div>
				<h2 className='font-bold'>Availability Days</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
					{DaysList && DaysList.map((item, index) => (
						<div key={index}>
							<h2>
								<Checkbox
									checked={daysAvailable[item.day] || false} // Упрощенная проверка
									onCheckedChange={(e) => onHandleChange(item.day, e === true)}
								/> {item.day}
							</h2>
						</div>
					))}
				</div>
			</div>
			<div>
				<h2 className='font-bold mt-10'>Availability Time</h2>
				<div className='flex gap-10'>
					<div className='mt-3'>
						<h2>Start Time</h2>
						<Input
							type="time"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
						/>
					</div>
					<div className='mt-3'>
						<h2>End Time</h2>
						<Input
							type="time"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<Button className="mt-10" onClick={handleSave}>
				Save
			</Button>
		</div>
	);
}

export default Availability;

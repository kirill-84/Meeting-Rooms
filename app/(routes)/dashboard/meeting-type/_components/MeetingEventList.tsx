"use client"

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Clock, Copy, MapPin, Pen, Settings, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MeetingEvent, Business } from '@/types';
import EditMeetingDialog from './EditMeetingDialog';

interface MeetingEventListProps {
	searchQuery?: string;
}

function MeetingEventList({ searchQuery = '' }: MeetingEventListProps) {
	const { data: session, status } = useSession();
	const [businessInfo, setBusinessInfo] = useState<Business | null>(null);
	const [eventList, setEventList] = useState<MeetingEvent[]>([]);
	const [filteredEventList, setFilteredEventList] = useState<MeetingEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		if (status === 'authenticated' && session?.user?.id) {
			getEventList();
			getBusinessInfo();
		}
	}, [session, status]);

	// Фильтрация событий при изменении поискового запроса
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredEventList(eventList);
			return;
		}

		const filtered = eventList.filter(event =>
			event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredEventList(filtered);
	}, [searchQuery, eventList]);

	const getEventList = async () => {
		setLoading(true);
		if (!session?.user?.id) return;

		try {
			const response = await fetch(`/api/meeting-events?userId=${session.user.id}`);
			if (response.ok) {
				const data = await response.json();
				setEventList(data);
				setFilteredEventList(data);
			} else {
				toast.error('Failed to load meeting events');
			}
		} catch (error) {
			console.error('Error fetching meeting events:', error);
			toast.error('An error occurred while loading meeting events');
		} finally {
			setLoading(false);
		}
	};

	const getBusinessInfo = async () => {
		if (!session?.user?.id) return;

		try {
			const response = await fetch(`/api/business?userId=${session.user.id}`);
			if (response.ok) {
				const data = await response.json();
				setBusinessInfo(data);
			} else {
				toast.error('Failed to load business information');
			}
		} catch (error) {
			console.error('Error fetching business info:', error);
		}
	};

	const onDeleteMeetingEvent = async (event: MeetingEvent) => {
		try {
			const response = await fetch(`/api/meeting-events/${event.id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				toast.success('Meeting Event Deleted!');
				getEventList();
			} else {
				toast.error('Failed to delete meeting event');
			}
		} catch (error) {
			console.error('Error deleting meeting event:', error);
			toast.error('An error occurred while deleting the meeting event');
		}
	};

	const onCopyClickHandler = (event: MeetingEvent) => {
		if (!businessInfo) return;

		const meetingEventUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${businessInfo.businessName}/${event.id}`;
		navigator.clipboard.writeText(meetingEventUrl);
		toast.success('Copied to Clipboard');
	};

	const handleEditEvent = (event: MeetingEvent) => {
		setTimeout(() => {
			setSelectedEvent(event);
			setIsEditDialogOpen(true);
		}, 0);
	};

	const handleSaveEvent = async (updatedEvent: MeetingEvent) => {
		try {
			const response = await fetch(`/api/meeting-events/${updatedEvent.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedEvent),
			});

			if (response.ok) {
				toast.success('Meeting Event Updated!');
				getEventList(); // Обновляем список после редактирования
				setIsEditDialogOpen(false);
			} else {
				const data = await response.json();
				toast.error(data.error || 'Failed to update meeting event');
			}
		} catch (error) {
			console.error('Error updating meeting event:', error);
			toast.error('An error occurred while updating the meeting event');
		}
	};

	if (loading) {
		return <h2>Loading...</h2>;
	}

	return (
		<>
			<div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
				{filteredEventList.length > 0 ? (
					filteredEventList.map((event) => (
						<div
							key={event.id}
							className='border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3'
							style={{ borderTopColor: event.themeColor }}
						>
							<div className='flex justify-end'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Settings className='cursor-pointer' />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem
											className="flex gap-2"
											onClick={() => handleEditEvent(event)}
										>
											<Pen /> Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											className="flex gap-2"
											onClick={() => onDeleteMeetingEvent(event)}
										>
											<Trash /> Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							<h2 className="font-medium text-xl">
								{event.eventName}
							</h2>
							<div className='flex justify-between'>
								<h2 className='flex gap-2 text-gray-500'>
									<Clock /> {event.duration} Min
								</h2>
								<h2 className='flex gap-2 text-gray-500'>
									<MapPin /> {event.locationType}
								</h2>
							</div>
							<hr />
							<div className='flex justify-between'>
								<h2
									className='flex gap-2 text-sm text-primary items-center cursor-pointer'
									onClick={() => onCopyClickHandler(event)}
								>
									<Copy className='h-4 w-4' /> Copy Link
								</h2>
								<Button
									variant="outline"
									className="rounded-full text-primary border-primary"
								>
									Share
								</Button>
							</div>
						</div>
					))
				) : searchQuery ? (
					<div className="col-span-full text-center">
						<p>No meeting events found matching "{searchQuery}"</p>
					</div>
				) : (
					<div className="col-span-full text-center">
						<p>No meeting events found. Create your first meeting event!</p>
					</div>
				)}
			</div>

			{/* Диалоговое окно редактирования */}
			{selectedEvent && (
				<EditMeetingDialog
					event={selectedEvent}
					isOpen={isEditDialogOpen}
					onClose={() => setIsEditDialogOpen(false)}
					onSave={handleSaveEvent}
				/>
			)}
		</>
	);
}

export default MeetingEventList;

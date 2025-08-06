"use client"

import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationOption from '@/app/_utils/LocationOption';
import ThemeOptions from '@/app/_utils/ThemeOptions';
import Image from 'next/image';
import { MeetingEvent } from '@/types';

interface EditMeetingDialogProps {
	event: MeetingEvent;
	isOpen: boolean;
	onClose: () => void;
	onSave: (updatedEvent: MeetingEvent) => void;
}

function EditMeetingDialog({ event, isOpen, onClose, onSave }: EditMeetingDialogProps) {
	const [formData, setFormData] = useState<MeetingEvent>(structuredClone(event));

	// Обновляем формы при изменении event
	useEffect(() => {
		if (isOpen) {
			setFormData(structuredClone(event));
		}
	}, [isOpen, event]);

	const handleChange = (field: keyof MeetingEvent, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = () => {
		// Проверка обязательных полей
		if (!formData.eventName || !formData.duration || !formData.locationType) {
			return;
		}
		onSave(formData);
		onClose(); // Закрытие диалога
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>Edit Meeting Event</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<label className="text-right font-medium">Event Name</label>
						<Input
							className="col-span-3"
							value={formData.eventName}
							onChange={(e) => handleChange('eventName', e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<label className="text-right font-medium">Duration</label>
						<div className="col-span-3">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										onClick={(e) => e.preventDefault()}>{formData.duration} Min</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => handleChange('duration', 15)}>15 Min</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleChange('duration', 30)}>30 Min</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleChange('duration', 45)}>45 Min</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleChange('duration', 60)}>60 Min</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<label className="text-right font-medium">Location</label>
						<div className="col-span-3 grid grid-cols-4 gap-2">
							{LocationOption.map((option, index) => (
								<div
									key={index}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => e.key === 'Enter' && handleChange('locationType', option.name)}
									className={`border flex flex-col justify-center items-center p-2 rounded-lg cursor-pointer
                    hover:bg-blue-100 hover:border-primary text-center
                    ${formData.locationType === option.name ? 'bg-blue-100 border-primary' : ''}
                  `}
									onClick={() => handleChange('locationType', option.name)}
								>
									<Image
										src={option.icon}
										width={24}
										height={24}
										alt={option.name}
									/>
									<h2 className="text-xs">{option.name}</h2>
								</div>
							))}
						</div>
					</div>

					{formData.locationType && (
						<div className="grid grid-cols-4 items-center gap-4">
							<label className="text-right font-medium">URL</label>
							<Input
								className="col-span-3"
								value={formData.locationUrl || ''}
								onChange={(e) => handleChange('locationUrl', e.target.value)}
							/>
						</div>
					)}

					<div className="grid grid-cols-4 items-center gap-4">
						<label className="text-right font-medium">Theme Color</label>
						<div className="col-span-3 flex justify-start gap-2">
							{ThemeOptions.map((color, index) => (
								<div
									key={index}
									className={`h-6 w-6 rounded-full cursor-pointer
                    ${formData.themeColor === color ? 'border-4 border-black' : ''}
                  `}
									style={{ backgroundColor: color }}
									onClick={() => handleChange('themeColor', color)}
								/>
							))}
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>Cancel</Button>
					<Button onClick={handleSubmit}>Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default EditMeetingDialog;

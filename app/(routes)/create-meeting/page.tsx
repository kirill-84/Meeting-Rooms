"use client"

import React, { useState, useCallback } from 'react';
import MeetingForm from './_components/MeetingForm';
import PreviewMeeting from './_components/PreviewMeeting';

interface FormValue {
	eventName?: string;
	duration?: number;
	locationType?: string;
	locationUrl?: string;
	themeColor?: string;
}

function CreateMeeting() {
	const [formValue, setFormValue] = useState<FormValue>({
		duration: 30, // Устанавливаем значение по умолчанию
		themeColor: '#4F75FE' // Устанавливаем значение по умолчанию
	});

	// Используем useCallback чтобы предотвратить ненужные ререндеры
	const handleFormValueChange = useCallback((value: FormValue) => {
		setFormValue(prevValue => {
			// Проверяем, действительно ли значения изменились
			if (JSON.stringify(prevValue) === JSON.stringify(value)) {
				return prevValue; // Возвращаем предыдущее значение если ничего не изменилось
			}
			return value;
		});
	}, []);

	return (
		<div className='flex flex-col md:grid md:grid-cols-3 gap-4'>
			{/* Meeting Form */}
			<div className='shadow-md border md:h-screen p-4'>
				<MeetingForm setFormValue={handleFormValueChange} />
			</div>
			{/* Preview */}
			<div className='md:col-span-2 p-4'>
				<PreviewMeeting formValue={formValue} />
			</div>
		</div>
	);
}

export default CreateMeeting;

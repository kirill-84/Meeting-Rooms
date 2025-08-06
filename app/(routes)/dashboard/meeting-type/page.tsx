"use client"

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import MeetingEventList from './_components/MeetingEventList';

export default function MeetingType() {
	const [searchQuery, setSearchQuery] = useState<string>('');

	return (
		<div className='p-5'>
			<div className='flex flex-col gap-5'>
				<h2 className='font-bold text-3xl'>Meeting Event Type</h2>
				<Input
					placeholder="Search by event name"
					className="max-w-xs"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<hr />
			</div>
			<MeetingEventList searchQuery={searchQuery} />
		</div>
	);
}

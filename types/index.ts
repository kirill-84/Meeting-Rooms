// types/index.ts
export interface User {
	id: string;
	name: string;
	email?: string;
	image?: string;
	role?: 'admin' | 'user';
	createdAt: Date;
	updatedAt: Date;
}

export interface Business {
	id: string;
	userId: string;
	businessName: string;
	userName: string;
	email?: string;
	daysAvailable?: {
		[key: string]: boolean;
	};
	startTime?: string;
	endTime?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface MeetingEvent {
	id: string;
	eventName: string;
	duration: number;
	locationType: string;
	locationUrl?: string;
	description?: string;
	themeColor: string;
	businessId: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ScheduledMeeting {
	id: string;
	selectedTime: string;
	selectedDate: Date;
	formatedDate: string;
	formatedTimeStamp: string;
	duration: number;
	locationUrl?: string;
	userName: string;
	userEmail: string;
	userNote?: string;
	businessId: string;
	businessName: string;
	businessEmail?: string;
	eventId: string;
	userId?: string;
	createdAt: Date;
	updatedAt: Date;
}

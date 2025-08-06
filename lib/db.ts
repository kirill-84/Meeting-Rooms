import { Pool } from 'pg';
import { Business, MeetingEvent, ScheduledMeeting } from '@/types';

// Создаем пул соединений с локальным PostgreSQL
export const pool = new Pool({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST || 'localhost',
	port: parseInt(process.env.POSTGRES_PORT || '5432'),
	database: process.env.POSTGRES_DATABASE,
});

// Функции для работы с бизнесом
export async function getBusinessByUserId(userId: string): Promise<Business | null> {
	try {
		const result = await pool.query<Business>(
			'SELECT * FROM "Business" WHERE "userId" = $1',
			[userId]
		);
		return result.rows[0] || null;
	} catch (error) {
		console.error('Error getting business by user ID:', error);
		return null;
	}
}

export async function getBusinessByName(businessName: string): Promise<Business | null> {
	try {
		const result = await pool.query<Business>(
			'SELECT * FROM "Business" WHERE "businessName" = $1',
			[businessName]
		);
		return result.rows[0] || null;
	} catch (error) {
		console.error('Error getting business by name:', error);
		return null;
	}
}

export async function createBusiness(business: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business | null> {
	try {
		const id = Date.now().toString();
		const result = await pool.query<Business>(
			`INSERT INTO "Business" ("id", "userId", "businessName", "userName", "email")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
			[
				id,
				business.userId,
				business.businessName.replace(" ", "_"),
				business.userName,
				business.email || null
			]
		);
		return result.rows[0];
	} catch (error) {
		console.error('Error creating business:', error);
		return null;
	}
}

export async function updateBusinessAvailability(
	id: string,
	daysAvailable: { [key: string]: boolean },
	startTime: string,
	endTime: string
): Promise<boolean> {
	try {
		await pool.query(
			`UPDATE "Business"
       SET "daysAvailable" = $1, "startTime" = $2, "endTime" = $3, "updatedAt" = NOW()
       WHERE "id" = $4`,
			[JSON.stringify(daysAvailable), startTime, endTime, id]
		);
		return true;
	} catch (error) {
		console.error('Error updating business availability:', error);
		return false;
	}
}

// Функции для работы с событиями встреч
export async function getMeetingEventsByUserId(userId: string): Promise<MeetingEvent[]> {
	try {
		const result = await pool.query<MeetingEvent>(
			`SELECT e.*
       FROM "MeetingEvent" e
       JOIN "Business" b ON e."businessId" = b."id"
       WHERE b."userId" = $1
       ORDER BY e."createdAt" DESC`,
			[userId]
		);
		return result.rows;
	} catch (error) {
		console.error('Error getting meeting events by user ID:', error);
		return [];
	}
}

export async function getMeetingEventById(eventId: string): Promise<MeetingEvent | null> {
	try {
		const result = await pool.query<MeetingEvent>(
			'SELECT * FROM "MeetingEvent" WHERE "id" = $1',
			[eventId]
		);
		return result.rows[0] || null;
	} catch (error) {
		console.error('Error getting meeting event by ID:', error);
		return null;
	}
}

export async function createMeetingEvent(event: Omit<MeetingEvent, 'createdAt' | 'updatedAt'>): Promise<MeetingEvent | null> {
	try {
		const result = await pool.query<MeetingEvent>(
			`INSERT INTO "MeetingEvent" (
        "id", "eventName", "duration", "locationType", "locationUrl",
        "description", "themeColor", "businessId", "createdBy"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
			[
				event.id,
				event.eventName,
				event.duration,
				event.locationType,
				event.locationUrl || null,
				event.description || null,
				event.themeColor,
				event.businessId,
				event.createdBy
			]
		);
		return result.rows[0];
	} catch (error) {
		console.error('Error creating meeting event:', error);
		return null;
	}
}

export async function deleteMeetingEvent(eventId: string): Promise<boolean> {
	try {
		await pool.query('DELETE FROM "MeetingEvent" WHERE "id" = $1', [eventId]);
		return true;
	} catch (error) {
		console.error('Error deleting meeting event:', error);
		return false;
	}
}

// Функции для работы с запланированными встречами
export async function getScheduledMeetingsByBusinessId(businessId: string): Promise<ScheduledMeeting[]> {
	try {
		const result = await pool.query<ScheduledMeeting>(
			'SELECT * FROM "ScheduledMeeting" WHERE "businessId" = $1 ORDER BY "selectedDate" DESC',
			[businessId]
		);
		return result.rows;
	} catch (error) {
		console.error('Error getting scheduled meetings by business ID:', error);
		return [];
	}
}

// Функции для работы с запланированными встречами
export async function getScheduledMeetingsByUserId(userId: string): Promise<ScheduledMeeting[]> {
    try {
        // Сначала получаем бизнес пользователя
        const business = await pool.query<Business>(
            'SELECT * FROM "Business" WHERE "userId" = $1',
            [userId]
        );
        
        if (business.rows.length === 0) {
            return [];
        }
        
        const businessId = business.rows[0].id;
        
        // Теперь получаем встречи этого бизнеса
        const result = await pool.query<ScheduledMeeting>(
            'SELECT * FROM "ScheduledMeeting" WHERE "businessId" = $1 ORDER BY "selectedDate" DESC',
            [businessId]
        );
        
        return result.rows;
    } catch (error) {
        console.error('Error getting scheduled meetings by user ID:', error);
        return [];
    }
}

export async function getScheduledMeetingsForDate(eventId: string, date: Date): Promise<ScheduledMeeting[]> {
	try {
		const result = await pool.query<ScheduledMeeting>(
			'SELECT * FROM "ScheduledMeeting" WHERE "eventId" = $1 AND "selectedDate" = $2',
			[eventId, date]
		);
		return result.rows;
	} catch (error) {
		console.error('Error getting scheduled meetings for date:', error);
		return [];
	}
}

export async function createScheduledMeeting(meeting: Omit<ScheduledMeeting, 'createdAt' | 'updatedAt'>): Promise<ScheduledMeeting | null> {
	try {
		const result = await pool.query<ScheduledMeeting>(
			`INSERT INTO "ScheduledMeeting" (
        "id", "businessId", "businessName", "businessEmail", "selectedTime", "selectedDate",
        "formatedDate", "formatedTimeStamp", "duration", "locationUrl",
        "eventId", "userName", "userEmail", "userNote"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
			[
				meeting.id,
				meeting.businessId,
				meeting.businessName,
				meeting.businessEmail,
				meeting.selectedTime,
				meeting.selectedDate,
				meeting.formatedDate,
				meeting.formatedTimeStamp,
				meeting.duration,
				meeting.locationUrl || null,
				meeting.eventId,
				meeting.userName,
				meeting.userEmail,
				meeting.userNote || null
			]
		);
		return result.rows[0];
	} catch (error) {
		console.error('Error creating scheduled meeting:', error);
		return null;
	}
}

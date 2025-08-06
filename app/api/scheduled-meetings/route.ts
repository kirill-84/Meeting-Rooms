import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Проверяем аутентификацию
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Получаем userId из query параметров
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Получаем информацию о бизнесе пользователя
        const business = await prisma.business.findFirst({
            where: {
                userId: userId
            }
        });

        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Получаем все запланированные встречи для бизнеса
        const scheduledMeetings = await prisma.scheduledMeeting.findMany({
            where: {
                businessId: business.id
            },
            orderBy: {
                selectedDate: 'desc'
            },
            include: {
                meetingEvent: true
            }
        });

        return NextResponse.json(scheduledMeetings);
    } catch (error) {
        console.error('Error fetching scheduled meetings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // Проверяем аутентификацию
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Получаем данные из body
        const body = await request.json();
        const {
            id, businessId, businessName, businessEmail, selectedTime, selectedDate,
            formatedDate, formatedTimeStamp, duration, locationUrl,
            eventId, userName, userEmail, userNote
        } = body;

        if (!id || !businessId || !selectedTime || !selectedDate || !eventId || !userName || !userEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Создаем запланированную встречу
        const scheduledMeeting = await prisma.scheduledMeeting.create({
            data: {
                id,
                businessId,
                businessName,
                businessEmail,
                selectedTime,
                selectedDate: new Date(selectedDate),
                formatedDate,
                formatedTimeStamp,
                duration,
                locationUrl,
                eventId,
                userName,
                userEmail,
                userNote
            }
        });

        return NextResponse.json(scheduledMeeting);
    } catch (error) {
        console.error('Error creating scheduled meeting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

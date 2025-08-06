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

		// Получаем список встреч пользователя через Prisma
		const events = await prisma.meetingEvent.findMany({
			where: {
				createdById: userId
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		return NextResponse.json(events);
	} catch (error) {
		console.error('Error fetching meeting events:', error);
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
			id, eventName, duration, locationType, locationUrl,
			themeColor, description, businessId, createdBy
		} = body;

		if (!id || !eventName || !duration || !locationType || !businessId || !createdBy) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Создаем встречу через Prisma
		const event = await prisma.meetingEvent.create({
			data: {
				id,
				eventName,
				duration,
				locationType,
				locationUrl,
				description,
				themeColor: themeColor || '#4F75FE', // Default color
				business: {
					connect: {
						id: businessId
					}
				},
				createdBy: {
					connect: {
						id: createdBy
					}
				}
			}
		});

		return NextResponse.json(event);
	} catch (error) {
		console.error('Error creating meeting event:', error);

		// Добавляем более подробную информацию об ошибке
		if (error instanceof Error) {
			return NextResponse.json({
				error: 'Failed to create meeting event',
				message: error.message,
				details: 'meta' in error ? (error as any).meta : undefined
			}, { status: 500 });
		}

		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

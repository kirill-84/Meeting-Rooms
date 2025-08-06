import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Проверяем аутентификацию
		const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;

		// Удаляем встречу
		await prisma.meetingEvent.delete({
			where: {
				id: id
			}
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting meeting event:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Проверяем аутентификацию
		const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const data = await request.json();

		// Проверяем наличие обязательных полей
		if (!data.eventName || !data.duration || !data.locationType) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Обновляем встречу
		const updatedEvent = await prisma.meetingEvent.update({
			where: {
				id: id
			},
			data: {
				eventName: data.eventName,
				duration: data.duration,
				locationType: data.locationType,
				locationUrl: data.locationUrl,
				themeColor: data.themeColor,
				description: data.description
			}
		});

		return NextResponse.json(updatedEvent);
	} catch (error) {
		console.error('Error updating meeting event:', error);

		if (error instanceof Error) {
			return NextResponse.json({
				error: 'Failed to update meeting event',
				message: error.message,
				details: 'meta' in error ? (error as any).meta : undefined
			}, { status: 500 });
		}

		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

// Добавим также GET для получения конкретного события
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Проверяем аутентификацию
		const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;

		// Получаем информацию о событии
		const event = await prisma.meetingEvent.findUnique({
			where: {
				id: id
			}
		});

		if (!event) {
			return NextResponse.json({ error: 'Event not found' }, { status: 404 });
		}

		return NextResponse.json(event);
	} catch (error) {
		console.error('Error getting meeting event:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

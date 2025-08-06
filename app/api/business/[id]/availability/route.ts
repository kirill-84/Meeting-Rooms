import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

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
		const { daysAvailable, startTime, endTime } = await request.json();

		// Обновляем данные о доступности
		const updatedBusiness = await prisma.business.update({
			where: {
				id: id
			},
			data: {
				daysAvailable: daysAvailable,
				startTime: startTime,
				endTime: endTime
			}
		})

		return NextResponse.json(updatedBusiness);
	} catch (error) {
		console.error('Error updating business availability:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

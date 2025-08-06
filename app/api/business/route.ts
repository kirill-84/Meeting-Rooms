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

		// Получаем информацию о бизнесе с помощью Prisma
		const business = await prisma.business.findFirst({
			where: {
				userId: userId
			}
		});

		if (!business) {
			return NextResponse.json({ error: 'Business not found' }, { status: 404 });
		}

		return NextResponse.json(business);
	} catch (error) {
		console.error('Error fetching business info:', error);
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
		const { businessName, userId, userName, email } = body;

		if (!businessName || !userId || !userName) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Проверка на существующий бизнес с таким именем
		const existingBusiness = await prisma.business.findUnique({
			where: {
				businessName: businessName.replace(/\s+/g, "_")
			}
		});

		if (existingBusiness) {
			return NextResponse.json({
				error: 'Business name already exists',
				message: 'Please choose a different business name'
			}, { status: 400 });
		}

		// Создаем бизнес с использованием Prisma
		const business = await prisma.business.create({
			data: {
				businessName: businessName.replace(/\s+/g, "_"), // Заменяет все пробелы на "_"
				userName,
				email,
				user: {
					connect: {
						id: userId
					}
				}
			}
		});

		return NextResponse.json(business);
	} catch (error) {
		console.error('Error creating business:', error);

		if (error instanceof Error) {
			// Prisma ошибки содержат meta информацию
			if ('meta' in error && typeof error.meta === 'object') {
				console.error('Prisma error details:', error.meta);
			}

			return NextResponse.json({
				error: 'Failed to create business',
				message: error.message,
				details: 'meta' in error ? error.meta : undefined
			}, { status: 500 });
		}

		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

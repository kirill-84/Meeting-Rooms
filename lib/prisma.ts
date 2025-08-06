import { TelegramUserData } from "@telegram-auth/server";
import { PrismaClient } from "@prisma/client";

export type PrismaUserInput = {
	id: string;
	name: string;
	image?: string | null;
	email?: string;
};

export const prisma = new PrismaClient();

export async function createUserOrUpdate(data: PrismaUserInput) {
	return prisma.user.upsert({
		where: {
			id: data.id,
		},
		create: {
			id: data.id,
			name: data.name,
			image: data.image,
			...data.email && {email: data.email},
		},
		update: {
			name: data.name,
			image: data.image,
			...data.email && {email: data.email},
		},
	});
}

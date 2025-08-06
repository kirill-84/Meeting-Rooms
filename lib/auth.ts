import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { createUserOrUpdate } from "@/lib/prisma";
import { objectToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";

// Функция для проксирования Telegram‑аватарки
function getProxiedImageUrl(originalUrl: string | null | undefined): string | null {
	if (!originalUrl) return null;
	const baseUrl = (process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
	return `${baseUrl}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "telegram-login",
			name: "Telegram Login",
			credentials: {},
			async authorize(credentials, req) {
				console.log(process.env.BOT_TOKEN)
				const validator = new AuthDataValidator({ botToken: process.env.BOT_TOKEN! });
				const data = objectToAuthDataMap(req.query || {});
				const user = await validator.validate(data);

				if (user.id && user.first_name) {
					const sessionUser = {
						id:   user.id.toString(),
						email: user.id.toString(),
						name: [user.first_name, user.last_name || ""].join(" "),
						image: user.photo_url,
					};
					try {
						await createUserOrUpdate(sessionUser);
					} catch {
						console.warn("Не удалось создать или обновить пользователя.");
					}
					return sessionUser;
				}
				return null;
			},
		}),
	],

	callbacks: {
		async session({
						  session,
						  token,
					  }: {
			session: import("next-auth").Session;
			token: import("next-auth/jwt").JWT;
		}) {
			// поле `id` уже определено через глобальное расширение
			if (session.user) {
				session.user.id = token.sub!;
				if (session.user.image) {
					session.user.image = getProxiedImageUrl(session.user.image);
				}
			}
			return session;
		},
	},

	pages: {
		signIn: "/auth/signin",
		error:  "/auth/error",
	},
};

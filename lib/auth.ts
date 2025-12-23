import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { createUserOrUpdate } from "@/lib/prisma";
import { objectToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";

function normalizeToStringMap(raw: any): Record<string, string> {
  const out: Record<string,string> = {};
  for (const k of Object.keys(raw || {})) {
    const v = raw[k];
    if (Array.isArray(v)) out[k] = String(v[0] ?? "");
    else if (v === undefined || v === null) out[k] = "";
    else out[k] = String(v);
  }
  return out;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "telegram-login",
      name: "Telegram Login",
      credentials: {},
      async authorize(credentials, req) {
        const botToken = process.env.BOT_TOKEN;
        if (!botToken) {
          console.error("BOT_TOKEN is not defined");
          return null;
        }

        // Для отладки — логируем откуда приходят данные
        console.debug("authorize inputs:", {
          credentials,
          query: req?.query,
          body: req?.body,
        });

        // Источник данных: credentials (если client вызывал signIn), затем body, затем query
        const raw =
          (credentials && Object.keys(credentials).length ? credentials :
           (req?.body && Object.keys(req.body).length ? req.body :
            (req?.query && Object.keys(req.query).length ? req.query : {})));

        const normalized = normalizeToStringMap(raw);
        const data = objectToAuthDataMap(normalized);

        const validator = new AuthDataValidator({ botToken });

        try {
          const user = await validator.validate(data);

          if (user && user.id && user.first_name) {
            const sessionUser = {
              id: user.id.toString(),
              email: user.id.toString(),
              name: [user.first_name, user.last_name || ""].join(" ").trim(),
              image: user.photo_url ?? null,
            };

            try {
              await createUserOrUpdate(sessionUser);
            } catch (e) {
              console.warn("createUserOrUpdate failed:", e);
            }

            return sessionUser;
          } else {
            console.warn("Telegram validation returned no user:", user);
            return null;
          }
        } catch (err) {
          // Логируем подробности — это самая частая причина silent-fail
          console.error("Telegram auth validation error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        if (session.user.image) {
          const baseUrl = (process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
          session.user.image = `${baseUrl}/api/proxy-image?url=${encodeURIComponent(session.user.image)}`;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

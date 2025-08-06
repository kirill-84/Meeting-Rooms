import { DefaultSession } from "next-auth";
import 'next-auth/jwt';

declare module "next-auth" {
	interface Session {
		user: { 
			id: string; 
			name: string;
			email?: string;
			image?: string | null; 
		};
	}
}

// Расширение JWT
declare module 'next-auth/jwt' {
    interface JWT {
        userRole?: 'admin';
        id?: string;
    }
}

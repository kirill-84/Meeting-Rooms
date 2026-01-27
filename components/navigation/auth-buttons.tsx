"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginButton } from "@telegram-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReloadIcon, ExitIcon } from "@radix-ui/react-icons";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInButton({ botUsername }: { botUsername: string }) {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <ReloadIcon className="h-6 w-6 animate-spin" />;
	}

	if (status === "authenticated") {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div>
						<Avatar>
							<AvatarImage
								src={session.user?.image ?? "/default.svg"}
								alt="@shadcn"
							/>
							<AvatarFallback>
								{session.user?.name}
							</AvatarFallback>
						</Avatar>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => signOut()}>
						<ExitIcon className="mr-2 h-4 w-4" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<LoginButton
			botUsername={botUsername}
		    onAuthCallback={(data) => {
		      console.log("=== TELEGRAM AUTH CALLBACK ===");
		      console.log("data:", JSON.stringify(data, null, 2));
		      
		      const credentials = {
		        id: String(data.id),
		        first_name: data.first_name,
		        last_name: data.last_name ?? "",
		        username: data.username ?? "",
		        photo_url: data.photo_url ?? "",
		        auth_date: String(data.auth_date),
		        hash: data.hash,
		        callbackUrl: "/",
		      };
		      
		      console.log("calling signIn with:", credentials);
		      
		      signIn("telegram-login", credentials)
		        .then((res) => console.log("signIn result:", res))
		        .catch((err) => console.error("signIn error:", err));
		    }}
		/>
	);
}

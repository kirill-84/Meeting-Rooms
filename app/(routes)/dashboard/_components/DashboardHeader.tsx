"use client"

import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReloadIcon, ExitIcon } from "@radix-ui/react-icons";
import { useSession, signOut } from 'next-auth/react';

function DashboardHeader() {
	const { data: session, status } = useSession();

	if (status === 'loading' || !session?.user) {
		return <ReloadIcon className="p-4 px-10 h-6 w-6 animate-spin" />;
	}

	if(status === "authenticated") {
		return (
			<div className="p-4 px-10">
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger className='flex items-center float-right' asChild>
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
							<DropdownMenuSeparator/>
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator/>
							<DropdownMenuItem onClick={() => signOut()}>
								<ExitIcon className="mr-2 h-4 w-4" />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		);
	}

	return null;
}

export default DashboardHeader;

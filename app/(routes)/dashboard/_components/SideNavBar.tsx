"use client"

import { Button } from '@/components/ui/button';
import { Briefcase, Calendar, Clock, Plus, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface MenuItem {
	id: number;
	name: string;
	path: string;
	icon: React.ElementType;
}

function SideNavBar() {
	const menu: MenuItem[] = [
		{
			id: 1,
			name: 'Meeting Type',
			path: '/dashboard/meeting-type',
			icon: Briefcase
		},
		{
			id: 2,
			name: 'Scheduled Meeting',
			path: '/dashboard/scheduled-meeting',
			icon: Calendar
		},
		{
			id: 3,
			name: 'Availability',
			path: '/dashboard/availability',
			icon: Clock
		},
		{
			id: 4,
			name: 'Settings',
			path: '/dashboard/settings',
			icon: Settings
		},
	];

	const path = usePathname();
	const [activePath, setActivePath] = useState<string>(path || '');

	useEffect(() => {
		path&&setActivePath(path)
	},[path]);

	return (
		<div className='p-5 py-14'>
			<div className='flex justify-center'>
				<Image src='/logo.svg' width={138} height={30} alt='logo' className='hidden sm:block' priority={false} />
				<Image src='/logo-small.svg' width={30} height={30} alt='logo' className='block sm:hidden' priority={false} />
			</div>

			<Link href={'/create-meeting'}>
				<Button className="flex gap-2 w-full mt-7 rounded-full">
					<Plus /> <span className="hidden sm:inline">Create</span>
				</Button>
			</Link>

			<div className='mt-5 flex flex-col gap-5'>
				{menu.map((item, index) => (
					<Link href={item.path} key={index}>
						<Button
							variant="ghost"
							className={`w-full flex gap-2 justify-start hover:bg-blue-100 font-normal text-lg
                ${activePath === item.path ? 'text-primary bg-blue-100' : ''}
              `}
						>
							<item.icon /> <span className="hidden sm:inline">{item.name}</span>
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
}

export default SideNavBar;

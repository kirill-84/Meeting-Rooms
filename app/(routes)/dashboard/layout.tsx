import React from 'react';
import SideNavBar from './_components/SideNavBar';
import DashboardHeader from './_components/DashboardHeader';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({children}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className='block w-16 sm:w-64 bg-slate-50 h-screen fixed'>
				<SideNavBar />
			</div>
			<div className='ml-16 sm:ml-64'>
				<DashboardHeader />
				<Toaster />
				{children}
			</div>
		</div>
	);
}

"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MeetingType from './meeting-type/page';

function Dashboard() {
	const { data: session, status } = useSession();
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated' && session?.user?.id) {
			isBusinessRegistered();
		}
	}, [session, status]);

	const isBusinessRegistered = async () => {
		try {
			if (!session?.user?.id) return;

			const business = await fetch(`/api/business?userId=${session.user.id}`);
			const businessData = await business.json();

			if (!businessData || businessData.error) {
				setLoading(false);
				router.replace('/create-business');
			} else {
				setLoading(false);
			}
		} catch (error) {
			console.error("Error checking business registration:", error);
			setLoading(false);
		}
	};

	if (loading) {
		return <h2>Loading...</h2>;
	}

	return (
		<div>
			<MeetingType />
		</div>
	);
}

export default Dashboard;

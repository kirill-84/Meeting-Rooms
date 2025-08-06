"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

function CreateBusiness() {
	const [businessName, setBusinessName] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { data: session, status } = useSession();
	const router = useRouter();

	const onCreateBusiness = async () => {
		if (!session?.user?.id || !businessName) return;

		setIsLoading(true);
		try {
			const response = await fetch('/api/business', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					businessName: businessName,
					userId: session.user.id,
					userName: session.user.name || 'User',
					email: session.user.email
				}),
			});

			if (response.ok) {
				toast.success('New Business Created!');
				router.replace('/dashboard');
			} else {
				const data = await response.json();
				console.error('Business creation error:', data);
				toast.error(data.error || 'Failed to create business');
			}
		} catch (error) {
			console.error('Error creating business:', error);
			toast.error('An error occurred while creating the business');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='p-14 items-center flex flex-col gap-20 my-10'>
			<Image src='/logo.svg' width={200} height={200} alt="Logo" priority={false} />
			<div className='flex flex-col items-center gap-4 max-w-3xl'>
				<h2 className='text-4xl font-bold'>What should we call your business?</h2>
				<p className='text-slate-500'>You can always change this later from settings</p>
				<div className='w-full'>
					<label className='text-slate-400'>Team Name</label>
					<Input
						placeholder="Dream Team"
						className="mt-2"
						onChange={(event) => setBusinessName(event.target.value)}
					/>
				</div>
				<Button
					className="w-full"
					disabled={!businessName || status !== 'authenticated' || isLoading}
					onClick={onCreateBusiness}
				>
					{isLoading ? 'Creating...' : 'Create Business'}
				</Button>
			</div>
		</div>
	);
}

export default CreateBusiness;

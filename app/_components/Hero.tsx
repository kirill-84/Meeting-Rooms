"use client"
import Image from 'next/image'
import React from 'react'

function Hero() {
	return (
		<div className='flex-1 flex flex-col justify-center items-center my-5'>
			<div className='hidden lg:block'>
				<Image src='/profile-user-1.svg' width={100} height={100}
					   className='h-[100px] object-cover rounded-full absolute right-36' alt=''/>
				<Image src='/profile-user-2.svg' width={100} height={100}
					   className='h-[100px] object-cover rounded-full absolute top-48 left-16' alt=''/>
				<Image src='/profile-user-3.svg' width={100} height={100}
					   className='h-[100px] object-cover rounded-full absolute bottom-20 left-36' alt=''/>
				<Image src='/profile-user-4.svg' width={100} height={100}
					   className='h-[100px] object-cover rounded-full absolute right-16 bottom-32' alt=''/>
			</div>
			<div className='text-center max-w-3xl'>
				<h2 className='font-bold text-3xl md:text-6xl text-slate-700'>Probably the better way to schedule your meetings</h2>
				<h2 className='text-base md:text-lg mt-5 text-slate-500'>Scheduling automation platform for individuals, businesses taking calls and developers building scheduling platforms where users meet users.</h2>
			</div>
		</div>
	)
}

export default Hero

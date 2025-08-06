"use client"

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduledMeetingList from './_components/ScheduledMeetingList';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { ScheduledMeeting } from '@/types';
import { toast } from 'sonner';

function ScheduledMeetingPage() {
    const [meetingList, setMeetingList] = useState<ScheduledMeeting[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            getScheduledMeetings();
        }
    }, [session, status]);

    /**
     * Receives scheduled meetings for the user's business
     */
    const getScheduledMeetings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/scheduled-meetings?userId=${session?.user?.id}`);
            if (response.ok) {
                const data = await response.json();
                setMeetingList(data);
            } else {
                console.error('Failed to fetch scheduled meetings');
                toast.error('Failed to fetch scheduled meetings');
            }
        } catch (error) {
            console.error('Error fetching scheduled meetings:', error);
            toast.error('Error fetching scheduled meetings');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Filters the list of meetings
     * @param type - 'upcoming' или 'expired'
     */
    const filterMeetingList = (type: 'upcoming' | 'expired'): ScheduledMeeting[] => {
        const now = format(new Date(), 't');
        
        if (type === 'upcoming') {
            return meetingList.filter(item => item.formatedTimeStamp >= now);
        } else {
            return meetingList.filter(item => item.formatedTimeStamp < now);
        }
    };

    if (loading && status === 'loading') {
        return <div className="p-10">Загрузка...</div>;
    }

    return (
        <div className='p-10'>
            <h2 className='font-bold text-2xl'>Scheduled meetings</h2>
            <hr className='my-5' />
            <Tabs defaultValue="upcoming" className="w-full md:w-[400px]">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <ScheduledMeetingList meetingList={filterMeetingList('upcoming')} />
                </TabsContent>
                <TabsContent value="expired">
                    <ScheduledMeetingList meetingList={filterMeetingList('expired')} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ScheduledMeetingPage;

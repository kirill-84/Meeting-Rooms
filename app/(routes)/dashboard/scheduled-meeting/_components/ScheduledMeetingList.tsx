import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarCheck, Clock, Timer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScheduledMeeting } from '@/types';

interface ScheduledMeetingListProps {
    meetingList: ScheduledMeeting[];
}

function ScheduledMeetingList({ meetingList }: ScheduledMeetingListProps) {
    return (
        <div>
            {meetingList && meetingList.length > 0 ? (
                meetingList.map((meeting, index) => (
                    <Accordion type="single" collapsible key={index}>
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>{meeting.formatedDate}</AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <div className='mt-5 flex flex-col gap-4'>
                                        <h2 className='flex gap-2'><Clock />{meeting.duration} Min </h2>
                                        <h2 className='flex gap-2'><CalendarCheck />{meeting.formatedDate} </h2>
                                        <h2 className='flex gap-2'><Timer />{meeting.selectedTime} </h2>

                                        {meeting.locationUrl && (
                                            <Link
                                                href={meeting.locationUrl}
                                                className='text-primary'
                                            >
                                                {meeting.locationUrl}
                                            </Link>
                                        )}
                                    </div>
                                    {meeting.locationUrl && (
                                        <Link href={meeting.locationUrl}>
                                            <Button className="mt-5">Join</Button>
                                        </Link>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))
            ) : (
                <p className="text-muted-foreground py-4">No scheduled meetings.</p>
            )}
        </div>
    );
}

export default ScheduledMeetingList;

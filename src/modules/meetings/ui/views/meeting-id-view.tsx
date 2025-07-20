"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const [openEditMeeting, setOpenEditMeeting] = useState(false);

    const router = useRouter()
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [RemoveConirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will remove the meeting."
    )
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        }
    ));

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                // TODO: Invalidate free tier usage
                router.push("/meetings");
            },
        })
    )

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        await removeMeeting.mutateAsync({
            id: data.id,
        });
    };

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCompleted = data.status === "completed";
    const isCancelled = data.status === "cancelled";
    const isProcessing = data.status === "processing";

    return (
        <>
            <RemoveConirmation />
            <UpdateMeetingDialog 
                open={openEditMeeting}
                onOpenChange={setOpenEditMeeting}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                    meetingId={data.id}
                    meetingName={data.name}
                    onEdit={() => setOpenEditMeeting(true)}
                    onRemove={handleRemoveMeeting}
                />
                {/* {JSON.stringify(data, null, 2)} */}
                {isCancelled && <CancelledState /> }
                {isCompleted && <div>Completed</div> }
                {isUpcoming && (
                    <UpcomingState 
                        meetingId={data.id}
                        onCancelMeeting={handleRemoveMeeting}
                        isCancelling={removeMeeting.isPending}
                    />
                )}
                {isActive && <ActiveState meetingId={meetingId} /> }
                {isProcessing && <ProcessingState />}
            </div>
        </>
    )
}

export const MeetingsIdViewLoading = () => {
    return (
        <LoadingState 
            title="Loading Meeting" 
            description="This may take a few seconds." 
        />
    )
}

export const MeetingsIdViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meeting"
            description="Please try again later."
        />
    )
}
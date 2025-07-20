import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
    open, 
    onOpenChange,
    initialValues,
}: NewMeetingDialogProps) => {

    return (
        <ResponsiveDialog
            title="Update Meeting"
            description="Edit the meeting details"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm 
                onSucces={() => onOpenChange(false)}
                onCancel={( ) => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}
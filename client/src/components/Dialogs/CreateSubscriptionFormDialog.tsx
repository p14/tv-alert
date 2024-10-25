import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useRequest } from '../../helpers/request.helpers';
import { MediaContent } from '../../typings/media.types';
import { useSnackbarContext } from '../../context/snackbar.context';
import { dialogContentStyles, dialogTitleStyles } from '../../styles/dialog.styles';
import { UserSession } from '../../typings/utility.types';

interface CreateSubscriptionFormDialogProps {
    mediaContent?: MediaContent
    open: boolean
    onClose: () => void
    onCreateSubscription: () => void
    userSession: UserSession
}

const CreateSubscriptionFormDialog = ({
    mediaContent,
    userSession,
    open,
    onClose,
    onCreateSubscription,
}: CreateSubscriptionFormDialogProps) => {
    const { makePublicRequest, parseErrorMessage } = useRequest();

    const { setErrorAlert, setSuccessAlert } = useSnackbarContext();

    const [loading, setLoading] = useState<boolean>(false);

    if (!mediaContent) {
        return null;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { id: mediaId, name: mediaTitle } = mediaContent;

        try {
            setLoading(true);
            const baseUrl = `${import.meta.env.VITE_SERVER_URL}/subscriptions`;
            await makePublicRequest({ url: baseUrl, method: 'POST', data: { mediaId, ...userSession } });

            setSuccessAlert(`You are now subscribed to ${mediaTitle}.`);
            onCreateSubscription();
        } catch (e: any) {
            const message = parseErrorMessage(e);
            setErrorAlert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            keepMounted
            PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
            <DialogTitle sx={dialogTitleStyles}>
                Confirm Subscription to {mediaContent.name}
            </DialogTitle>
            <DialogContent sx={dialogContentStyles}>
                <Typography>
                    Are you sure you want to subscribe to updates for {mediaContent.name}?
                    You’ll receive notifications about season and episode premiers.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} type='submit'>
                    Subscribe
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateSubscriptionFormDialog;

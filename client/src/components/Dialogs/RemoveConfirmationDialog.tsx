import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useRequest } from '../../helpers/request.helpers';
import { useSnackbarContext } from '../../context/snackbar.context';
import { useSession } from '../../helpers/session.helpers';
import { dialogContentStyles, dialogTitleStyles } from '../../styles/dialog.styles';
import { MediaContent } from '../../typings/media.types';

interface RemoveConfirmationDialogProps {
    loading: boolean
    subscriptionMedia?: MediaContent
    open: boolean
    onClose: () => void
    onDeleteSubscription: () => void
}

const RemoveConfirmationDialog = ({
    loading,
    subscriptionMedia,
    open,
    onClose,
    onDeleteSubscription,
}: RemoveConfirmationDialogProps) => {
    const navigate = useNavigate();
    const { clearUserSession, getUserSession } = useSession();
    const { makePublicRequest, parseErrorMessage } = useRequest();

    const { setErrorAlert, setSuccessAlert } = useSnackbarContext();

    if (!subscriptionMedia) {
        return null;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userSession = getUserSession();

        if (!userSession) {
            navigate(`/error?message=${encodeURIComponent('User session not found.')}`);
            return;
        } else if (Date.now() > Number(userSession.expires)) {
            clearUserSession();
            navigate(`/error?message=${encodeURIComponent('User session expired.')}`);
            return;
        }

        try {
            const { email, expires, signature } = userSession;
            const baseUrl = `${import.meta.env.VITE_SERVER_URL}/subscriptions/${subscriptionMedia.id}`;
            await makePublicRequest({ url: baseUrl, method: 'DELETE', data: { email, expires, signature } });

            setSuccessAlert(`You have successfully unsubscribed from ${subscriptionMedia.name}.`);
            onDeleteSubscription();
        } catch (e: any) {
            const message = parseErrorMessage(e);
            setErrorAlert(message);
        } finally {
            onClose();
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
                Do you want to unsubscribe from {subscriptionMedia.name}?
            </DialogTitle>
            <DialogContent sx={dialogContentStyles}>
                <Typography>
                    By unsubscribing, you will no longer receive notifications about new seasons or episodes of {subscriptionMedia.name}.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} type='submit'>
                    Unsubscribe
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveConfirmationDialog;

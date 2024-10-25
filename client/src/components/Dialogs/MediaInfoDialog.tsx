import { forwardRef } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { MediaContent } from '../../typings/media.types';
import { dialogMediaInfoStatusStyles, dialogTitleStyles } from '../../styles/dialog.styles';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction='up' ref={ref} {...props} />;
});

interface MediaInfoDialogProps {
    open: boolean
    onClose: () => void
    mediaContent?: MediaContent
    inSubscription: boolean
    openPrimaryActionDialog: (mediaContent: MediaContent) => void
}

const MediaInfoDialog = ({
    open,
    onClose,
    mediaContent,
    inSubscription,
    openPrimaryActionDialog,
}: MediaInfoDialogProps) => {
    if (!mediaContent) {
        return null;
    }

    const mediaContentFirstAiredDate = mediaContent.firstAiredDate && new Date(mediaContent.firstAiredDate)
        .toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            keepMounted>
            <DialogTitle sx={dialogTitleStyles}>
                {mediaContent.name}
            </DialogTitle>
            <DialogContent>
                <Box sx={dialogMediaInfoStatusStyles}>
                    <DialogContentText color='InfoText'>
                        {`Status: ${mediaContent.status}`}
                    </DialogContentText>
                    <DialogContentText color='InfoText'>
                        {`First aired: ${mediaContentFirstAiredDate}`}
                    </DialogContentText>
                </Box>
                <DialogContentText>
                    {mediaContent.overview}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={() => { openPrimaryActionDialog(mediaContent); }}>
                    {inSubscription ? 'unsubscribe' : 'subscribe'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MediaInfoDialog;

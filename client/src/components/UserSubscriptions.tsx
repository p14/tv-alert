import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import MediaCard from './MediaCard';
import { userSubscriptionContainerStyles, userSubscriptionTitleStyles } from '../styles/subscription.styles';
import RemoveConfirmationDialog from './Dialogs/RemoveConfirmationDialog';
import { UserSession } from '../typings/utility.types';
import { MediaContent } from '../typings/media.types';
import MediaInfoDialog from './Dialogs/MediaInfoDialog';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

interface ManageSubscriptionsProps {
    loading: boolean
    refetchSubscriptionIds: () => void
    subscriptionIds: string[]
    userSession: UserSession
    subscriptionMediaList: MediaContent[]
}

const ManageSubscriptions: React.FC<ManageSubscriptionsProps> = ({
    loading,
    refetchSubscriptionIds,
    subscriptionMediaList,
}) => {
    const navigate = useNavigate();

    const [selectedSubscriptionMedia, setSelectedSubscriptionMedia] = useState<MediaContent | undefined>();
    const [openDialog, setOpenDialog] = useState<'info' | 'unsubscribe' | undefined>();

    const handleOpenInfoDialog = (mediaContent: MediaContent) => {
        setSelectedSubscriptionMedia(mediaContent);
        setOpenDialog('info');
    };

    const handleOpenUnsubscribeDialog = (mediaContent: MediaContent) => {
        setSelectedSubscriptionMedia(mediaContent);
        setOpenDialog('unsubscribe');
    };

    const handleCloseDialog = () => {
        setSelectedSubscriptionMedia(undefined);
        setOpenDialog(undefined);
    };

    const onDeleteSubscription = () => {
        refetchSubscriptionIds();
        handleCloseDialog();
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 5 }}>
                <Typography component='h1' variant='h4' sx={userSubscriptionTitleStyles}>
                    Manage Your Subscriptions
                </Typography>
                <Button
                    variant='contained'
                    size='small'
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ alignSelf: 'center', my: 2 }}>
                    Back
                </Button>
                <Box sx={userSubscriptionContainerStyles}>
                    {subscriptionMediaList.map((mediaContent) => (
                        <MediaCard
                            key={mediaContent.id}
                            mediaContent={mediaContent}
                            openInfoDialog={() => { handleOpenInfoDialog(mediaContent); }}
                            inSubscription
                            openPrimaryActionDialog={() => { handleOpenUnsubscribeDialog(mediaContent); }} />
                    ))}
                </Box>
                <MediaInfoDialog
                    open={openDialog === 'info'}
                    onClose={handleCloseDialog}
                    mediaContent={selectedSubscriptionMedia}
                    inSubscription
                    openPrimaryActionDialog={handleOpenUnsubscribeDialog} />
                <RemoveConfirmationDialog
                    loading={loading}
                    open={openDialog === 'unsubscribe'}
                    onClose={handleCloseDialog}
                    subscriptionMedia={selectedSubscriptionMedia}
                    onDeleteSubscription={onDeleteSubscription} />
            </Box>
        </>
    )
}

export default ManageSubscriptions;

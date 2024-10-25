import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { MediaContent } from '../../typings/media.types';
import MediaCard from '../MediaCard';
import MediaInfoDialog from '../Dialogs/MediaInfoDialog';
import CreateSubscriptionFormDialog from '../Dialogs/CreateSubscriptionFormDialog';
import SearchToolbar from './SearchToolbar';
import { searchResultsContainerStyles } from '../../styles/search.styles';
import { UserSession } from '../../typings/utility.types';
import RemoveConfirmationDialog from '../Dialogs/RemoveConfirmationDialog';
import { userSubscriptionTitleStyles } from '../../styles/subscription.styles';
import { useNavigate } from 'react-router-dom';
import { VideoSettings } from '@mui/icons-material';

interface SearchMediaProps {
    loading: boolean
    refetchSubscriptionIds: () => void
    subscriptionIds: string[]
    userSession: UserSession
    subscriptionMediaList: MediaContent[]
}

const SearchMedia: React.FC<SearchMediaProps> = ({
    loading,
    refetchSubscriptionIds,
    subscriptionIds,
    userSession,
}) => {
    const navigate = useNavigate();
    const [mediaContentList, setMediaContentList] = useState<MediaContent[]>([]);
    const [selectedMediaContent, setSelectedMediaContent] = useState<MediaContent | undefined>();
    const [openDialog, setOpenDialog] = useState<'info' | 'subscribe' | 'unsubscribe' | undefined>();

    const handleOpenInfoDialog = (mediaContent: MediaContent) => {
        setSelectedMediaContent(mediaContent);
        setOpenDialog('info');
    };

    const handleOpenSubscriptionManagementDialog = (mediaContent: MediaContent) => {
        setSelectedMediaContent(mediaContent);
        if (subscriptionIds.includes(mediaContent.id)) {
            setOpenDialog('unsubscribe');
        } else {
            setOpenDialog('subscribe');
        }
    };

    const onSubscriptionAction = () => {
        refetchSubscriptionIds();
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setSelectedMediaContent(undefined);
        setOpenDialog(undefined);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', py: 5 }}>
            <Typography component='h1' variant='h4' sx={userSubscriptionTitleStyles}>
                Search for Shows
            </Typography>
            <Button
                variant='contained'
                size='small'
                startIcon={<VideoSettings />}
                onClick={() => navigate('/manage-subscriptions')}
                sx={{ alignSelf: 'center', my: 2 }}>
                Manage Subscriptions
            </Button>
            <SearchToolbar setItems={setMediaContentList} />
            <Box sx={searchResultsContainerStyles}>
                {mediaContentList.map((mediaContent) => (
                    <MediaCard
                        key={mediaContent.id}
                        mediaContent={mediaContent}
                        openInfoDialog={() => { handleOpenInfoDialog(mediaContent); }}
                        inSubscription={subscriptionIds.includes(mediaContent.id)}
                        openPrimaryActionDialog={() => { handleOpenSubscriptionManagementDialog(mediaContent); }} />
                ))}
            </Box>
            <MediaInfoDialog
                open={openDialog === 'info'}
                onClose={handleCloseDialog}
                mediaContent={selectedMediaContent}
                inSubscription={subscriptionIds.includes(String(selectedMediaContent?.id))}
                openPrimaryActionDialog={handleOpenSubscriptionManagementDialog} />
            <CreateSubscriptionFormDialog
                open={openDialog === 'subscribe'}
                onClose={handleCloseDialog}
                mediaContent={selectedMediaContent}
                userSession={userSession}
                onCreateSubscription={onSubscriptionAction} />
            <RemoveConfirmationDialog
                loading={loading}
                open={openDialog === 'unsubscribe'}
                onClose={handleCloseDialog}
                subscriptionMedia={selectedMediaContent}
                onDeleteSubscription={onSubscriptionAction} />
        </Box>
    )
}

export default SearchMedia;

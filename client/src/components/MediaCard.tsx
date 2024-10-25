import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { mediaCardActionsStyles, mediaCardContainerStyles, mediaCardContentAndActionsContainerStyles, mediaCardContentStyles, mediaCardImageStyles, mediaCardSubtitleStyles, mediaCardTextStyles } from '../styles/mediaCard.styles';
import { MediaContent } from '../typings/media.types';

interface MediaCardProps {
    mediaContent: MediaContent
    openInfoDialog: () => void
    inSubscription: boolean
    openPrimaryActionDialog: () => void
}

const MediaCard = ({
    mediaContent,
    openInfoDialog,
    inSubscription,
    openPrimaryActionDialog,
}: MediaCardProps) => {
    return (
        <Card key={mediaContent.id} sx={mediaCardContainerStyles}>
            <CardMedia
                component='img'
                alt={mediaContent.name}
                title={mediaContent.name}
                image={mediaContent.thumbnail}
                sx={mediaCardImageStyles} />
            <Box sx={mediaCardContentAndActionsContainerStyles}>
                <CardContent sx={mediaCardContentStyles}>
                    <Typography
                        variant='subtitle1'
                        component='h3'
                        fontWeight={600}
                        lineHeight='inherit'
                        sx={mediaCardSubtitleStyles}>
                        {mediaContent.name}
                    </Typography>
                    <Typography
                        variant='subtitle2'
                        component='h4'
                        fontWeight={600}
                        lineHeight='inherit'
                        gutterBottom
                        sx={mediaCardSubtitleStyles}>
                        {mediaContent.year}
                    </Typography>
                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={mediaCardTextStyles}>
                        {mediaContent.overview}
                    </Typography>
                </CardContent>
                <CardActions sx={mediaCardActionsStyles}>
                    <Button size='small' onClick={openInfoDialog}>
                        Learn More
                    </Button>
                    <Button size='small' onClick={openPrimaryActionDialog}>
                        {inSubscription ? 'unsubscribe' : 'subscribe'}
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );
};

export default MediaCard;

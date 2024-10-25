import { SxProps } from '@mui/material';

export const mediaCardContainerStyles: SxProps = {
    display: 'flex',
    flexDirection: 'row',
    m: 1,
    maxWidth: 450,
    width: '100%',
};

export const mediaCardImageStyles: SxProps = {
    height: 200,
    objectFit: 'contain',
    width: 'auto',
};

export const mediaCardContentAndActionsContainerStyles: SxProps = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
};

export const mediaCardContentStyles: SxProps = {
    flexGrow: 1,
    px: 1.5,
    py: 0.5,
};

export const mediaCardSubtitleStyles: SxProps = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
};

export const mediaCardTextStyles: SxProps = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
};

export const mediaCardActionsStyles: SxProps = {
    display: 'flex',
    justifyContent: 'flex-end',
    pt: 0,
};

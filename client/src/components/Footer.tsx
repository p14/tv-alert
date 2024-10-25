import { footerContainerStyles } from '../styles/footer.styles';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
    const p14link = (
        <Typography component='a' href='https://p14.dev' target='_blank' variant='caption'>
            p14.dev
        </Typography>
    );

    return (
        <Box sx={footerContainerStyles}>
            <Typography variant='caption'>
                created by {p14link}
            </Typography>
        </Box>
    )
}

export default Footer;

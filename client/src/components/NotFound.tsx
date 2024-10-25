import { Box, Button, Typography } from '@mui/material';
import { redirectContainerStyles, redirectWrapperStyles } from '../styles/redirect.styles';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <Box sx={redirectContainerStyles}>
            <Box sx={redirectWrapperStyles}>
                <Typography component='h1' variant='h5'>
                    404 - Page Not Found
                </Typography>
                <Typography variant='body2'>
                    Sorry, but the page you are looking for does not exist.
                </Typography>
                <Button variant='contained' onClick={handleReturnHome}>
                    Back to home
                </Button>
            </Box>
        </Box>
    )
}

export default NotFound;

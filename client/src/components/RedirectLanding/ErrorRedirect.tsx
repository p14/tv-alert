import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { redirectContainerStyles, redirectWrapperStyles } from '../../styles/redirect.styles';

const ErrorRedirect: React.FC = () => {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <Box sx={redirectContainerStyles}>
            <Box sx={redirectWrapperStyles}>
                <Typography component='h1' variant='h5'>
                    Oops! Something Went Wrong...
                </Typography>
                {message &&
                    <Typography>
                        {message}
                    </Typography>
                }
                <Button variant='contained' color='primary' onClick={handleReturnHome}>
                    Return Home
                </Button>
            </Box>
        </Box>
    );
}

export default ErrorRedirect;

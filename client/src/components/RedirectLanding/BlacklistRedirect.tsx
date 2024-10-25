import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { redirectContainerStyles, redirectWrapperStyles } from '../../styles/redirect.styles';
import { useSession } from '../../helpers/session.helpers';

const BlacklistRedirect: React.FC = () => {
    const navigate = useNavigate();
    const { clearUserSession } = useSession();

    clearUserSession();

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <Box sx={redirectContainerStyles}>
            <Box sx={redirectWrapperStyles}>
                <Typography component='h1' variant='h5'>
                    Email Blacklisted
                </Typography>
                <Typography>
                    Your email address has been blacklisted and you will no longer receive any more emails.
                </Typography>
                <Typography>
                    If you believe this action was taken in error, please contact our support team.
                </Typography>
                <Button variant='contained' href='/contact-support'>
                    Contact Support
                </Button>
                <Button variant='text' onClick={handleReturnHome}>
                    Return Home
                </Button>
            </Box>
        </Box>
    );
}

export default BlacklistRedirect;

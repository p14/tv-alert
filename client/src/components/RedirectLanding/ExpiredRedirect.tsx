import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../helpers/request.helpers';
import { useSnackbarContext } from '../../context/snackbar.context';
import { redirectContainerStyles, redirectWrapperStyles } from '../../styles/redirect.styles';
import { useState } from 'react';

const ExpiredRedirect: React.FC = () => {
    const navigate = useNavigate();
    const { makePublicRequest, parseErrorMessage } = useRequest();

    const { setErrorAlert, setSuccessAlert } = useSnackbarContext();

    const [loading, setLoading] = useState<boolean>(false);

    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');

    if (!email) {
        navigate(`/error?message=${encodeURIComponent('Expired link.')}`);
        return;
    }

    const handleResendEmail = async () => {
        try {
            setLoading(true);
            const baseUrl = `${import.meta.env.VITE_SERVER_URL}/auth/send-verification-link`;
            await makePublicRequest({ url: baseUrl, method: 'POST', data: { email } });

            setSuccessAlert(`A verification link was sent to ${email}`);
        } catch (e: any) {
            const message = parseErrorMessage(e);
            setErrorAlert(message);
        } finally {
            setLoading(false);

        }
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <Box sx={redirectContainerStyles}>
            <Box sx={redirectWrapperStyles}>
                <Typography component='h1' variant='h5'>
                    This Link Has Expired!
                </Typography>
                <Typography>
                    The verification link has expired.
                    Don’t worry though, you can easily request a new one.
                </Typography>
                <Button disabled={loading} variant='contained' color='primary' onClick={handleResendEmail}>
                    Resend Verification Link
                </Button>
                <Button variant='text' color='primary' onClick={handleReturnHome}>
                    Return Home
                </Button>
            </Box>
        </Box>
    );
}

export default ExpiredRedirect;

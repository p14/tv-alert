import { useEffect, useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useRequest } from '../helpers/request.helpers';
import { useSnackbarContext } from '../context/snackbar.context';
import { useSession } from '../helpers/session.helpers';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { makePublicRequest, parseErrorMessage } = useRequest();
    const { getUserSession } = useSession();
    const userSession = getUserSession();

    const { setErrorAlert, setSuccessAlert } = useSnackbarContext();

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get('email'));

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

    useEffect(() => {
        if (userSession) {
            if (Date.now() < Number(userSession.expires)) {
                navigate('/dashboard');
            }
        }
    }, [userSession]);

    return (
        <Container maxWidth='sm' sx={{ py: 5 }}>
            <Typography component='h1' variant='h4'>
                Welcome to TV Alert
            </Typography>
            <Typography paragraph variant='subtitle1' sx={{ fontStyle: 'italic' }}>
                Your Alert System for New TV Episodes
            </Typography>
            <Typography paragraph variant='body1'>
                Just enter your email address to begin.
                No need to create an account or remember a password.
            </Typography>
            <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                <TextField
                    fullWidth
                    required
                    id='email'
                    type='email'
                    name='email'
                    label='Email Address'
                    size='small'
                    disabled={loading} />
                <Button
                    fullWidth
                    color='primary'
                    type='submit'
                    variant='contained'
                    size='small'
                    disabled={loading}>
                    Send Verification Link
                </Button>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography variant='h5'>
                    How It Works
                </Typography>
                <Typography paragraph variant='body1'>
                    Enter your email address and we'll send you a link to start a session.
                </Typography>
                <Typography paragraph variant='body1'>
                    Search through thousands of shows and select which ones you want to subscribe to.
                    You'll receive timely notifications about your favorite shows and never miss a premiere.
                </Typography>
            </Box>
        </Container>
    );
}

export default LoginForm;

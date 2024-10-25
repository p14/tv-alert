import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useSession } from '../../helpers/session.helpers';
import { linearProgressionStyles } from '../../styles/global.styles';

const SuccessRedirect: React.FC = () => {
    const navigate = useNavigate();

    const { clearUserSession, getUserSession, getUserSessionFromParams, setUserSession } = useSession();
    const userSession = getUserSessionFromParams() ?? getUserSession();

    useEffect(() => {
        if (!userSession) {
            navigate(`/error?message=${encodeURIComponent('User info not found.')}`);
        } else if (Date.now() > Number(userSession.expires)) {
            clearUserSession();
            navigate(`/error?message=${encodeURIComponent('User session expired.')}`);
        } else {
            setUserSession(userSession);
            navigate('/dashboard');
        }
    }, [userSession]);

    return (
        <Box>
            <LinearProgress sx={linearProgressionStyles} />
            <Typography sx={{ py: 2, textAlign: 'center' }}>
                Starting your session, please wait...
            </Typography>
        </Box>
    );
}

export default SuccessRedirect;

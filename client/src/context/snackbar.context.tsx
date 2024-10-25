import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useState } from 'react';

export interface SnackbarData {
    message: string
    type: 'success' | 'error'
    open: boolean
}

export const SnackbarContext = createContext({
    setSuccessAlert: (_message: string) => { }, // eslint-disable-line @typescript-eslint/no-unused-vars
    setErrorAlert: (_message: string) => { }, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export const useSnackbarContext = () => useContext(SnackbarContext); // eslint-disable-line react-refresh/only-export-components

export function SnackbarProvider({ children }: { children: any }) {
    const defaultSnackbarState: SnackbarData = {
        message: '',
        type: 'success',
        open: false,
    };

    const [snackbar, setSnackbar] = useState<SnackbarData>(defaultSnackbarState);

    const handleResetSnackbarState = () => {
        setSnackbar(defaultSnackbarState);
    };

    const setSuccessAlert = (message: string) => {
        setSnackbar({
            message,
            type: 'success',
            open: true,
        })
    };

    const setErrorAlert = (message: string) => {
        setSnackbar({
            message,
            type: 'error',
            open: true,
        })
    };

    return (
        <SnackbarContext.Provider value={{ setSuccessAlert, setErrorAlert }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={10000} // 10 seconds
                onClose={handleResetSnackbarState}
                style={{ display: 'flex', justifyContent: 'center', left: 0, right: 0 }}>
                <Alert onClose={handleResetSnackbarState} severity={snackbar.type}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

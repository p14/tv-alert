import { UserSession } from '../typings/utility.types';

export const useSession = () => {
    const getUserSession = (): UserSession | null => {
        const email = localStorage.getItem('email');
        const expires = localStorage.getItem('expires');
        const signature = localStorage.getItem('signature');

        if (!email || !expires || !signature) {
            return null;
        }

        return { email, expires, signature };
    }

    const getUserSessionFromParams = (): UserSession | null => {
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        const expires = params.get('expires');
        const signature = params.get('signature');

        if (!email || !expires || !signature) {
            return null;
        }

        return { email, expires, signature };
    };

    const clearUserSession = (): void => {
        localStorage.removeItem('email');
        localStorage.removeItem('expires');
        localStorage.removeItem('signature');
    };

    const setUserSession = ({
        email,
        expires,
        signature,
    }: UserSession): void => {
        localStorage.setItem('email', email);
        localStorage.setItem('expires', expires);
        localStorage.setItem('signature', signature);
    };

    return {
        clearUserSession,
        getUserSession,
        getUserSessionFromParams,
        setUserSession,
    };
};

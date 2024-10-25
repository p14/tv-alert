import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '../helpers/session.helpers';

export const SubscriptionContext = createContext({
    addSubscriptionId: (_id: string) => { }, // eslint-disable-line @typescript-eslint/no-unused-vars
    removeSubscriptionId: (_id: string) => { }, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export const useSubscriptionContext = () => useContext(SubscriptionContext); // eslint-disable-line react-refresh/only-export-components

export function SubscriptionProvider({ children }: { children: any }) {
    const { getUserSession } = useSession();
    const userSession = getUserSession();

    const [subscriptionIds, setSubscriptionIds] = useState<string[]>([]);

    const addSubscriptionId = (id: string) => {
        if (!subscriptionIds.includes(id)) {
            setSubscriptionIds((previous) => [...previous, id]);
        }
    };

    const removeSubscriptionId = (id: string) => {
        setSubscriptionIds((previous) => previous.filter((subscriptionId) => subscriptionId !== id));
    };

    useEffect(() => {
        if (userSession && Date.now() < Number(userSession.expires)) {
            
        }
    }, [userSession]);

    return (
        <SubscriptionContext.Provider value={{ addSubscriptionId, removeSubscriptionId }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

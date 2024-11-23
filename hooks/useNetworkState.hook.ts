import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const useNetworkState = () => {
    const [isOnline, setIsOnline] = useState(true); // Default to true

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(state.isConnected ?? false);
        });

        return () => {
            unsubscribe(); // Unsubscribe from the event when the component unmounts
        };
    }, []);

    return isOnline;
};

export default useNetworkState;

// NetInfoContext.js
import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetInfoContext = createContext();

export const NetInfoProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(null);

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // Cleanup the subscription on unmount
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <NetInfoContext.Provider value={{ isConnected }}>
            {children}
        </NetInfoContext.Provider>
    );
};

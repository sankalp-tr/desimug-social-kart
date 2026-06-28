import React, { createContext, useContext, useState } from "react";

type HeaderContextType = {
    user: string;
    theme: string;
    toggleTheme: () => void;
    switchUser: () => void;
};

const HeaderContext = createContext<HeaderContextType>({
    user: '',
    theme: '',
    toggleTheme: () => {},
    switchUser: () => {}
});

export function HeaderContextProvider({children}: {children: React.ReactNode}) {
    const loggedInUser = "Rohan";

    const [user, setUser] = useState('Aman'); // placeholder for the previous session's user; Market.tsx switches this to `loggedInUser` on load via switchUser()
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'Desi' : 'light'));
    }

    const switchUser = () => {
        setUser(loggedInUser);
    }

    return (
        <HeaderContext.Provider value={{ user, theme, toggleTheme, switchUser }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeaderContext() {
    const headerContext = useContext(HeaderContext);
    if (!headerContext) {
        throw new Error("useHeaderContext must be used within a HeaderContextProvider");
    }
    return headerContext;
}
import React, { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => localStorage.getItem('rentify-theme') === 'dark');

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('rentify-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
            localStorage.setItem('rentify-theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(d => !d);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Convenience hook
export const useTheme = () => useContext(ThemeContext);

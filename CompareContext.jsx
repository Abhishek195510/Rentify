import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);

    const toggleCompare = (room) => {
        const isSelected = compareList.some(item => item._id === room._id);
        if (isSelected) {
            setCompareList(prev => prev.filter(item => item._id !== room._id));
        } else {
            if (compareList.length >= 3) {
                toast.warning("You can only compare up to 3 rooms at once!");
                return;
            }
            setCompareList(prev => [...prev, room]);
            toast.success("Added to comparison!");
        }
    };

    const clearCompare = () => setCompareList([]);

    return (
        <CompareContext.Provider value={{ compareList, toggleCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

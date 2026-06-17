import { useState } from 'react';

export const useReports = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return { activeTab, handleTabChange };
};

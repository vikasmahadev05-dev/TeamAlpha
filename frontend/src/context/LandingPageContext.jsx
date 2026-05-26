import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const LandingPageContext = createContext();

export const LandingPageProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { token, user } = useAuth();
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/landing-page`);
            setConfig(res.data);
        } catch (error) {
            console.error('Error fetching landing page config:', error);
            toast.error('Failed to load page content.');
        } finally {
            setLoading(false);
        }
    };

    const saveConfig = async (newConfig) => {
        if (!token || user?.role !== 'admin') {
            toast.error('Unauthorized');
            return;
        }

        try {
            const res = await axios.put(`${API_URL}/api/landing-page`, newConfig, {
                headers: { 'x-auth-token': token }
            });
            setConfig(res.data);
            toast.success('Landing page updated successfully!');
            setIsEditMode(false);
        } catch (error) {
            console.error('Error saving config:', error);
            toast.error('Failed to save changes.');
        }
    };

    const updateSection = (section, data) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...data
            }
        }));
    };

    return (
        <LandingPageContext.Provider value={{ config, loading, isEditMode, setIsEditMode, saveConfig, updateSection, setConfig }}>
            {children}
        </LandingPageContext.Provider>
    );
};

export const useLandingPage = () => useContext(LandingPageContext);

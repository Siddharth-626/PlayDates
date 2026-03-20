import React, { createContext, useContext, useEffect, useState } from 'react';
import { FetchPlayerProfiles} from '../utils/PlayerProfile/FetchPlayerProfiles';
import { useAuth } from './authContext';
import { PlayerProfile } from '@/utils/TYPE';

// Define the context type
type ProfileContextType = {
    selectedProfile: PlayerProfile | null;
    setSelectedProfile: (profile: PlayerProfile | null) => void;
    profiles: PlayerProfile[];
    refreshProfile: (newId?: string) => Promise<void>;
};

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
    const [profiles, setProfiles] = useState<PlayerProfile[]>([]);

    const refreshProfile = async (newId?: string) => {
        if (!user) return;

        try {
            const data = await FetchPlayerProfiles(user.uid);
            setProfiles(data);

            const defaultProfile = newId
                ? data.find((p) => p.id === newId)
                : data.length > 0
                    ? data[0]
                    : null;

            setSelectedProfile(defaultProfile || null);
        } catch (error) {
            // silently fail
        }
    };

    useEffect(() => {
        if (user?.uid) {
            refreshProfile();
        }
    }, [user?.uid]);

    return (
        <ProfileContext.Provider value={{ selectedProfile, setSelectedProfile, profiles, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};


export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

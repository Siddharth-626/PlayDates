import { Timestamp } from "firebase/firestore";

export type reviewType = {
    name: string,
    comment: string,
    rating: number;
}
export type Playmate = {
    userUid: string;
    profileId: string;
};
export type PlayerProfile = {
    id: string;
    userUid: string;
    name: string;
    age: string;
    gender: string;
    skill: string;
    preferences: string[];
    locations: LocationStorageType[];
    playmates: Playmate[];
    photoUrl: string;
    completed: boolean;
};

export type NotificationsType = {
    id: string,
    type: string,
    fromUserUid: string;
    fromProfileId: string;
    message: string,
    isRead: boolean,
    status: string,
}

export type MatchPreposalType = {
    id: string | undefined;
    type: string;
    matchId: string;
    status: string;
    isRead: boolean;
}
export type AvailabilityType = {
    id: string;
    date: Date | Timestamp;
    time: string;
    duration: string;
    locations: LocationStorageType[];
    preference: string[];
}

export type courtType = {
    id: string,
    amenities: string[];
    createdAt: string;
    createdBy: string;
    description: string;
    images: string[];
    isApproved: boolean;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    title: string;
    reviews: reviewType[];
}

export type LocationStorageType = {
    name: string;
    courtId: string;
}
export type Player = {
    profileId: string;
    userUid: string;
    status: string;
    name: string;
    team: string;
};
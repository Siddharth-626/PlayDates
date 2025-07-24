import { Timestamp } from "firebase/firestore";


type Playmate = {
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

export type NotificationsType =
    | MatchPreposalNotificationType
    | BaseNotification

type BaseNotification = {
    id: string,
    type: string,
    fromUserUid: string;
    fromProfileId: string;
    message: string,
    isRead: boolean,
    status: string,
}

 export type MatchPreposalNotificationType = BaseNotification & {
    type: "match proposal";
    matchId:string;
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
}

export type LocationStorageType = {
    name: string;
    courtId: string;
}
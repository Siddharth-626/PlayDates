import { Timestamp } from "firebase-admin/firestore";

export type AvailabilityType = {
    id: string;
    date: Date | Timestamp;
    time: string;
    duration: string;
    locations:LocationStorageType[];
    preference:string[];
}


export type LocationStorageType = {
    name:string;
    courtId:string;
}

export type PlayersType = {
    userUid:string;
    profileId:string;
    status:string;
    name:string;
}
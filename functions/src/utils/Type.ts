import { Timestamp } from "firebase-admin/firestore";

export type AvailabilityType = {
    id: string;
    startDate:Date | Timestamp;
    endDate:Date | Timestamp;
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
    photoUrl:string
}
import { Timestamp } from "firebase/firestore";
import { parseTimeString } from "../Time/parseTimeString";


export const insertTimeInDate = (date:any,time:string)=>{
    const parsed = parseTimeString(time);
    if (!parsed) return null;

    const target = date.toDate ? date.toDate() : new Date(date);
    target.setHours(parsed.hours, parsed.minutes, 0, 0);

    return target;
}
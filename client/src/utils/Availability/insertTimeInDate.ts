import { Timestamp } from "firebase/firestore";


export const insertTimeInDate = (date:any,time:string)=>{
    const formattedTime = time.replace(/\s?(am|pm)\s?/i, "").trim();

    const [hours,minutes] = formattedTime.split(":").map(Number);

    const target = date.toDate ? date.toDate() : new Date(date);

    target.setHours(hours,minutes,0,0);

    return target;
}
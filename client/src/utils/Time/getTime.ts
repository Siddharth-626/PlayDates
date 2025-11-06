

export const getTime = (date:any)=>{
    const target = date.toDate ? date.toDate() : new Date(date);

    return new Date(target.getTime()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
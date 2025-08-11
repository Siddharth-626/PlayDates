

export const hasMatchEnded = (date:Date | null,endTime:string)=>{

    if(!endTime || !date) return;
    const now = new Date();

    const [hours,minutes] = endTime.split(":").map(Number);

    const target = new Date(date);

    target.setHours(hours,minutes,0,0)

  return target.getTime() < now.getTime();

}
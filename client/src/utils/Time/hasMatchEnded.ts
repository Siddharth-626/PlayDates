

export const hasMatchEnded = (date: any, endTime: string) => {

  if (!endTime || !date) return;
  const now = new Date();
  const isPM = /pm/i.test(endTime);
  const isAM = /am/i.test(endTime);
  const formattedEndTime = endTime.replace(/\s?(am|pm)\s?/i, "").trim();
  let [hours, minutes] = formattedEndTime.split(":").map(Number);

  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  const target = date.toDate ? date.toDate() : new Date(date);

  target.setHours(hours, minutes, 0, 0);

  return target.getTime() < now.getTime();

}
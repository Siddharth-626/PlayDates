

export const hasMatchEnded = (date: any, endTime: string) => {

  if (!endTime || !date) return;
  const now = new Date();
  const formattedEndTime = endTime.replace(/\s?(am|pm)\s?/i, "").trim();
  const [hours, minutes] = formattedEndTime.split(":").map(Number);

  const target =  date.toDate ? date.toDate() :new Date(date);

  target.setHours(hours, minutes, 0, 0)

  const result = target.getTime() < now.getTime();

  return result;

}
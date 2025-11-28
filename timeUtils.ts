
export type UrgencyLevel = 'overdue' | 'soon' | 'normal';

export const checkUrgency = (dueText: string): UrgencyLevel => {
  if (!dueText) return 'normal';
  
  const now = new Date();
  const lowerText = dueText.toLowerCase();
  
  // Basic heuristic parsing for "Today HH:mm" and "Tomorrow HH:mm"
  let targetDate = new Date();
  let isDateParsed = false;

  if (lowerText.includes('today')) {
     const timeMatch = lowerText.match(/(\d{1,2}):(\d{2})/);
     if (timeMatch) {
        targetDate.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
     } else {
        // If just "Today", assume end of work day (17:00)
        targetDate.setHours(17, 0, 0, 0);
     }
     isDateParsed = true;
  } else if (lowerText.includes('tomorrow')) {
     targetDate.setDate(targetDate.getDate() + 1);
     const timeMatch = lowerText.match(/(\d{1,2}):(\d{2})/);
     if (timeMatch) {
        targetDate.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
     } else {
        targetDate.setHours(9, 0, 0, 0);
     }
     isDateParsed = true;
  }

  // If we couldn't parse a relative date, we skip highlighting to avoid false positives
  // (In a real app, strict ISO dates would be used)
  if (!isDateParsed) return 'normal';

  const diffInMinutes = (targetDate.getTime() - now.getTime()) / 1000 / 60;

  // Logic: 
  // < 0 mins = Overdue
  // 0 - 120 mins = Due Soon
  if (diffInMinutes < 0) return 'overdue';
  if (diffInMinutes <= 120) return 'soon';

  return 'normal';
};

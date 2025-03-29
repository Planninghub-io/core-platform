
import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (e) {
    return dateString || "";
  }
};

export const formatTime = (timeString: string) => {
  try {
    const time = new Date(`2000-01-01T${timeString}`);
    return format(time, "h:mm a");
  } catch (e) {
    return timeString || "";
  }
};

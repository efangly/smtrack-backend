import { format, toDate } from "date-fns";

const getDateFormat = (datetime: string | number | Date): Date => {
  return toDate(format(datetime, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
};

const getDateFullYear = (datetime: string | number | Date): string | undefined => {
  try {
    return format(datetime, "yyyy");
  } catch (error) {
    return undefined;
  }
}

export {
  getDateFormat,
  getDateFullYear
}

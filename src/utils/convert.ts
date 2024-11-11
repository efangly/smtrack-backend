import { LogDays } from "@prisma/client";

export const objToString = (obj: Object) => {
  return Object.entries(obj).reduce((str, [p, val]) => {
    return `${str}${p}:${val} `;
  }, '');
}

export const splitLog = (log: LogDays[], time: number = 1) => {
  let result: LogDays[] = log;
  for (let i = 0; i < time; i++) {
    result = result.filter((_item, index) => index % 2 === 0);
  }
  return result;
}
import { regexCustom, validate } from "./validate";

export const format = {
  countdown: (time: number) => {
    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400 / 3600));
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  },
  getDecimalNumber: (amount: number) => {
    return Math.floor(Math.round(100 * Math.log(amount) / Math.log(10)) / 100);
  }
}
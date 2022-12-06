import moment from "moment";
export const toGMT = (v:string) => {
  return new Date(moment(v as string).toString()).toUTCString();
};

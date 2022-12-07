import moment from 'moment';

export const toGMT = (v: string) => {
  return new Date(moment(v as string).toString()).toUTCString();
};

export const saveToStorage = (key: string, v: any) => {
  window.localStorage.setItem(key, JSON.stringify(v));
};

export const getFromStorage = (key: string): any[] => {
  const local = window.localStorage.getItem(key);
  if (local) {
    return JSON.parse(JSON.parse(local));
  }
  return [];
};

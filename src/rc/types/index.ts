export interface FormValue {
  AccessKeyId: string;
  AccessKeySecret: string;
  Method: string;
  ContentType?: string;
  ContentMD5?: string;
  Policy?: string;
  Expiration?: string;
  Region?: string;
  STSToken?: string;
}

export interface PageIndex {
  hide?: boolean;
}

export interface HistoryLog {
  timeStamp: number;
  auth: string;
  canon: string;
  AccessKeyId: string;
  AccessKeySecret: string;
}

export interface SigProcessData {
  canon: string;
  AccessKeyId: string;
  AccessKeySecret: string;
  auth?: string;
}

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
  Link?: string;
  Bucket?: string;
}

export interface PageIndex {
  hide?: boolean;
  onStateChange?: Function;
}

export interface HistoryLog {
  timeStamp?: number;
  auth?: string;
  canon?: string;
  AccessKeyId?: string;
  AccessKeySecret?: string;
  url?: string;
  signature?: string;
}

export interface SigProcessData {
  canon: string;
  AccessKeyId: string;
  AccessKeySecret: string;
  auth?: string;
}

export interface ResourceData {
  key: string;
  value: string;
}

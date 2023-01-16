/*eslint-disable*/
import moment from 'moment';
import crypto from 'crypto-js';
import is from 'is';
import { Dialog } from '@alicloud/console-components';
import intl from '../intl';

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

export const clearStorage = (key: string) => {
  window.localStorage.removeItem(key);
};

export const methods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];

export const formatHeaders = (headersArr: any) => {
  return [...headersArr]
    .sort((a, b) => {
      if (a.key > b.key) return 1;
      else if (a.key < b.key) return -1;
      return 0;
    })
    .map((_) => `x-oss-${_.key.toLowerCase()}:${_.value}`);
};

export const formatResource = (resourceArr: any) => {
  let resource = '/';
  const bucket = resourceArr.find((_: any) => _.key === 'bucket').value;
  const object = resourceArr.find((_: any) => _.key === 'object').value;
  const rest = resourceArr
    .filter((_: any) => !['bucket', 'object'].includes(_.key) && _.key.trim())
    .map((_: any) => `${_.key}${_.value.trim() ? `=${_.value.trim()}` : ''}`)
    .join('&');

  if (bucket || object) {
    resource = `${resource}${bucket}/${object || ''}${rest ? `?${rest}` : ''}`;
  }
  return resource;
};

export const formatForm = (obj: any) => {
  const { Method, ContentMD5, ContentType, Date, headers = [], resource } = obj;
  const canonicalizArr = [Method, ContentMD5, ContentType, Date, ...headers, resource];

  return canonicalizArr.join('\n');
};

export function authorization(
  accessKeyId: string,
  accessKeySecret: string,
  canonicalString: string,
) {
  return `OSS ${accessKeyId}:${computeSignature(accessKeySecret, canonicalString)}`;
}

export function computeSignature(accessKeySecret: string | undefined, canonicalString: string) {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret as string));
}

export function buildCanonicalizedResource(resourcePath: string, parameters: any) {
  let canonicalizedResource = `${resourcePath}`;
  let separatorString = '?';

  if (is.string(parameters) && parameters.trim() !== '') {
    canonicalizedResource += separatorString + parameters;
  } else if (is.array(parameters)) {
    parameters.sort();
    canonicalizedResource += separatorString + parameters.join('&');
  } else if (parameters) {
    const compareFunc = (entry1: any, entry2: any) => {
      if (entry1[0] > entry2[0]) {
        return 1;
      } else if (entry1[0] < entry2[0]) {
        return -1;
      }
      return 0;
    };
    const processFunc = (key: string) => {
      canonicalizedResource += separatorString + key;
      if (parameters[key]) {
        canonicalizedResource += `=${parameters[key]}`;
      }
      separatorString = '&';
    };
    Object.keys(parameters).sort(compareFunc).forEach(processFunc);
  }

  return canonicalizedResource;
}

export function buildCanonicalString(
  method: string,
  resourcePath: string,
  request: any,
  expires: string,
) {
  request = request || {};
  const headers = request.headers || {};
  const OSS_PREFIX = 'x-oss-';
  const ossHeaders: string[] = [];
  const headersToSign = {};

  let signContent = [
    method.toUpperCase(),
    headers['Content-Md5'] || '',
    headers['Content-Type'] || headers['Content-Type'.toLowerCase()],
    expires || headers['x-oss-date'],
  ];

  Object.keys(headers).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.indexOf(OSS_PREFIX) === 0) {
      // @ts-ignore
      headersToSign[lowerKey] = String(headers[key]).trim();
    }
  });

  Object.keys(headersToSign)
    .sort()
    .forEach((key) => {
      // @ts-ignore
      ossHeaders.push(`${key}:${headersToSign[key]}`);
    });

  signContent = signContent.concat(ossHeaders);

  signContent.push(buildCanonicalizedResource(resourcePath, request.parameters));

  return signContent.join('\n');
}

export const buildUrl = (
  accessKeyId: string | undefined,
  signature: any,
  expires: any,
  link: string | undefined,
  query: string | undefined,
  securityToken: string | undefined,
) => {
  return encodeURI(
    [
      link,
      query ? '?' + query + '&' : '?',
      'OSSAccessKeyId=',
      accessKeyId,
      '&Expires=',
      expires,
      '&Signature=',
      signature,
      securityToken ? '&security-token=' + securityToken : '',
    ].join(''),
  );

  // return encodeURI(
  //   `https://${bucket}.${region}.aliyuncs.com/${resource}?OSSAccessKeyId=${accessKeyId}&Expires=${expires}&Signature=${signature}${
  //     securityToken ? '&security-token=' + securityToken : ''
  //   }${query ? query : ''}`,
  // );
};

export const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
  labelTextAlign: 'left' as any,
};

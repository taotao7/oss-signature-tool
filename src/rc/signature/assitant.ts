import crypto from "crypto-js";
import is from "is";

export function authorization(accessKeyId:string, accessKeySecret:string, canonicalString:string) {
  return `OSS ${accessKeyId}:${computeSignature(
    accessKeySecret,
    canonicalString
  )}`;
}

// 计算签名
export function computeSignature(accessKeySecret:string, canonicalString:string) {
  return crypto.enc.Base64.stringify(
    crypto.HmacSHA1(canonicalString, accessKeySecret)
  );
}

export function buildCanonicalizedResource(resourcePath:string, parameters:any) {
  let canonicalizedResource = `${resourcePath}`;
  let separatorString = "?";

  if (is.string(parameters) && parameters.trim() !== "") {
    canonicalizedResource += separatorString + parameters;
  } else if (is.array(parameters)) {
    parameters.sort();
    canonicalizedResource += separatorString + parameters.join("&");
  } else if (parameters) {
    const compareFunc = (entry1:any, entry2:any) => {
      if (entry1[0] > entry2[0]) {
        return 1;
      } else if (entry1[0] < entry2[0]) {
        return -1;
      }
      return 0;
    };
    const processFunc = (key:string) => {
      canonicalizedResource += separatorString + key;
      if (parameters[key]) {
        canonicalizedResource += `=${parameters[key]}`;
      }
      separatorString = "&";
    };
    Object.keys(parameters).sort(compareFunc).forEach(processFunc);
  }

  return canonicalizedResource;
}

export function buildCanonicalString(method:string, resourcePath:string, request:any, expires:string) {
  request = request || {};
  const headers = request.headers || {};
  const OSS_PREFIX = "x-oss-";
  const ossHeaders:string[] = [];
  const headersToSign = {};

  let signContent = [
    method.toUpperCase(),
    headers["Content-Md5"] || "",
    headers["Content-Type"] || headers["Content-Type".toLowerCase()],
    expires || headers["x-oss-date"],
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

  signContent.push(
    buildCanonicalizedResource(resourcePath, request.parameters)
  );

  return signContent.join("\n");
}

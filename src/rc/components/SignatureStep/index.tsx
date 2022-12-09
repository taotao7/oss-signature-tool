import React, { useEffect, useState } from 'react';
import { SigProcessData } from '../../types';
import { computeSignature } from '../../utils';
import styles from './index.module.less';
import crypto from 'crypto-js';

interface ISignatureStep {
  sigProcessData: SigProcessData;
  prefix: string;
}

export default (props: ISignatureStep) => {
  const {
    sigProcessData: { canon, AccessKeySecret, AccessKeyId, auth = '' },
    prefix,
  } = props;
  const [signature, setSignature] = useState<string>();

  useEffect(() => {
    if (AccessKeySecret && AccessKeyId && canon) {
      if (prefix === 'standard') {
        setSignature(computeSignature(AccessKeySecret, canon));
      }

      if (prefix === 'postObject') {
        setSignature(auth);
      }
    }
  }, [canon, AccessKeySecret, AccessKeyId]);

  if (prefix === 'standard') {
    return (
      <>
        <div className={styles.titleContainer}>
          <span className={styles.title}>签名过程</span>
        </div>
        {
          <div className={styles.contentContainer}>
            <div>
              当前签名字段(canonicalString): <pre>{canon}</pre>
              签名调用函数
              <div>
                Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(canonicalString,AccessKeySecret))
              </div>
              <pre> Signature={signature}</pre>
              Authorization=&apos;OSS &apos; + AccessKeyId + &apos;:&apos; + Signature
              <pre>
                Authorization=OSS {AccessKeyId}:{signature}
              </pre>
            </div>
          </div>
        }
      </>
    );
  }
  if (prefix === 'postObject') {
    return (
      <>
        <div className={styles.titleContainer}>
          <span className={styles.title}>签名过程</span>
        </div>
        {
          <div className={styles.contentContainer}>
            <div>
              base64 policy 调用函数
              <br />
              crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policy))
              <pre>{crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(canon))}</pre>
              签名调用函数
              <div>
                Authorization=crypto.enc.Base64.stringfy(crypto.HmacHSA1(base64(policy),
                AccessKeySecret))
              </div>
              <pre> Authorization={signature}</pre>
            </div>
          </div>
        }
      </>
    );
  }

  return <></>;
};

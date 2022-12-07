import React, { useEffect, useState } from 'react';
import { ISigProcessData } from '../../StandardSignature';
import { computeSignature } from '../Signature/assitant';
import styles from './index.module.less';

interface ISignatureStep {
  sigProcessData: ISigProcessData;
}

export default (props: ISignatureStep) => {
  const {
    sigProcessData: { canon, AccessKeySecret, AccessKeyId },
  } = props;
  const [signature, setSignature] = useState<string>();

  useEffect(() => {
    if (AccessKeySecret && AccessKeyId && canon) {
      setSignature(computeSignature(AccessKeySecret, canon));
    }
  }, [canon, AccessKeySecret, AccessKeyId]);
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
            <span>
              Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(canonicalString,AccessKeySecret))
            </span>
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
};

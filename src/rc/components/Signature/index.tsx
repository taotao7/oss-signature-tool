import React, { useEffect, useState } from 'react';
import { Dialog } from '@alicloud/console-components';
import { authorization as getAuth } from './assitant';
import { getFromStorage, saveToStorage, toGMT } from '../../utils';
import { IHistory } from '../../StandardSignature';
import styles from './index.module.less';

export default (props: any) => {
  const {
    visible,
    onCancel,
    formValue,
    headersData,
    resourceData,
    dateField,
    prefix,
    setSigProcessData,
    setLogIndex,
  } = props;
  const { AccessKeyId, AccessKeySecret } = formValue;
  const [canonicalString, setCanonicalString] = useState('');
  const [authorization, setAuthorization] = useState('');

  // 实际渲染
  useEffect(() => {
    if (resourceData.length > 0 && dateField && AccessKeySecret && AccessKeyId) {
      const canon = formatForm({
        ...formValue,
        Date: toGMT(dateField),
        headers: formatHeaders(headersData),
        resource: formatResource(resourceData),
      });
      const auth = getAuth(AccessKeyId, AccessKeySecret, canon);
      setSigProcessData({ canon, AccessKeyId, AccessKeySecret });
      setCanonicalString(canon);
      setAuthorization(auth);
    }
  }, [headersData, resourceData, formValue]);

  const formatHeaders = (headersArr: any) => {
    return [...headersArr]
      .sort((a, b) => {
        if (a.key > b.key) return 1;
        else if (a.key < b.key) return -1;
        return 0;
      })
      .map((_) => `x-oss-${_.key.toLowerCase()}:${_.value}`);
  };

  const formatResource = (resourceArr: any) => {
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

  const formatForm = (obj: any) => {
    const { Method, ContentMD5, ContentType, Date, headers, resource } = obj;
    const canonicalizArr = [Method, ContentMD5, ContentType, Date, ...headers, resource];

    return canonicalizArr.join('\n');
  };

  const onClickButton = () => {
    // save log to local storage
    const history: IHistory[] | [] = getFromStorage(`sig-${prefix}`);
    if (history instanceof Array) {
      history.unshift({
        timeStamp: new Date().valueOf(),
        auth: authorization,
        canon: canonicalString,
        AccessKeyId,
        AccessKeySecret,
      });
      setLogIndex(0);
      saveToStorage(`sig-${prefix}`, JSON.stringify(history));
    }
    // close dialog
    onCancel();
  };

  return (
    <Dialog
      style={{ width: '800px' }}
      title="签名信息"
      visible={visible}
      closeMode={visible ? ['close', 'esc', 'mask'] : ['close', 'esc']}
      onOk={onClickButton}
      onCancel={onClickButton}
      onClose={onClickButton}
      height="60vh"
    >
      <div>
        <h3>canonicalString:</h3>
        <pre className={styles.codeBox}>{canonicalString}</pre>
        <h3>authorization:</h3>
        <pre className={styles.codeBox}>{authorization}</pre>
      </div>
    </Dialog>
  );
};

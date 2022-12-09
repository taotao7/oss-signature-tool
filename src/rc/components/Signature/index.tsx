import React, {useEffect, useState} from 'react';
import {Dialog} from '@alicloud/console-components';
import {
  authorization as getAuth,
  formatForm,
  formatHeaders,
  formatResource,
  getFromStorage,
  saveToStorage,
  toGMT
} from '../../utils';
import {HistoryLog} from '../../types';
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
  const {AccessKeyId, AccessKeySecret} = formValue;
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
      setSigProcessData({canon, AccessKeyId, AccessKeySecret});
      setCanonicalString(canon);
      setAuthorization(auth);
    }
  }, [headersData, resourceData, formValue]);


  const onClickButton = () => {
    // save log to local storage
    const history: HistoryLog[] | [] = getFromStorage(`sig-${prefix}`);
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
      style={{width: '800px'}}
      title="签名信息"
      visible={visible}
      closeMode={visible ? ['close', 'esc', 'mask'] : ['close', 'esc']}
      onOk={onClickButton}
      onCancel={onClickButton}
      onClose={onClickButton}
      height="55vh"
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

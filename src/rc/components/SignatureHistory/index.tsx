import React from 'react';
import { IHistory } from '../../StandardSignature';
import { Card, Button } from '@alicloud/console-components';
import { clearStorage } from '../../utils';
import moment from 'moment';
import styles from './index.module.less';

interface SignatureHistoryType {
  history: IHistory[];
  prefix: string;
  setHistoryLog: Function;
  setLogIndex: Function;
  logIndex: number;
}

export default (props: SignatureHistoryType) => {
  const { history, prefix, setHistoryLog, setLogIndex, logIndex } = props;

  const clearHistory = () => {
    clearStorage(`sig-${prefix}`);
    setHistoryLog([]);
    setLogIndex(0);
  };

  return (
    <>
      <div className={styles.titleContainer}>
        <span className={styles.title}>签名记录</span>
        <Button onClick={clearHistory} type="primary" size="small">
          清除记录
        </Button>
      </div>
      <div className={styles.container}>
        {history.map((i, k) => (
          <Card
            title={`记录时间: ${moment(i.timeStamp).format('YYYY-MM-DD HH:mm:ss')}`}
            className={logIndex === k ? styles.activeCard : styles.defaultCard}
            showHeadDivider
            key={k}
            onClick={() => {
              setLogIndex(k);
            }}
          >
            CanonicalString:
            <pre>{i.canon}</pre>
            Authorization:
            <pre>{i.auth}</pre>
          </Card>
        ))}
      </div>
    </>
  );
};

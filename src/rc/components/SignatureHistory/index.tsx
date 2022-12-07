import React from 'react';
import { historyType } from '../../StandardSignature';
import { Card } from '@alicloud/console-components';
import moment from 'moment';
import styles from './index.module.less';

interface SignatureHistoryType {
  history: historyType[];
}

export default (props: SignatureHistoryType) => {
  const { history } = props;
  return (
    <>
      <h1>签名记录</h1>
      <div className={styles.container}>
        {history.map((i) => (
          <Card
            title={`记录时间: ${moment(i.timeStamp).format('YYYY-MM-DD HH:mm:ss')}`}
            className={styles.card}
            showHeadDivider
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

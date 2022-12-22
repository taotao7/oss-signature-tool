import React from 'react';
import { HistoryLog } from '../../types';
import { Button, Card, Icon } from '@alicloud/console-components';
import { clearStorage, saveToStorage } from '../../utils';
import moment from 'moment';
import './index.less';

interface SignatureHistoryType {
  history: HistoryLog[];
  prefix: string;
  setHistoryLog: Function;
}

export default (props: SignatureHistoryType) => {
  const { history, prefix, setHistoryLog } = props;

  const clearHistory = (timeStamp) => {
    const tempHistory: HistoryLog[] = history.filter((i) => i.timeStamp !== timeStamp);
    saveToStorage(`sig-${prefix}`, JSON.stringify(tempHistory));
    setHistoryLog(tempHistory);
  };

  const clearAll = () => {
    clearStorage(`sig-${prefix}`);
    setHistoryLog([]);
  };

  if (prefix === 'standard') {
    return (
      <>
        <div className="titleContainer">
          <span className="title">签名记录</span>
          {history.length > 0 && (
            <Button size="small" type="primary" onClick={clearAll}>
              清除全部
            </Button>
          )}
        </div>
        <div className="container">
          {history.map((i, k) => (
            <Card
              title={
                <>
                  记录时间: {moment(i.timeStamp).format('YYYY-MM-DD HH:mm:ss')}{' '}
                  <Icon
                    onClick={() => clearHistory(i.timeStamp)}
                    type="delete"
                    style={{ position: 'absolute', right: '5px' }}
                  />
                </>
              }
              className="defaultCard"
              showHeadDivider
              key={k}
            >
              <div className="contentContainer">
                <div>
                  当前签名字段(canonicalString): <pre>{i.canon}</pre>
                  签名调用函数
                  <div>
                    Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(canonicalString,AccessKeySecret))
                  </div>
                  <pre> Signature={i?.signature}</pre>
                  Authorization=&apos;OSS &apos; + AccessKeyId + &apos;:&apos; + Signature
                  <pre>Authorization={i?.auth}</pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (prefix === 'postObject') {
    return (
      <>
        <div className="titleContainer">
          <span className="title">签名记录</span>
          {history.length > 0 && (
            <Button size="small" type="primary" onClick={clearAll}>
              清除全部
            </Button>
          )}
        </div>
        <div className="container">
          {history.map((i, k) => (
            <Card
              title={
                <>
                  记录时间: {moment(i.timeStamp).format('YYYY-MM-DD HH:mm:ss')}{' '}
                  <Icon
                    onClick={() => clearHistory(i.timeStamp)}
                    type="delete"
                    style={{ position: 'absolute', right: '5px' }}
                  />
                </>
              }
              className="defaultCard"
              showHeadDivider
              key={k}
            >
              <div className="contentContainer">
                <div>
                  policy
                  <pre>{i.canon}</pre>
                  base64 policy 调用函数
                  <br />
                  crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policy))
                  <pre>{i.signature}</pre>
                  签名调用函数
                  <div>
                    Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(base64(policy),
                    AccessKeySecret))
                  </div>
                  <pre> Signature={i.auth}</pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (prefix === 'sigUrl') {
    return (
      <>
        <div className="titleContainer">
          <span className="title">签名记录</span>
          {history.length > 0 && (
            <Button size="small" type="primary" onClick={clearAll}>
              清除全部
            </Button>
          )}
        </div>
        <div className="container">
          {history.map((i, k) => (
            <Card
              title={
                <>
                  记录时间: {moment(i.timeStamp).format('YYYY-MM-DD HH:mm:ss')}{' '}
                  <Icon
                    onClick={() => clearHistory(i.timeStamp)}
                    type="delete"
                    style={{ position: 'absolute', right: '5px' }}
                  />
                </>
              }
              className="defaultCard"
              showHeadDivider
              key={k}
            >
              <div className="contentContainer">
                <div>
                  当前签名字段(canonicalString):
                  <pre>{i.canon}</pre>
                  签名链接:
                  <pre>{i?.url}</pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return '<></>';
};

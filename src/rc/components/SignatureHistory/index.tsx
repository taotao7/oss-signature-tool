import React, { useState } from 'react';
import { HistoryLog } from '../../types';
import { Button, Icon, Dialog, Message } from '@alicloud/console-components';
import CardContainer from '../CardContainer';
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
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const clearHistory = (timeStamp: number) => {
    Dialog.alert({
      title: '确认删除历史记录',
      content: '删除后不可恢复，是否继续?',
      onOk: () => {
        const tempHistory: HistoryLog[] = history.filter((i) => i.timeStamp !== timeStamp);
        saveToStorage(`sig-${prefix}`, JSON.stringify(tempHistory));
        setHistoryLog(tempHistory);
        Message.show({
          content: '删除成功！',
        });
      },
    });
  };

  const clearAll = () => {
    Dialog.alert({
      title: '确认删除所有历史记录',
      content: '删除后不可恢复，是否继续?',
      onOk: () => {
        clearStorage(`sig-${prefix}`);
        setHistoryLog([]);
        Message.show({
          content: '删除成功！',
        });
      },
    });
  };

  const onCollapseChange = () => {
    setShowHistory(!showHistory);
  };

  if (prefix === 'standard') {
    return (
      <>
        <div className="container">
          <div className="titleContainer">
            <span className="cardTitle">结果反馈（签名过程）</span>
            {history.length > 0 && (
              <Button size="small" type="primary" onClick={clearAll}>
                清除全部
              </Button>
            )}
          </div>
          <div>
            {history.length === 0 && <div className="containerPlaceholder" />}
            {history.map((i, k) => (
              <>
                {(k === 0 || showHistory) && (
                  <CardContainer
                    clearButton={() => clearHistory(i.timeStamp)}
                    content={`记录时间:${moment(i.timeStamp).format('YYYY年MM月DD日 HH:mm:ss')}`}
                    key={k}
                    collapse={k === 0}
                  >
                    <div>
                      <div>
                        当前签名字段(canonicalString): <pre>{i.canon}</pre>
                        <div>
                          签名调用函数:
                          Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(canonicalString,AccessKeySecret))
                        </div>
                        <pre> {i?.signature}</pre>
                        请求头: Authorization=&apos;OSS &apos; + AccessKeyId + &apos;:&apos; +
                        Signature
                        <pre>{i?.auth}</pre>
                      </div>
                    </div>
                  </CardContainer>
                )}
                {k === 0 && (
                  <div className="collapseContent" onClick={onCollapseChange}>
                    展开历史记录
                    {showHistory ? <Icon type="collapse" /> : <Icon type="expand" />}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (prefix === 'postObject') {
    return (
      <>
        <div className="container">
          <div className="titleContainer">
            <span className="cardTitle">结果反馈（签名过程）</span>
            {history.length > 0 && (
              <Button size="small" type="primary" onClick={clearAll}>
                清除全部
              </Button>
            )}
          </div>
          <div>
            {history.length === 0 && <div className="containerPlaceholder" />}
            {history.map((i, k) => (
              <>
                {(k === 0 || showHistory) && (
                  <CardContainer
                    clearButton={() => clearHistory(i.timeStamp)}
                    content={`记录时间:${moment(i.timeStamp).format('YYYY年MM月DD日 HH:mm:ss')}`}
                    key={k}
                    collapse={k === 0}
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
                  </CardContainer>
                )}
                {k === 0 && (
                  <div className="collapseContent" onClick={onCollapseChange}>
                    展开历史记录
                    {showHistory ? <Icon type="collapse" /> : <Icon type="expand" />}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (prefix === 'sigUrl') {
    return (
      <>
        <div className="container">
          <div className="titleContainer">
            <span className="cardTitle">结果反馈（签名过程）</span>
            {history.length > 0 && (
              <Button size="small" type="primary" onClick={clearAll}>
                清除全部
              </Button>
            )}
          </div>
          <div>
            {history.length === 0 && <div className="containerPlaceholder" />}
            {history.map((i, k) => (
              <>
                {(k === 0 || showHistory) && (
                  <CardContainer
                    clearButton={() => clearHistory(i.timeStamp)}
                    content={`记录时间:${moment(i.timeStamp).format('YYYY年MM月DD日 HH:mm:ss')}`}
                    key={k}
                    collapse={k === 0}
                  >
                    <div className="contentContainer">
                      <div>
                        当前签名字段(canonicalString):
                        <pre>{i.canon}</pre>
                        签名链接:
                        <pre>{i?.url}</pre>
                      </div>
                    </div>
                  </CardContainer>
                )}
                {k === 0 && (
                  <div className="collapseContent" onClick={onCollapseChange}>
                    展开历史记录
                    {showHistory ? <Icon type="collapse" /> : <Icon type="expand" />}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </>
    );
  }

  return <>not have</>;
};

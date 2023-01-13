import React, { useState, MouseEvent } from 'react';
import { HistoryLog } from '../../types';
import { Icon, Dialog, Message } from '@alicloud/console-components';
import CardContainer from '../CardContainer';
import { clearStorage, saveToStorage } from '../../utils';
import moment from 'moment';
import styles from './index.module.less';
import intl from '../../../intl';
import Helper from '../Helper';

interface SignatureHistoryType {
  history: HistoryLog[];
  prefix: string;
  setHistoryLog: Function;
  clearContent: Function;
  content: HistoryLog;
}

export default (props: SignatureHistoryType) => {
  const { history = [], prefix, setHistoryLog, clearContent, content } = props;
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const clearCurrentHistory = () => {
    Dialog.alert({
      title: intl('common.tool.signatureHistory.clearCurrentHistory.title'),
      content: intl('common.tool.signatureHistory.clearCurrentHistory.content'),
      onOk: () => {
        clearContent({});
        Message.show({
          content: intl('common.tool.signatureHistory.clear.ok'),
        });
      },
    });
  };

  const clearHistory = (timeStamp: number | undefined) => {
    if (timeStamp) {
      Dialog.alert({
        title: intl('common.tool.signatureHistory.clearSingle.title'),
        content: intl('common.tool.signatureHistory.clearSingle.content'),
        onOk: () => {
          const tempHistory: HistoryLog[] = history.filter((i) => i.timeStamp !== timeStamp);
          saveToStorage(`sig-${prefix}`, JSON.stringify(tempHistory));
          setHistoryLog(tempHistory);
          Message.show({
            content: intl('common.tool.signatureHistory.clear.success'),
          });
        },
      });
    }
  };

  const clearAll = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    Dialog.alert({
      title: intl('common.tool.signatureHistory.clearAll.title'),
      content: intl('common.tool.signatureHistory.clearSingle.content'),
      onOk: () => {
        clearStorage(`sig-${prefix}`);
        setHistoryLog([]);
        Message.show({
          content: intl('common.tool.signatureHistory.clear.success'),
        });
      },
    });
  };

  const onCollapseChange = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowHistory(!showHistory);
  };

  if (prefix === 'standard') {
    return (
      <>
        {content?.timeStamp && (
          <>
            <div className={styles.container} style={{ maxHeight: '862px' }}>
              <div className={styles.titleContainer}>
                <span className={styles.cardTitle}>
                  {intl('common.tool.signatureHistory.result')}
                </span>
                <div onClick={clearCurrentHistory}> {intl('common.tool.clear')}</div>
              </div>
              <CardContainer
                content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                  content?.timeStamp,
                ).format(
                  `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                )}`}
                collapse
                top
              >
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>
                      {intl('common.tool.signatureHistory.sigCut')}:
                    </div>
                    <pre>{content?.canon}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.sigFunc')}:
                      <div>Signature = base64(hmac-sha1(AccessKeySecret,</div>
                      <div>VERB + "\n" </div>
                      <div>+ Content-MD5 + "\n"</div>
                      <div>+ Content-Type + "\n"</div>
                      <div>+ Date + "\n"</div>
                      <div>+ CanonicalizedOSSHeaders</div>
                      <div>+ CanonicalizedResource))</div>
                    </div>
                    <pre>{content?.signature}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.sigHeader')}: Authorization=&apos;OSS
                      &apos; + AccessKeyId + &apos;:&apos; + Signature
                    </div>
                    <pre style={{ marginBottom: '0px' }}>{content?.auth}</pre>
                  </div>
                </div>
              </CardContainer>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', height: '16px' }} />
          </>
        )}

        {content?.timeStamp && <Helper />}

        <div className={styles.container}>
          <div className={styles.footer} onClick={onCollapseChange}>
            <div className={styles.footerTitle}>{intl('common.tool.history')}</div>
            <div className={styles.footerRight}>
              {showHistory ? (
                <>
                  <span onClick={clearAll}>{intl('common.tool.signatureHistory.clearAll')}</span>
                  <Icon type="collapse" size={12} style={{ marginLeft: '16px' }} />
                </>
              ) : (
                <>
                  <span onClick={clearAll}>{intl('common.tool.signatureHistory.clearAll')}</span>
                  <Icon type="expand" size={12} style={{ marginLeft: '16px' }} />
                </>
              )}
            </div>
          </div>

          {history.length <= 0 && showHistory && (
            <div className={styles.empty}>
              {intl('common.tool.signatureHistory.notHaveHistory')}
            </div>
          )}

          {showHistory &&
            history.map((i, k) => (
              <CardContainer
                clearButton={(e) => {
                  e.stopPropagation();
                  clearHistory(i.timeStamp);
                }}
                content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                  i.timeStamp,
                ).format(
                  `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                )}`}
                key={k}
              >
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>
                      {intl('common.tool.signatureHistory.sigFunc')}:
                    </div>
                    <pre>{i.canon}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.sigFunc')}:
                      <div>Signature = base64(hmac-sha1(AccessKeySecret,</div>
                      <div>VERB + "\n" </div>
                      <div>+ Content-MD5 + "\n"</div>
                      <div>+ Content-Type + "\n"</div>
                      <div>+ Date + "\n"</div>
                      <div>+ CanonicalizedOSSHeaders</div>
                      <div>+ CanonicalizedResource))</div>
                    </div>
                    <pre>{i?.signature}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.sigHeader')}: Authorization=&apos;OSS
                      &apos; + AccessKeyId + &apos;:&apos; + Signature
                    </div>
                    <pre style={{ marginBottom: '0px' }}>{i?.auth}</pre>
                  </div>
                </div>
              </CardContainer>
            ))}
        </div>
      </>
    );
  }

  if (prefix === 'postObject') {
    return (
      <>
        {content?.timeStamp && (
          <>
            <div className={styles.container} style={{ maxHeight: '862px' }}>
              <div className={styles.titleContainer}>
                <span className={styles.cardTitle}>
                  {intl('common.tool.signatureHistory.result')}
                </span>
                <div onClick={clearCurrentHistory}> {intl('common.tool.clear')}</div>
              </div>
              <CardContainer
                content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                  content?.timeStamp,
                ).format(
                  `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                )}`}
                collapse
                top
              >
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>policy:</div>
                    <pre>{content?.canon}</pre>
                    <div className={styles.contentView}>
                      base64 policy {intl('common.tool.signatureHistory.Func')}:
                      crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policy))
                    </div>
                    <pre>{content?.signature}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.sigFunc')}:
                      Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(base64(policy),
                      AccessKeySecret))
                    </div>
                    <pre style={{ marginBottom: '0px' }}>Signature={content?.auth}</pre>
                  </div>
                </div>
              </CardContainer>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', height: '16px' }} />
          </>
        )}

        {content?.timeStamp && <Helper />}

        <div className={styles.container}>
          <div className={styles.footer} onClick={onCollapseChange}>
            <div className={styles.footerTitle}>{intl('common.tool.history')}</div>
            <div className={styles.footerRight}>
              {showHistory ? (
                <>
                  <span onClick={clearAll}>{intl('common.tool.signatureHistory.clearAll')}</span>
                  <Icon type="collapse" size={12} style={{ marginLeft: '16px' }} />
                </>
              ) : (
                <>
                  <span onClick={clearAll}>{intl('common.tool.signatureHistory.clearAll')}</span>
                  <Icon type="expand" size={12} style={{ marginLeft: '16px' }} />
                </>
              )}
            </div>
          </div>

          {history.length <= 0 && showHistory && (
            <div className={styles.empty}>
              {intl('common.tool.signatureHistory.notHaveHistory')}
            </div>
          )}

          {showHistory &&
            history.map((i, k) => (
              <CardContainer
                clearButton={(e) => {
                  e.stopPropagation();
                  clearHistory(i.timeStamp);
                }}
                content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                  i.timeStamp,
                ).format(
                  `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                )}`}
                key={k}
              >
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>policy:</div>
                    <pre>{i.canon}</pre>
                    <div className={styles.contentView}>
                      base64 policy ${intl('common.tool.signatureHistory.Func')}:
                      crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policy))
                    </div>
                    <pre>{i.signature}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.sigFunc')}:
                      Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(base64(policy),
                      AccessKeySecret))
                    </div>
                    <pre style={{ marginBottom: '0px' }}>Signature={i.auth}</pre>
                  </div>
                </div>
              </CardContainer>
            ))}
        </div>
      </>
    );
  }

  if (prefix === 'sigUrl') {
    return (
      <>
        {content?.timeStamp && (
          <>
            <div className={styles.container} style={{ maxHeight: '862px' }}>
              <div className={styles.titleContainer}>
                <span className={styles.cardTitle}>
                  {intl('common.tool.signatureHistory.result')}
                </span>
                <div onClick={clearCurrentHistory}> {intl('common.tool.clear')}</div>
              </div>
              <CardContainer
                content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                  content?.timeStamp,
                ).format(
                  `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                )}`}
                collapse
                top
              >
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>
                      {intl('common.tool.signatureHistory.sigCut')}:
                    </div>
                    <pre>{content?.canon}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.link')}
                    </div>
                    <pre style={{ marginBottom: '0px' }}>{content?.url}</pre>
                  </div>
                </div>
              </CardContainer>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', height: '16px' }} />
          </>
        )}

        {content?.timeStamp && <Helper />}

        <div className={styles.container}>
          <div className={styles.footer} onClick={onCollapseChange}>
            <div className={styles.footerTitle}>{intl('common.tool.history')}</div>
            <div className={styles.footerRight}>
              {showHistory ? (
                <>
                  <span onClick={clearAll}>{intl('common.tool.signatureHistory.clearAll')}</span>
                  <Icon type="collapse" size={12} style={{ marginLeft: '16px' }} />
                </>
              ) : (
                <>
                  <span onClick={clearAll}>{intl('common.tool.signatureHistory.clearAll')}</span>
                  <Icon type="expand" size={12} style={{ marginLeft: '16px' }} />
                </>
              )}
            </div>
          </div>

          {history.length <= 0 && showHistory && (
            <div className={styles.empty}>
              {intl('common.tool.signatureHistory.notHaveHistory')}
            </div>
          )}

          {showHistory &&
            history.map((i, k) => (
              <CardContainer
                clearButton={(e) => {
                  e.stopPropagation();
                  clearHistory(i.timeStamp);
                }}
                content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                  content?.timeStamp,
                ).format(
                  `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                )}`}
                key={k}
              >
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>
                      {intl('common.tool.signatureHistory.sigCut')}:
                    </div>
                    <pre>{i.canon}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.link')}
                    </div>
                    <pre style={{ marginBottom: '0px' }}>{i?.url}</pre>
                  </div>
                </div>
              </CardContainer>
            ))}
        </div>
      </>
    );
  }

  return <>not have</>;
};

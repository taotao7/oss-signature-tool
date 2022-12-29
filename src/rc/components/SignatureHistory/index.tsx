import React, { useState } from 'react';
import { HistoryLog } from '../../types';
import { Icon, Dialog, Message } from '@alicloud/console-components';
import CardContainer from '../CardContainer';
import { clearStorage, saveToStorage } from '../../utils';
import moment from 'moment';
import styles from './index.module.less';
import intl from '../../../intl';

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

  const clearAll = () => {
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

  const onCollapseChange = () => {
    setShowHistory(!showHistory);
  };

  if (prefix === 'standard') {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <span className={styles.cardTitle}>{intl('common.tool.signatureHistory.result')}</span>
            <Icon onClick={clearCurrentHistory} type="delete" size="small" />
          </div>
          <div>
            {content?.timeStamp && (
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
                    {intl('common.tool.signatureHistory.sigCut')}: canonicalString
                    <pre>{content?.canon}</pre>
                    <div>
                      {intl('common.tool.signatureHistory.sigFunc')}:
                      Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(canonicalString,AccessKeySecret))
                    </div>
                    <pre>{content?.signature}</pre>
                    {intl('common.tool.signatureHistory.sigHeader')}: Authorization=&apos;OSS &apos;
                    + AccessKeyId + &apos;:&apos; + Signature
                    <pre>{content?.auth}</pre>
                  </div>
                </div>
              </CardContainer>
            )}

            {!content?.timeStamp && <div className={styles.containerPlaceholder}></div>}

            <div className={styles.footer}>
              <div className={styles.collapseContent} onClick={onCollapseChange}>
                {intl('common.tool.signatureHistory.collapse')}
                {showHistory ? <Icon type="collapse" /> : <Icon type="expand" />}
              </div>
              <div className={styles.footerRight} onClick={clearAll}>
                {intl('common.tool.signatureHistory.clearAll')}
              </div>
            </div>
            {history.map((i, k) => (
              <>
                {showHistory && (
                  <CardContainer
                    clearButton={() => clearHistory(i?.timeStamp)}
                    content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                      i.timeStamp,
                    ).format(
                      `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                        'common.tool.signatureHistory.month',
                      )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                    )}`}
                    key={k}
                  >
                    <div className={styles.contentContainer}>
                      <div>
                        {intl('common.tool.signatureHistory.sigFunc')}: canonicalString
                        <pre>{i.canon}</pre>
                        <div>
                          {intl('common.tool.signatureHistory.sigFunc')}:
                          Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(canonicalString,AccessKeySecret))
                        </div>
                        <pre>{i?.signature}</pre>
                        {intl('common.tool.signatureHistory.sigHeader')}: Authorization=&apos;OSS
                        &apos; + AccessKeyId + &apos;:&apos; + Signature
                        <pre>{i?.auth}</pre>
                      </div>
                    </div>
                  </CardContainer>
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
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <span className={styles.cardTitle}>{intl('common.tool.signatureHistory.result')}</span>
            <Icon onClick={clearCurrentHistory} type="delete" size="small" />
          </div>
          <div>
            {content?.timeStamp && (
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
                <div className={styles.contentContainer}>
                  <div>
                    policy:
                    <pre>{content?.canon}</pre>
                    base64 policy ${intl('common.tool.signatureHistory.Func')}:
                    crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policy))
                    <pre>{content?.signature}</pre>
                    {intl('common.tool.signatureHistory.sigFunc')}:
                    <div>
                      Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(base64(policy),
                      AccessKeySecret))
                    </div>
                    <pre>Signature={content?.auth}</pre>
                  </div>
                </div>
              </CardContainer>
            )}

            {!content?.timeStamp && <div className={styles.containerPlaceholder} />}

            <div className={styles.footer}>
              <div className={styles.collapseContent} onClick={onCollapseChange}>
                {intl('common.tool.signatureHistory.collapse')}
                {showHistory ? <Icon type="collapse" /> : <Icon type="expand" />}
              </div>
              <div className={styles.footerRight} onClick={clearAll}>
                {intl('common.tool.signatureHistory.clearAll')}
              </div>
            </div>

            {history.map((i, k) => (
              <>
                {showHistory && (
                  <CardContainer
                    clearButton={() => clearHistory(i.timeStamp)}
                    content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                      i.timeStamp,
                    ).format(
                      `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                        'common.tool.signatureHistory.month',
                      )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                    )}`}
                    key={k}
                  >
                    <div className={styles.contentContainer}>
                      <div>
                        policy:
                        <pre>{i.canon}</pre>
                        base64 policy ${intl('common.tool.signatureHistory.Func')}:
                        crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policy))
                        <pre>{i.signature}</pre>
                        {intl('common.tool.signatureHistory.sigFunc')}:
                        <div>
                          Signature=crypto.enc.Base64.stringfy(crypto.HmacHSA1(base64(policy),
                          AccessKeySecret))
                        </div>
                        <pre>Signature={i.auth}</pre>
                      </div>
                    </div>
                  </CardContainer>
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
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <span className={styles.cardTitle}>{intl('common.tool.signatureHistory.result')}</span>
            <Icon onClick={clearCurrentHistory} type="delete" size="small" />
          </div>
          <div>
            {content?.timeStamp && (
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
                <div className={styles.contentContainer}>
                  <div>
                    {intl('common.tool.signatureHistory.sigCut')}: canonicalString
                    <pre>{content?.canon}</pre>
                    {intl('common.tool.signatureHistory.link')}
                    <pre>{content?.url}</pre>
                  </div>
                </div>
              </CardContainer>
            )}

            {!content?.timeStamp && <div className={styles.containerPlaceholder}></div>}

            <div className={styles.footer}>
              <div className={styles.collapseContent} onClick={onCollapseChange}>
                {intl('common.tool.signatureHistory.collapse')}
                {showHistory ? <Icon type="collapse" /> : <Icon type="expand" />}
              </div>
              <div className={styles.footerRight} onClick={clearAll}>
                {intl('common.tool.signatureHistory.clearAll')}
              </div>
            </div>

            {history.map((i, k) => (
              <>
                {showHistory && (
                  <CardContainer
                    clearButton={() => clearHistory(i.timeStamp)}
                    content={`${intl('common.tool.signatureHistory.sigDate')}:${moment(
                      content?.timeStamp,
                    ).format(
                      `YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                        'common.tool.signatureHistory.month',
                      )}DD${intl('common.tool.signatureHistory.day')} HH:mm:ss`,
                    )}`}
                    key={k}
                  >
                    <div className={styles.contentContainer}>
                      <div>
                        {intl('common.tool.signatureHistory.sigCut')}: canonicalString
                        <pre>{i.canon}</pre>
                        {intl('common.tool.signatureHistory.link')}
                        <pre>{i?.url}</pre>
                      </div>
                    </div>
                  </CardContainer>
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

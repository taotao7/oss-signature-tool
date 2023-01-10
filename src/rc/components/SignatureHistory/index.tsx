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
                    <div style={{ marginBottom: '16px', color: '#808080' }}>
                      {intl('common.tool.signatureHistory.sigCut')}: canonicalString
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
            )}

            {!content?.timeStamp && <div className={styles.containerPlaceholder} />}

            <div className={styles.footer}>
              <div className={styles.collapseContent} onClick={onCollapseChange}>
                {showHistory ? (
                  <>
                    {intl('common.tool.signatureHistory.expand')}
                    <Icon type="collapse" />
                  </>
                ) : (
                  <>
                    {intl('common.tool.signatureHistory.collapse')}
                    <Icon type="expand" />
                  </>
                )}
              </div>
              <div className={styles.footerRight} onClick={clearAll}>
                {intl('common.tool.signatureHistory.clearAll')}
              </div>
            </div>
            {history.length <= 0 && showHistory && (
              <div className={styles.empty}>
                {intl('common.tool.signatureHistory.notHaveHistory')}
              </div>
            )}
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
                    <div>
                      <div>
                        <div style={{ marginBottom: '16px', color: '#808080' }}>
                          {intl('common.tool.signatureHistory.sigFunc')}: canonicalString
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
            )}

            {!content?.timeStamp && <div className={styles.containerPlaceholder} />}

            <div className={styles.footer}>
              <div className={styles.collapseContent} onClick={onCollapseChange}>
                {showHistory ? (
                  <>
                    {intl('common.tool.signatureHistory.expand')}
                    <Icon type="collapse" />
                  </>
                ) : (
                  <>
                    {intl('common.tool.signatureHistory.collapse')}
                    <Icon type="expand" />
                  </>
                )}
              </div>
              <div className={styles.footerRight} onClick={clearAll}>
                {intl('common.tool.signatureHistory.clearAll')}
              </div>
            </div>

            {history.length <= 0 && showHistory && (
              <div className={styles.empty}>
                {intl('common.tool.signatureHistory.notHaveHistory')}
              </div>
            )}
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
                <div>
                  <div>
                    <div style={{ marginBottom: '16px', color: '#808080' }}>
                      {intl('common.tool.signatureHistory.sigCut')}: canonicalString
                    </div>
                    <pre>{content?.canon}</pre>
                    <div className={styles.contentView}>
                      {intl('common.tool.signatureHistory.link')}
                    </div>
                    <pre style={{ marginBottom: '0px' }}>{content?.url}</pre>
                  </div>
                </div>
              </CardContainer>
            )}

            {!content?.timeStamp && <div className={styles.containerPlaceholder} />}

            <div className={styles.footer}>
              <div className={styles.collapseContent} onClick={onCollapseChange}>
                {showHistory ? (
                  <>
                    {intl('common.tool.signatureHistory.expand')}
                    <Icon type="collapse" />
                  </>
                ) : (
                  <>
                    {intl('common.tool.signatureHistory.collapse')}
                    <Icon type="expand" />
                  </>
                )}
              </div>
              <div className={styles.footerRight} onClick={clearAll}>
                {intl('common.tool.signatureHistory.clearAll')}
              </div>
            </div>

            {history.length <= 0 && showHistory && (
              <div className={styles.empty}>
                {intl('common.tool.signatureHistory.notHaveHistory')}
              </div>
            )}
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
                    <div>
                      <div>
                        <div style={{ marginBottom: '16px', color: '#808080' }}>
                          {intl('common.tool.signatureHistory.sigCut')}: canonicalString
                        </div>
                        <pre>{i.canon}</pre>
                        <div className={styles.contentView}>
                          {intl('common.tool.signatureHistory.link')}
                        </div>
                        <pre style={{ marginBottom: '0px' }}>{i?.url}</pre>
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

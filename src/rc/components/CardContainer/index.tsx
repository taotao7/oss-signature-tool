import React, { useState, MouseEventHandler } from 'react';
import { Icon } from '@alicloud/console-components';
import styles from './index.module.less';
import { AesSurvey, createAesInstance } from '@ali/aem-plugin';
import '@ali/aem-plugin/build/style.css';

interface CardContainer {
  collapse?: boolean;
  clearButton?: MouseEventHandler<HTMLElement>;
  content: string;
  children: JSX.Element;
  top?: boolean;

  submitTrue?: Function;
  submitFalse?: Function;
}

export default (props: CardContainer) => {
  const { collapse = false, clearButton, content, children, top = false } = props;

  const [showContent, setShowContent] = useState(collapse);

  createAesInstance({
    local: 'zh-cn',
    uid: (window as any)?.ALIYUN_OSS_CONSOLE_CONFIG?.USER_ID || 'anonymous',
  });

  const onCollapseChange = () => {
    setShowContent(!showContent);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardTitle}>
        <span
          style={{ color: '#333333', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}
        >
          {content}
        </span>
        <div className={styles.buttonPosition}>
          {!top && <Icon onClick={clearButton} type="delete" size="small" />}
          {!top && showContent && (
            <Icon type="collapse" onClick={onCollapseChange} className={styles.collapse} />
          )}
          {!top && !showContent && (
            <Icon type="expand" onClick={onCollapseChange} className={styles.collapse} />
          )}
        </div>
      </div>

      {showContent && <div className={styles.content}>{children}</div>}
      {top && (
        <div className={styles.footer}>
          <AesSurvey {...{ questionnaireId: 2375 }} />
        </div>
      )}
    </div>
  );
};

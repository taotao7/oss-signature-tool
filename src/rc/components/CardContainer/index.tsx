import React, { useState, MouseEventHandler, MouseEvent } from 'react';
import { Icon } from '@alicloud/console-components';
import styles from './index.module.less';
// @ts-ignore
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

  const onCollapseChange = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowContent(!showContent);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardTitle} onClick={onCollapseChange}>
        <span
          style={{ color: '#333333', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}
        >
          {content}
        </span>
        <div className={styles.buttonPosition}>
          {!top && <Icon onClick={clearButton} type="delete" size={16} />}
          {!top && showContent && <Icon type="collapse" size={16} className={styles.collapse} />}
          {!top && !showContent && <Icon type="expand" size={16} className={styles.collapse} />}
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

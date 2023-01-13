import React, { useState, MouseEventHandler, MouseEvent } from 'react';
import { Icon } from '@alicloud/console-components';
import styles from './index.module.less';
// @ts-ignore

interface CardContainer {
  collapse?: boolean;
  clearButton?: MouseEventHandler<HTMLElement>;
  content: string;
  children: JSX.Element;
  top?: boolean;
}

export default (props: CardContainer) => {
  const { collapse = false, clearButton, content, children, top = false } = props;

  const [showContent, setShowContent] = useState(collapse);

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
          {!top && <Icon onClick={clearButton} type="delete" size={12} />}
          {!top && showContent && <Icon type="collapse" size={12} className={styles.collapse} />}
          {!top && !showContent && <Icon type="expand" size={12} className={styles.collapse} />}
        </div>
      </div>

      {showContent && <div className={styles.content}>{children}</div>}
    </div>
  );
};

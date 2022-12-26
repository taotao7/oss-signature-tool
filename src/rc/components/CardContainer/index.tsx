import React, { useState, MouseEventHandler } from 'react';
import { Icon } from '@alicloud/console-components';
import styles from './index.module.less';

interface CardContainer {
  collapse?: boolean;
  clearButton: MouseEventHandler<HTMLElement>;
  content: string;
  children: JSX.Element;
}

export default (props: CardContainer) => {
  const { collapse = false, clearButton, content, children } = props;

  const [showContent, setShowContent] = useState(collapse);

  const onCollapseChange = () => {
    setShowContent(!showContent);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardTitle}>
        <span style={{ color: '#898989' }}> {content}</span>
        <div className={styles.buttonPosition}>
          <Icon onClick={clearButton} type="delete" className={styles.trash} />
          {showContent ? (
            <Icon type="collapse" onClick={onCollapseChange} />
          ) : (
            <Icon type="expand" onClick={onCollapseChange} />
          )}
        </div>
      </div>

      {showContent && <div className={styles.content}>{children}</div>}
    </div>
  );
};

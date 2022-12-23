import React, { useState, MouseEventHandler } from 'react';
import { Icon } from '@alicloud/console-components';
import './index.less';

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
    <div className="container">
      <div className="cardTitle">
        <span style={{ color: '#898989' }}> {content}</span>
        <div className="buttonPosition">
          <Icon onClick={clearButton} type="delete" className="trash" />
          {showContent ? (
            <Icon type="collapse" onClick={onCollapseChange} />
          ) : (
            <Icon type="expand" onClick={onCollapseChange} />
          )}
        </div>
      </div>

      {showContent && <div className="content">{children}</div>}
    </div>
  );
};

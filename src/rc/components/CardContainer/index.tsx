import React, { useState, MouseEventHandler } from 'react';
import { Icon, Button } from '@alicloud/console-components';
import styles from './index.module.less';

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
  const {
    collapse = false,
    clearButton,
    content,
    children,
    top = false,
    submitFalse = () => {},
    submitTrue = () => {},
  } = props;

  const [showContent, setShowContent] = useState(collapse);

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
          <Button size="small" onClick={() => submitTrue()}>
            <Icon>
              <svg
                //@ts-ignore
                t="1672299672346"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5236"
                width="16"
                height="16"
                fill="#696969"
              >
                <path
                  d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z"
                  p-id="5237"
                ></path>
              </svg>
            </Icon>
            有帮助
          </Button>
          <Button size="small" onClick={() => submitFalse()}>
            <Icon>
              <svg
                //@ts-ignore
                t="1672299672346"
                className="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5236"
                width="16"
                height="16"
                transform="rotate(180)"
                fill="#696969"
              >
                <path
                  d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z"
                  p-id="5237"
                ></path>
              </svg>
            </Icon>
            无帮助
          </Button>
        </div>
      )}
    </div>
  );
};

import React, { cloneElement } from 'react';
import StandardSignature from './StandardSignature';
import PostObjectSignature from './PostObjectSignature';
import SignatureUrl from './SignatureUrl';
import { Tab, ConfigProvider, Icon, Balloon } from '@alicloud/console-components';
import intl from '../intl';
import styles from './index.module.less';
import './xconsole.scss';

const tabs = [
  {
    tab: (
      <div className={styles.tabTitle}>
        {intl('common.tool.standardSig')}
        <Balloon
          closable={false}
          type="primary"
          triggerType="hover"
          trigger={
            <Icon
              type="question-circle"
              size={12}
              style={{ marginLeft: '4px', paddingTop: '4px' }}
            />
          }
        >
          {intl('common.tool.standardTip')}
          <a href="https://help.aliyun.com/document_detail/31951.html" target="_blank">
            <span style={{ color: '#0064C8' }}>{intl('common.tool.standardTip.link')}</span>
          </a>
        </Balloon>
      </div>
    ),
    key: 'standard',
    content: <StandardSignature />,
  },
  {
    tab: (
      <div className={styles.tabTitle}>
        {intl('common.tool.postSig')}
        <Balloon
          closable={false}
          type="primary"
          triggerType="hover"
          trigger={
            <Icon
              type="question-circle"
              size={12}
              style={{ marginLeft: '4px', paddingTop: '4px' }}
            />
          }
        >
          {intl('common.tool.postPolicyTip')}
          <a href="https://help.aliyun.com/document_detail/31988.htm" target="_blank">
            <span style={{ color: '#0064C8' }}>PostObject</span>
          </a>
        </Balloon>
      </div>
    ),
    key: 'post',
    content: <PostObjectSignature />,
  },
  {
    tab: (
      <div className={styles.tabTitle}>
        {intl('common.tool.sigUrl')}
        <Balloon
          closable={false}
          type="primary"
          triggerType="hover"
          trigger={
            <Icon
              type="question-circle"
              size={12}
              style={{ marginLeft: '4px', paddingTop: '4px' }}
            />
          }
        >
          {intl('common.tool.sigUrlTip')}
          <a href="https://help.aliyun.com/document_detail/31952.html" target="_blank">
            <span style={{ color: '#0064C8' }}> {intl('common.tool.sigUrlTip.link')}</span>
          </a>
        </Balloon>
      </div>
    ),
    key: 'sigUrl',
    content: <SignatureUrl />,
  },
];

export default (props: any) => {
  return (
    <ConfigProvider prefix={CSS_PREFIX}>
      <Tab shape="wrapped">
        {tabs.map((i) => (
          <Tab.Item key={i.key} title={i.tab}>
            {cloneElement(i.content, { ...props })}
          </Tab.Item>
        ))}
      </Tab>
    </ConfigProvider>
  );
};

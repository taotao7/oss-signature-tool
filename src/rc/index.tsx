import React from 'react';
import StandardSignature from './StandardSignature';
import PostObjectSignature from './PostObjectSignature';
import SignatureUrl from './SignatureUrl';
import { Tab } from '@alicloud/console-components';
import '@alicloud/console-components/dist/xconsole.css';

const tabs = [
  {
    tab: '标准签名',
    key: 'standard',
    content: <StandardSignature />,
  },
  {
    tab: 'PostObject签名',
    key: 'post',
    content: <PostObjectSignature />,
  },
  {
    tab: '获取签名链接',
    key: 'sigUrl',
    content: <SignatureUrl />,
  },
];

export default () => {
  return (
    <Tab shape="wrapped">
      {tabs.map((i) => (
        <Tab.Item key={i.key} title={i.tab}>
          {i.content}
        </Tab.Item>
      ))}
    </Tab>
  );
};

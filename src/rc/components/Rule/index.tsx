import React from 'react';
import { Message } from '@alicloud/console-components';

export default (props: { types: string }) => {
  const { types } = props;
  if (types === 'standard') {
    return (
      <Message type="notice">
        签名构成
        <pre>{` Signature = base64(hmac-sha1(AccessKeySecret,
            VERB + "\\n"
            + Content-MD5 + "\\n"
            + Content-Type + "\\n"
            + Date + "\\n"
            + CanonicalizedOSSHeaders
            + CanonicalizedResource))

Authorization = "OSS " + AccessKeyId + ":" + Signature `}</pre>
      </Message>
    );
  }
  if (types === 'postObject') {
    return (
      <Message type="notice">
        签名构成
        <pre>{` Signature = base64(hmac-sha1(base64(policy),AccessKeySecret))`}</pre>
      </Message>
    );
  }

  return <></>;
};

import React from "react";
import { Message } from "@alicloud/console-components";
import styles from "./index.module.less";

export default () => (
  <Message type="notice">
    签名构成
    <pre className={styles.pre}>{`
Signature = base64(hmac-sha1(AccessKeySecret,
            VERB + "\\n"
            + Content-MD5 + "\\n" 
            + Content-Type + "\\n" 
            + Date + "\\n" 
            + CanonicalizedOSSHeaders
            + CanonicalizedResource))
            
Authorization = "OSS " + AccessKeyId + ":" + Signature
                `}</pre>
  </Message>
);

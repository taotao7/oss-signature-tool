import AceEditor from 'react-ace';
import { Balloon, Form, Icon } from '@alicloud/console-components';
import React from 'react';
import { formItemLayout } from '../../utils';
import styles from './index.module.less';

const FormItem = Form.Item;

interface JsonEditor {
  onPolicyChange: any;
  policyData: string;
}

export default (props: JsonEditor) => {
  const { onPolicyChange, policyData } = props;

  return (
    <FormItem
      label={
        <div className={styles.label}>
          Policy
          <Balloon
            closable={false}
            triggerType="hover"
            trigger={
              <Icon
                className={styles.icon}
                type="help_fill"
                size="small"
                onClick={() => {
                  window.open('https://help.aliyun.com/document_detail/31988.html');
                }}
              />
            }
          >
            点击查看更多Policy选项
          </Balloon>
        </div>
      }
      {...formItemLayout}
    >
      <AceEditor
        mode="json"
        onChange={onPolicyChange}
        name="Policy"
        // editorProps={{ $blockScrolling: true }}
        value={policyData}
        width="70%"
        height="20vw"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </FormItem>
  );
};
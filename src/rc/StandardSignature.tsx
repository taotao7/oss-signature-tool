import React, { useEffect, useState } from 'react';
import RuleBox from './components/Rule';
import HeadersInput from './components/HeaderInput';
import ResourceInput from './components/Resource';
import SignatureHistory from './components/SignatureHistory';
import { Form, Input, Select, DatePicker } from '@alicloud/console-components';
import Split from './components/Split';
import {
  methods,
  formItemLayout,
  authorization as getAuth,
  formatForm,
  formatHeaders,
  formatResource,
  getFromStorage,
  saveToStorage,
  computeSignature,
  toGMT,
} from './utils';
import { FormValue, HistoryLog, PageIndex } from './types';
import moment from 'moment';
import styles from './index.module.less';

const { Option } = Select;
const FormItem = Form.Item;

export default (props: PageIndex) => {
  const { hide = true } = props;
  const [dateField, setDateField] = useState<string>(new Date().toUTCString());
  const [headersData, setHeadersData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);

  useEffect(() => {
    const logs = getFromStorage('sig-standard');
    setHistoryLog(logs);
  }, []);

  const submit = (v: FormValue, e: any) => {
    if (!e) {
      // render to process
      const canon = formatForm({
        ...v,
        Date: toGMT(dateField),
        headers: formatHeaders(headersData),
        resource: formatResource(resourceData),
      });
      const auth = getAuth(v.AccessKeyId, v.AccessKeySecret, canon);
      const signature = computeSignature(v.AccessKeySecret, canon);

      const history: HistoryLog[] | [] = historyLog;
      if (history instanceof Array) {
        history.unshift({
          timeStamp: new Date().valueOf(),
          auth,
          canon,
          signature,
          AccessKeyId: v.AccessKeyId,
          AccessKeySecret: v.AccessKeySecret,
        });
        setHistoryLog([...history]);
        saveToStorage(`sig-standard`, JSON.stringify(history));
      }
    }
  };

  return (
    <>
      {!hide && <RuleBox types="standard" />}
      <div className={styles.layout}>
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            <Split title="密钥">
              <FormItem label="AccessKeyId" required {...formItemLayout}>
                <Input placeholder="必填" name="AccessKeyId" />
              </FormItem>
              <FormItem label="AccessKeySecret" required {...formItemLayout}>
                <Input placeholder="必填" name="AccessKeySecret" />
              </FormItem>
            </Split>

            <Split title="参数">
              <FormItem label="VERB" required {...formItemLayout}>
                <Select placeholder="请求方法" name="Method" defaultValue="GET">
                  {methods.map((v) => (
                    <Option key={v} value={v}>
                      {v}
                    </Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem
                label="Content-MD5"
                {...formItemLayout}
                help="请求内容数据的MD5值，例如: eB5eJF1ptWaXm4bijSPyxw==，也可以为空"
              >
                <Input name="ContentMD5" />
              </FormItem>
              <FormItem
                label="ContentType"
                {...formItemLayout}
                help="请求内容的类型，例如: application/octet-stream，也可以为空"
              >
                <Input name="ContentType" />
              </FormItem>
            </Split>

            <Split title="其他" hide>
              <FormItem label="Date" {...formItemLayout}>
                <DatePicker
                  showTime
                  name="Date"
                  onChange={(v) => {
                    setDateField(new Date(v as string).toUTCString());
                  }}
                  value={moment(dateField)}
                />
              </FormItem>
              <HeadersInput
                dateField={dateField}
                setHeadersData={setHeadersData}
                prefix="standard"
              />
              <ResourceInput setResourceData={setResourceData} />
            </Split>

            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                提交
              </Form.Submit>
            </FormItem>
          </Form>
        </div>

        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory
              history={historyLog}
              prefix="standard"
              setHistoryLog={setHistoryLog}
            />
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { Dialog, Form, Input, NumberPicker } from '@alicloud/console-components';
import Split from './components/Split';
import {
  buildUrl,
  computeSignature,
  formatForm,
  formatResource,
  formItemLayout,
  formatHeaders,
  saveToStorage,
  getFromStorage,
} from './utils';
import { FormValue, HistoryLog, ResourceData } from './types';
import ResourceInput from './components/Resource';
import HeadersInput from './components/HeaderInput';
import SignatureHistory from './components/SignatureHistory';
import styles from './index.module.less';
import moment from 'moment';
// import intl from '../intl';

const FormItem = Form.Item;

export default () => {
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [headersData, setHeadersData] = useState([]);
  const [expireTime, setExpriretime] = useState<number>(300);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);

  useEffect(() => {
    const logs = getFromStorage('sig-sigUrl');
    setHistoryLog(logs);
  }, []);

  // signature
  const sig = (canon: string, sk: string): string => {
    return computeSignature(sk, canon);
  };

  const submit = (v: FormValue, e: any): any => {
    if (!e) {
      // @ts-ignore
      if (!resourceData[0].value || !resourceData[1].value) {
        return Dialog.alert({
          title: '警告',
          content: <>必须填写bucket 和 object名称</>,
        });
      }

      const resource = formatResource(resourceData);
      const headers = formatHeaders(headersData);
      const date = moment().unix() + expireTime;

      const canonicalString = formatForm({
        ...v,
        Method: 'GET',
        Date: date,
        headers,
        resource,
      });

      const signature = sig(canonicalString, v.AccessKeySecret);

      if (signature.includes('+')) {
        return submit(v, null);
      }
      const queryArr = resourceData.filter((i) => !['bucket', 'object'].includes(i.key));
      const query = queryArr.map((i) => `&${i.key}=${i.value}`).join('');

      const url = buildUrl(
        v.AccessKeyId,
        resourceData[0].value,
        v.Region as string,
        signature,
        resourceData[1].value,
        date,
        v.STSToken as string,
        query,
      );

      const history: HistoryLog[] | [] = historyLog;
      if (history instanceof Array) {
        history.unshift({
          timeStamp: new Date().valueOf(),
          canon: canonicalString,
          url,
        });
        setHistoryLog([...history]);
        saveToStorage(`sig-sigUrl`, JSON.stringify(history));
      }
    }
  };

  const onExpireTimeChange = (v: number) => {
    setExpriretime(v);
  };

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            <Split title="密钥">
              <FormItem {...formItemLayout} label="AccessKeyId" required>
                <Input placeholder="必填" name="AccessKeyId" />
              </FormItem>

              <FormItem {...formItemLayout} label="AccessKeySecret" required>
                <Input placeholder="必填" name="AccessKeySecret" />
              </FormItem>
            </Split>

            <Split title="其他必填">
              <FormItem {...formItemLayout} label="Bucket Region" required>
                <Input placeholder="必填" name="Region" />
              </FormItem>

              <FormItem {...formItemLayout} label="过期时间(s)" required help="默认5分钟">
                <NumberPicker name="Expiration" value={expireTime} onChange={onExpireTimeChange} />
              </FormItem>

              <ResourceInput setResourceData={setResourceData} required />
            </Split>

            <Split title="其他可选" hide>
              <FormItem
                {...formItemLayout}
                label="Content-MD5"
                help="请求内容数据的MD5值，例如: eB5eJF1ptWaXm4bijSPyxw==，也可以为空"
              >
                <Input name="ContentMD5" />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Content-Type"
                help="请求内容的类型，例如: application/octet-stream，也可以为空"
              >
                <Input name="ContentType" />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Security-Token"
                help="如果是STS服务生成的请输入STSToken"
              >
                <Input name="STSToken" />
              </FormItem>

              <HeadersInput setHeadersData={setHeadersData} prefix="sigUrl" />
            </Split>

            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                提交
              </Form.Submit>
              {'  '}
              <Form.Reset
                names={['AccessKeyId', 'AccessKeySecret', 'Expiration', 'Region', 'STSToken']}
              >
                清空
              </Form.Reset>
            </FormItem>
          </Form>
        </div>

        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory history={historyLog} prefix="sigUrl" setHistoryLog={setHistoryLog} />
          </div>
        </div>
      </div>
    </>
  );
};

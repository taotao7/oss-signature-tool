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
import intl from '../intl';
import ResourceInput from './components/Resource';
import HeadersInput from './components/HeaderInput';
import SignatureHistory from './components/SignatureHistory';
import styles from './index.module.less';
import moment from 'moment';

const FormItem = Form.Item;
let countCallback: number = 0;

export default () => {
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [headersData, setHeadersData] = useState([]);
  const [expireTime, setExpireTime] = useState<number>(300);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [layout, setLayout] = useState<string>(window.innerWidth > 650 ? 'layout' : 'layoutColumn');
  const [currentHistory, setCurrentHistory] = useState<HistoryLog>({});
  const [resourcePath, setResourcePath] = useState<string>();

  useEffect(() => {
    const logs = getFromStorage('sig-sigUrl');
    setHistoryLog(logs);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', changeLayout);
    return () => window.removeEventListener('resize', changeLayout);
  }, []);

  const changeLayout = () => {
    const layoutHW: HTMLElement = document.getElementById('layout') as HTMLElement;
    if (layoutHW.offsetWidth < 650) {
      setLayout('layoutColumn');
    }
    if (layoutHW.offsetWidth > 650) {
      setLayout('layout');
    }
  };

  // signature
  const sig = (canon: string, sk: string): string => {
    return computeSignature(sk, canon);
  };

  const submit = (v: FormValue, e: any): any => {
    if (!e) {
      // @ts-ignore
      if (!resourceData[0].value || !resourceData[1].value) {
        return Dialog.alert({
          title: intl('common.tool.warning'),
          content: <>{intl('common.tool.warning.sigUrl.bucketAndObject')}</>,
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

      if (signature.includes('+') && 50 > countCallback) {
        countCallback += 1;
        return submit(v, null);
      }
      countCallback = 0;

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
        setCurrentHistory(history[0]);
        saveToStorage(`sig-sigUrl`, JSON.stringify(history));
      }
    }
  };

  const onExpireTimeChange = (v: number) => {
    setExpireTime(v);
  };

  return (
    <>
      <div className={styles[layout]} id="layout">
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            <Split title={intl('common.tool.privateKey')} content={intl('common.tooltip.akAndSk')}>
              <FormItem {...formItemLayout} label="AccessKeyId" required>
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeyId" />
              </FormItem>

              <FormItem {...formItemLayout} label="AccessKeySecret" required>
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeySecret" />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Security-Token"
                help={intl('common.tool.tooltip.stsToken')}
              >
                <Input name="STSToken" placeholder={intl('common.tooltip.input')} />
              </FormItem>
            </Split>

            <Split title={intl('common.tool.otherMust')}>
              <FormItem {...formItemLayout} label="Bucket Region" required>
                <Input placeholder={intl('common.tooltip.input')} name="Region" />
              </FormItem>

              <FormItem {...formItemLayout} label={intl('common.tool.expireTime.s')} required>
                <NumberPicker name="Expiration" value={expireTime} onChange={onExpireTimeChange} />
                <Input
                  style={{ width: '40px', borderLeft: '0' }}
                  disabled
                  value={intl('common.tool.second')}
                />
              </FormItem>

              <div style={{ marginLeft: '21%' }}>{resourcePath}</div>
              <ResourceInput
                setResourceData={setResourceData}
                required
                setResourcePath={(v: any) => {
                  setResourcePath(formatResource(v));
                }}
              />
            </Split>

            <Split title={intl('common.tool.other')} hide>
              <FormItem
                {...formItemLayout}
                label="Content-MD5"
                help={intl('common.tool.contentMD5.helper')}
              >
                <Input name="ContentMD5" placeholder={intl('common.tooltip.input')} />
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Content-Type"
                help={intl('common.tool.contentType.helper')}
              >
                <Input name="ContentType" placeholder={intl('common.tooltip.input')} />
              </FormItem>

              <HeadersInput setHeadersData={setHeadersData} prefix="sigUrl" />
            </Split>

            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                {intl('common.tool.generateUrl')}
              </Form.Submit>
            </FormItem>
          </Form>
        </div>

        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory
              history={historyLog}
              prefix="sigUrl"
              setHistoryLog={setHistoryLog}
              content={currentHistory}
              clearContent={setCurrentHistory}
            />
          </div>
        </div>
      </div>
    </>
  );
};

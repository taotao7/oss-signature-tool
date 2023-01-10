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
import intl from '../intl';
import { FormValue, HistoryLog, PageIndex } from './types';
import { cloneDeep } from 'lodash';
import styles from './index.module.less';

const { Option } = Select;
const FormItem = Form.Item;

export default (props: PageIndex) => {
  const { hide = true } = props;
  const [dateField, setDateField] = useState<string>();
  const [headersData, setHeadersData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [layout, setLayout] = useState<string>(window.innerWidth > 750 ? 'layout' : 'layoutColumn');
  const [currentHistory, setCurrentHistory] = useState<HistoryLog>({});
  const [resourcePath, setResourcePath] = useState<string>();

  useEffect(() => {
    const logs = getFromStorage('sig-standard');
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

  const submit = (v: FormValue, e: any) => {
    if (!e) {
      const tempHeadersData = cloneDeep(headersData);

      // if have sts token
      if (v?.STSToken) {
        // @ts-ignore
        tempHeadersData.push({
          index: tempHeadersData.length,
          key: 'security-token',
          value: v.STSToken,
        });
      }
      const resource = formatResource(resourceData);

      // render to process
      const canon = formatForm({
        ...v,
        Date: dateField ? toGMT(dateField) : toGMT(new Date().toUTCString()),
        headers: formatHeaders(tempHeadersData),
        resource,
      });
      const auth = getAuth(v.AccessKeyId, v.AccessKeySecret, canon);
      const signature = computeSignature(v.AccessKeySecret, canon);
      setResourcePath(resource);

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
        setCurrentHistory(history[0]);
        saveToStorage(`sig-standard`, JSON.stringify(history));
      }
    }
  };

  return (
    <>
      {!hide && <RuleBox types="standard" />}
      <div className={styles[layout]} id="layout">
        <div className={styles.form}>
          <div style={{ float: 'right' }}>
            <a target="_blank" href="https://help.aliyun.com/document_detail/31951.html">
              help
            </a>
          </div>
          <Form useLabelForErrorMessage>
            <Split title={intl('common.tool.privateKey')} content={intl('common.tooltip.akAndSk')}>
              <FormItem label="AccessKeyId" required {...formItemLayout}>
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeyId" />
              </FormItem>
              <FormItem label="AccessKeySecret" required {...formItemLayout}>
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeySecret" />
              </FormItem>
              <FormItem label="Security-Token" {...formItemLayout}>
                <Input placeholder={intl('common.tooltip.input')} name="STSToken" />
              </FormItem>
            </Split>

            <Split title={intl('common.tool.param')}>
              <FormItem label="VERB" required {...formItemLayout}>
                <Select placeholder={intl('common.tool.method')} name="Method" defaultValue="GET">
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
                help={intl('common.tool.contentMD5.helper')}
              >
                <Input name="ContentMD5" placeholder={intl('common.tooltip.input')} />
              </FormItem>
              <FormItem
                label="Content-Type"
                {...formItemLayout}
                help={intl('common.tool.contentType.helper')}
              >
                <Input name="ContentType" placeholder={intl('common.tooltip.input')} />
              </FormItem>
            </Split>

            <Split title={intl('common.tool.other')} hide>
              <FormItem label="Date" {...formItemLayout} required>
                <DatePicker
                  style={{ minWidth: '300px' }}
                  format={`YYYY${intl('common.tool.signatureHistory.year')}MM${intl(
                    'common.tool.signatureHistory.month',
                  )}DD${intl('common.tool.signatureHistory.day')}`}
                  // format={`ddd MMM DD YYYY HH:mm:ss [GMT]Z`}
                  hasClear={false}
                  showTime
                  name="Date"
                  onChange={(v) => {
                    if (v) {
                      setDateField(new Date(v as string).toUTCString());
                    } else {
                      setDateField('');
                    }
                  }}
                />
              </FormItem>
              <HeadersInput
                dateField={dateField}
                setHeadersData={setHeadersData}
                prefix="standard"
              />
              <div style={{ marginLeft: '21%' }}>{resourcePath}</div>
              <ResourceInput
                setResourceData={setResourceData}
                setResourcePath={(v: any) => {
                  setResourcePath(formatResource(v));
                }}
              />
            </Split>

            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                {intl('common.tool.generateSig')}
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
              content={currentHistory}
              clearContent={setCurrentHistory}
            />
          </div>
        </div>
      </div>
    </>
  );
};

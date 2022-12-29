import React, { useEffect, useState } from 'react';
import RuleBox from './components/Rule';
import crypto from 'crypto-js';
import JsonEditor from './components/JsonEditor';
import SignatureHistory from './components/SignatureHistory';
import Split from './components/Split';
import { DatePicker, Form, Input } from '@alicloud/console-components';
import { getFromStorage, saveToStorage, formItemLayout } from './utils';
import { FormValue, HistoryLog, PageIndex } from './types';
import intl from '../intl';
import moment from 'moment';
import 'ace-builds/src-noconflict/mode-json';
import styles from './index.module.less';

const FormItem = Form.Item;

export default (props: PageIndex) => {
  const { hide = true } = props;
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [expirationDate, setExpirationDate] = useState<string>(moment().toISOString());
  const [policyData, setPolicyData] = useState<string>(
    JSON.stringify(
      {
        expiration: expirationDate,
        conditions: [['content-length-range', 0, 1048576000]],
      },
      null,
      4,
    ),
  );
  const [layout, setLayout] = useState<string>(window.innerWidth > 750 ? 'layout' : 'layoutColumn');
  const [currentHistory, setCurrentHistory] = useState<HistoryLog>({});

  useEffect(() => {
    const logs = getFromStorage('sig-postObject');
    setHistoryLog(logs);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', changeLayout);
    return () => window.removeEventListener('resize', changeLayout);
  }, []);

  const changeLayout = () => {
    if (window.innerWidth < 750) {
      setLayout('layoutColumn');
    }
    if (window.innerWidth > 750) {
      setLayout('layout');
    }
  };

  const onPolicyChange = (v: any) => {
    setPolicyData(v);
  };
  const onDateChange = (v: any) => {
    setExpirationDate(v);
    const temp = JSON.parse(policyData);
    temp.expiration = moment(v).toISOString();
    setPolicyData(JSON.stringify(temp, null, 4));
  };

  const PostObjectSignature = (v: any) => {
    const history: HistoryLog[] = historyLog;
    const canon = policyData;
    const signature = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policyData));
    const auth = crypto.enc.Base64.stringify(crypto.HmacSHA1(signature, v.AccessKeySecret));

    if (history instanceof Array) {
      history.unshift({
        timeStamp: moment().valueOf(),
        auth,
        signature,
        canon,
        AccessKeyId: v.AccessKeyId,
        AccessKeySecret: v.AccessKeySecret,
      });
      setHistoryLog([...history]);
      setCurrentHistory(history[0]);
      saveToStorage('sig-postObject', JSON.stringify(history));
    }
  };

  const submit = (v: FormValue, e: any) => {
    if (!e) {
      PostObjectSignature(v);
    }
  };

  return (
    <>
      {!hide && <RuleBox types="postObject" />}
      <div className={styles[layout]}>
        <div className={styles.form}>
          <Form useLabelForErrorMessage {...formItemLayout}>
            <Split title={intl('common.tool.privateKey')} content={intl('common.tooltip.akAndSk')}>
              <FormItem {...formItemLayout} required label="AccessKeyId">
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeyId" />
              </FormItem>
              <FormItem {...formItemLayout} required label="AccessKeySecret">
                <Input placeholder={intl('common.tooltip.input')} name="AccessKeySecret" />
              </FormItem>
            </Split>
            <Split title={intl('common.tool.other')} hide>
              <FormItem
                {...formItemLayout}
                required
                label="Expiration Date"
                help={<span className={styles.hint}>{intl('common.tool.policy.tooltip')}</span>}
              >
                <DatePicker
                  showTime
                  name="Expiration"
                  onChange={onDateChange}
                  defaultValue={moment(expirationDate)}
                />
              </FormItem>

              <JsonEditor onPolicyChange={onPolicyChange} policyData={policyData} />
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
              prefix="postObject"
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

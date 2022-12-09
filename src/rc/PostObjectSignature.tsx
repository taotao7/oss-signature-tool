import React, { useEffect, useState } from 'react';
import RuleBox from './components/Rule';
import crypto from 'crypto-js';
import JsonEditor from './components/JsonEditor';
import SignatureHistory from './components/SignatureHistory';
import SignatureStep from './components/SignatureStep';
import { DatePicker, Form, Input, Dialog } from '@alicloud/console-components';
import styles from './index.module.less';
import { getFromStorage, saveToStorage } from './utils';
import { FormValue, HistoryLog, PageIndex, SigProcessData } from './types';
import moment from 'moment';
import 'ace-builds/src-noconflict/mode-json';

const FormItem = Form.Item;

export default (props: PageIndex) => {
  const { hide = false } = props;
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [sigProcessData, setSigProcessData] = useState<SigProcessData>({
    canon: '',
    AccessKeySecret: '',
    AccessKeyId: '',
    auth: '',
  });
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

  useEffect(() => {
    const logs = getFromStorage('sig-postObject');
    setHistoryLog(logs);
    if (logs.length > 0) {
      // display first log process
      setSigProcessData(logs[logIndex]);
    }
  }, [localStorage.getItem('sig-postObject'), logIndex]);

  const onPolicyChange = (v: any) => {
    setPolicyData(v);
  };
  const onDateChange = (v: any) => {
    setExpirationDate(v);
    const temp = JSON.parse(policyData);
    temp.expiration = moment(v).toISOString();
    setPolicyData(JSON.stringify(temp, null, 4));
  };

  const itemConfig = [
    {
      label: 'AccessKeyId',
      content: <Input placeholder="必填" name="AccessKeyId" />,
      required: true,
    },
    {
      label: 'AccessKeySecret',
      required: true,
      content: <Input placeholder="必填" name="AccessKeySecret" />,
    },
    {
      label: (
        <>
          Expiration Date <span className={styles.hint}>选择过期时间后会自动填充到Policy</span>{' '}
        </>
      ),
      required: true,
      content: (
        <DatePicker
          showTime
          placeholder="必填"
          name="Expiration"
          onChange={onDateChange}
          defaultValue={moment(expirationDate)}
        />
      ),
    },
  ];

  const PostObjectSignature = (v: any) => {
    const history: HistoryLog[] = getFromStorage('sig-postObject');
    const canon = policyData;
    const auth = crypto.enc.Base64.stringify(
      crypto.HmacSHA1(
        crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(policyData)),
        v.AccessKeySecret,
      ),
    );
    history.unshift({
      timeStamp: moment().valueOf(),
      auth,
      canon,
      AccessKeyId: v.AccessKeyId,
      AccessKeySecret: v.AccessKeySecret,
    });
    setLogIndex(0);
    setSigProcessData(history[0]);
    saveToStorage('sig-postObject', JSON.stringify(history));
  };

  const submit = (v: FormValue, e: any) => {
    if (!e) {
      PostObjectSignature(v);
      setVisible(true);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <>
      {!hide && <RuleBox types="postObject" />}
      <div className={styles.layout}>
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            {itemConfig.map((i, k) => (
              <FormItem label={i.label} required={i.required} key={k}>
                {i.content}
              </FormItem>
            ))}
            <JsonEditor onPolicyChange={onPolicyChange} policyData={policyData} />
            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                提交
              </Form.Submit>
              {'  '}
              <Form.Reset
                names={['AccessKeyId', 'AccessKeySecret', 'METHOD', 'ContentMD5', 'ContentType']}
              >
                清空
              </Form.Reset>
            </FormItem>
          </Form>
        </div>

        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory
              history={historyLog}
              prefix="postObject"
              setHistoryLog={setHistoryLog}
              setLogIndex={setLogIndex}
              logIndex={logIndex}
            />
          </div>
          <div className={styles.step}>
            <SignatureStep sigProcessData={sigProcessData} prefix="postObject" />
          </div>
        </div>
        <Dialog
          visible={visible}
          style={{ width: '800px' }}
          height="55vh"
          title="签名信息"
          closeMode={visible ? ['close', 'esc', 'mask'] : ['close', 'esc']}
          onOk={onCancel}
          onCancel={onCancel}
          onClose={onCancel}
        >
          {sigProcessData?.auth && (
            <div className={styles.diaLogContent}>
              <h3>policy:</h3>
              <pre>{sigProcessData.canon}</pre>
              <h3>authorization:</h3>
              <pre>{sigProcessData.auth}</pre>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

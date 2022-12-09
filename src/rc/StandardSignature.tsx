import React, { useEffect, useState } from 'react';
import RuleBox from './components/Rule';
import DatePicker from './components/DatePicker';
import Signature from './components/Signature';
import HeadersInput from './components/HeaderInput';
import ResourceInput from './components/Resource';
import SignatureHistory from './components/SignatureHistory';
import SignatureStep from './components/SignatureStep';
import { Form, Input, Select } from '@alicloud/console-components';
import styles from './index.module.less';
import { getFromStorage, methods } from './utils';
import { FormValue, HistoryLog, SigProcessData, PageIndex } from './types';

const { Option } = Select;
const FormItem = Form.Item;


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
    label: 'VERB',
    required: true,
    content: (
      <Select placeholder="请求的Method" name="Method" defaultValue="GET">
        {methods.map((_) => (
          <Option key={_} value={_}>
            {_}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    label: 'Content-MD5',
    content: (
      <Input
        placeholder="请求内容数据的MD5值，例如: eB5eJF1ptWaXm4bijSPyxw==，也可以为空"
        name="ContentMD5"
      />
    ),
  },
  {
    label: 'Content-Type',
    name: 'ContentType',
    content: (
      <Input
        placeholder="请求内容的类型，例如: application/octet-stream，也可以为空"
        name="ContentType"
      />
    ),
  },
];

export default (props: PageIndex) => {
  const { hide = false } = props;
  const [formValue, setFormValue] = useState<FormValue>({
    AccessKeyId: '',
    AccessKeySecret: '',
    Method: '',
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [dateField, setDateField] = useState<string>('');
  const [headersData, setHeadersData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);
  const [sigProcessData, setSigProcessData] = useState<SigProcessData>({
    canon: '',
    AccessKeySecret: '',
    AccessKeyId: '',
  });
  const [logIndex, setLogIndex] = useState<number>(0);

  useEffect(() => {
    const logs = getFromStorage('sig-standard');
    setHistoryLog(logs);
    if (logs.length > 0) {
      // display first log process
      setSigProcessData(logs[logIndex]);
    }
  }, [localStorage.getItem('sig-standard'), logIndex]);


  const submit = (v: FormValue, e: any) => {
    if (!e) {
      setFormValue(v);
      setVisible(true);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onDateFieldChange = (v: string) => {
    setDateField(v);
  };

  return (
    <>
      {!hide && <RuleBox types="standard" />}
      <div className={styles.layout}>
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            {itemConfig.map((i, k) => (
              <FormItem label={i.label} required={i.required} key={k}>
                {i.content}
              </FormItem>
            ))}
            <DatePicker onDateFieldChange={onDateFieldChange} dateField={dateField} />
            <HeadersInput dateField={dateField} setHeadersData={setHeadersData} prefix="standard" />
            <ResourceInput setResourceData={setResourceData} />
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

        <Signature
          visible={visible}
          onCancel={onCancel}
          formValue={formValue}
          dateField={dateField}
          headersData={headersData}
          resourceData={resourceData}
          setHistoryLog={setHistoryLog}
          setSigProcessData={setSigProcessData}
          setLogIndex={setLogIndex}
          prefix="standard"
        />
        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory
              history={historyLog}
              prefix="standard"
              setHistoryLog={setHistoryLog}
              setLogIndex={setLogIndex}
              logIndex={logIndex}
            />
          </div>
          <div className={styles.step}>
            <SignatureStep sigProcessData={sigProcessData} prefix="standard" />
          </div>
        </div>
      </div>
    </>
  );
};

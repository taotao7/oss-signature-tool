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
import { getFromStorage } from './utils';

interface IFormValue {
  AccessKeyId: string;
  AccessKeySecret: string;
  Method: string;
  ContentType?: string;
  ContentMD5?: string;
}

const { Option } = Select;
const FormItem = Form.Item;

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];

export interface StandardSignatureType {
  hide?: boolean;
}

export interface historyType {
  timeStamp: number;
  auth: string;
  canon: string;
}

export default (props: StandardSignatureType) => {
  const { hide = true } = props;
  const [formValue, setFormValue] = useState<IFormValue>({
    AccessKeyId: '',
    AccessKeySecret: '',
    Method: '',
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [dateField, setDateField] = useState<string>('');
  const [headersData, setHeadersData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [historyLog, setHistoryLog] = useState<historyType[]>([]);

  useEffect(() => {
    setHistoryLog(getFromStorage('sig-standard'));
  }, [localStorage.getItem('sig-standard')]);

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

  const submit = (v: IFormValue, e: any) => {
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
      {!hide && <RuleBox />}
      <div className={styles.layout}>
        <div className={styles.form}>
          <Form useLabelForErrorMessage>
            {itemConfig.map((i, k) => (
              <FormItem label={i.label} required={i.required} key={k}>
                {i.content}
              </FormItem>
            ))}
            <DatePicker onDateFieldChange={onDateFieldChange} dateField={dateField} />
            <HeadersInput dateField={dateField} setHeadersData={setHeadersData} />
            <ResourceInput setResourceData={setResourceData} />
            <FormItem>
              <Form.Submit validate type="primary" onClick={submit}>
                提交
              </Form.Submit>
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
          prefix="standard"
        />
        <div className={styles.view}>
          <div className={styles.history}>
            <SignatureHistory history={historyLog} />
          </div>
          <div className={styles.step}>
            <SignatureStep />
          </div>
        </div>
      </div>
    </>
  );
};

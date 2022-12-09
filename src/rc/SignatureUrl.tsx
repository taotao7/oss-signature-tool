import React, {useState} from 'react';
import {DatePicker, Dialog, Form, Input, Select} from '@alicloud/console-components';
import {buildUrl, computeSignature, formatForm, formatResource, methods} from './utils';
import {FormValue} from './types';
import ResourceInput from "./components/Resource";
import moment from "moment";

const {Option} = Select;
const FormItem = Form.Item;

const itemConfig = [
  {
    label: 'AccessKeyId',
    content: <Input placeholder="必填" name="AccessKeyId"/>,
    required: true,
  },
  {
    label: 'AccessKeySecret',
    required: true,
    content: <Input placeholder="必填" name="AccessKeySecret"/>,
  },
  {
    label: 'Bucket Region',
    required: true,
    content: <Input placeholder="必填" name="Region"/>,
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
  {
    label: 'Expiration Time',
    required: true,
    content: <DatePicker placeholder="必填" name="Expiration" showTime/>,
  },
  {
    label: "Security-Token",
    content: <Input placeholder="如果是STS服务生成的请输入STSToken" name="STSToken"/>,
  }
];

export default () => {


  const [resourceData, setResourceData] = useState([]);
  const submit = (v: FormValue, e: any) => {
    if (!e) {
      // @ts-ignore
      if (!resourceData[0].value || !resourceData[1].value) {
        return Dialog.alert({
          title: '警告',
          content: <>必须填写bucket 和 object名称</>
        })
      }
      const resource = formatResource(resourceData)
      const canonicalString = formatForm({
        ...v,
        Date: moment(v.Expiration).unix(),
        resource
      })
      console.log('123---->', resource)
      const signature = computeSignature(v.AccessKeySecret, canonicalString)
      // @ts-ignore
      buildUrl(v.AccessKeyId, resourceData[0].value, v.Region, signature, resourceData[1].value, moment(v.Expiration).unix(), v.STSToken)


    }
  };

  return (
    <>
      <Form useLabelForErrorMessage>
        {itemConfig.map((i, k) => (
          <FormItem label={i.label} required={i.required} key={k}>
            {i.content}
          </FormItem>
        ))}

        <ResourceInput setResourceData={setResourceData}/>

        <FormItem>
          <Form.Submit validate type="primary" onClick={submit}>
            提交
          </Form.Submit>
          {'  '}
          <Form.Reset
            names={[
              'AccessKeyId',
              'AccessKeySecret',
              'METHOD',
              'Expiration',
              'Region',
              'STSToken'
            ]}
          >
            清空
          </Form.Reset>
        </FormItem>
      </Form>
    </>
  );
};

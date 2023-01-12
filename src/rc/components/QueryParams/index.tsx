import { formItemLayout } from '../../utils';
import { Icon, Input, Form, Select } from '@alicloud/console-components';
import intl from '../../../intl';
import React, { SetStateAction } from 'react';
import { ResourceDataType } from '../Resource';

const FormItem = Form.Item;

const QueryParams = (props: {
  resourceData: ResourceDataType[];
  setResourceData: SetStateAction<any>;
}) => {
  const { resourceData, setResourceData } = props;

  const add = (index: string) => {
    setResourceData([
      ...resourceData,
      {
        index,
        key: '',
        value: '',
      },
    ]);
  };

  const del = (index: number | string) => {
    if (resourceData.length > 1) {
      const filterValue = resourceData.filter((i) => i.index !== index);
      setResourceData([...filterValue]);
    }
  };

  const onChange = (type: string, index: number | string, v: string) => {
    const tempValue: ResourceDataType[] = [...resourceData];
    tempValue.forEach((i) => {
      if (i.index === index) {
        // @ts-ignore
        i[type] = v;
      }
    });
    setResourceData([...tempValue]);
  };

  return (
    <FormItem label="Query Params" {...formItemLayout}>
      {resourceData.map((i) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
          }}
          key={i.index}
        >
          <Select
            value={i.key}
            style={{ minWidth: '20vw' }}
            onChange={(v) => {
              onChange('key', i.index, v);
            }}
            placeholder={intl('common.tooltip.input')}
          >
            {[
              'response-cache-control',
              'response-content-disposition',
              'response-content-encoding',
              'response-content-type',
              'response-content-language',
              'response-expires',
              'versionId',
            ].map((j, k) => (
              <Select.Option value={j} key={k}>
                {j}
              </Select.Option>
            ))}
          </Select>
          <Input
            value={i.value}
            defaultValue={i.value}
            style={{ width: '32vw', borderLeft: '0' }}
            onChange={(v) => {
              onChange('value', i.index, v);
            }}
            placeholder={intl('common.tooltip.input')}
          />
          <Icon
            type="delete"
            onClick={() => del(i.index)}
            style={{ marginRight: '10px', marginLeft: '10px', marginTop: '5px' }}
            size={16}
          />
        </div>
      ))}
      <div onClick={() => add(crypto.randomUUID())} style={{ color: '#3581d2', width: '50px' }}>
        +<span style={{ marginLeft: '4px' }}>{intl('common.tool.add')}</span>
      </div>
    </FormItem>
  );
};

export default QueryParams;

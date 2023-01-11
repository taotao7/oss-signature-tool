import React, { SetStateAction, useState } from 'react';
import { Form, Input, Icon } from '@alicloud/console-components';
import { formItemLayout } from '../../utils';
import intl from '../../../intl';

const FormItem = Form.Item;

interface HeaderInputType {
  setHeadersData: SetStateAction<any>;
}

interface InputType {
  index: number;
  key: string;
  value: string;
  disabled?: boolean;
}

export default (props: HeaderInputType) => {
  const { setHeadersData } = props;
  const [value, setValue] = useState<InputType[]>([
    {
      index: 0,
      key: '',
      value: '',
    },
  ]);

  const add = (index: number) => {
    setValue([
      ...value,
      {
        index,
        key: '',
        value: '',
      },
    ]);
  };

  const del = (index: number) => {
    const filterValue = value.filter((i, k) => k !== index);
    setValue([...filterValue]);
    setHeadersData([...filterValue]);
  };

  const onChange = (type: string, index: number, v: string) => {
    const tempValue = [...value];

    tempValue.forEach((i) => {
      if (i.index === index) {
        // @ts-ignore
        i[type] = v;
      }
    });
    setValue([...tempValue]);
    setHeadersData([...tempValue]);
  };

  return (
    <FormItem label="Canonicalized Headers" {...formItemLayout}>
      {value.map((i, k) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
          }}
          key={k}
        >
          <Input
            addonTextBefore="x-oss-"
            value={i.key}
            disabled={i?.disabled}
            onChange={(v) => {
              onChange('key', k, v);
            }}
            style={{ maxWidth: '20vw' }}
            placeholder={intl('common.tooltip.input')}
          />
          <Input
            disabled={i?.disabled}
            value={i.value}
            defaultValue={i.value}
            style={{ width: '32vw', borderLeft: '0' }}
            onChange={(v) => {
              onChange('value', k, v);
            }}
            placeholder={intl('common.tooltip.input')}
          />
          <Icon
            type="delete"
            size={16}
            onClick={() => del(k)}
            style={{ marginRight: '10px', marginLeft: '10px', marginTop: '5px' }}
          />
        </div>
      ))}
      <div
        onClick={(e) => {
          e.stopPropagation();
          add(value.length);
        }}
        style={{ color: '#3581d2', width: '50px' }}
      >
        +<span style={{ marginLeft: '4px' }}>{intl('common.tool.add')}</span>
      </div>
    </FormItem>
  );
};

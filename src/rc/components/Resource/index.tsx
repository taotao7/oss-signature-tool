import React, { SetStateAction, useState, useEffect } from 'react';
import { Form, Input, Icon } from '@alicloud/console-components';
import { formItemLayout } from '../../utils';
import intl from '../../../intl';

const FormItem = Form.Item;

export interface ResourceDataType {
  index: number | string;
  key: string;
  value: string;
  disabled?: boolean;
}

export default (props: {
  setResourceData: SetStateAction<any>;
  required?: boolean;
  setResourcePath: Function;
}) => {
  const { setResourceData, required = false, setResourcePath } = props;

  const [value, setValue] = useState<ResourceDataType[]>([]);

  useEffect(() => {
    const templateData = [
      {
        index: 0,
        key: 'bucket',
        value: '',
        disabled: true,
      },
      {
        index: 1,
        key: 'object',
        value: '',
        disabled: true,
      },
    ];
    setValue([...templateData]);
    setResourcePath([...templateData]);
    setResourceData([...templateData]);
  }, []);

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
    const filterValue = value.filter((_, k) => k !== index);
    setValue(filterValue);
    setResourcePath([...filterValue]);
    setResourceData([...filterValue]);
  };

  const onChange = (type: string, index: number, v: string) => {
    const tempValue: ResourceDataType[] = [...value];
    tempValue.forEach((i) => {
      if (i.index === index) {
        // @ts-ignore
        i[type] = v;
      }
    });
    setValue([...tempValue]);
    setResourcePath([...tempValue]);
    setResourceData([...tempValue]);
  };

  return (
    <FormItem label="Canonicalized Resource" {...formItemLayout} required={required}>
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
            value={i.key}
            disabled={i?.disabled}
            style={{ minWidth: '20vw' }}
            onChange={(v) => {
              onChange('key', k, v);
            }}
            placeholder={intl('common.tooltip.input')}
          />
          <Input
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
            onClick={() => del(k)}
            style={{ marginRight: '10px', marginLeft: '10px', marginTop: '5px' }}
            size={16}
          />
        </div>
      ))}
      <div onClick={() => add(value.length)} style={{ color: '#3581d2', width: '50px' }}>
        +<span style={{ marginLeft: '4px' }}>{intl('common.tool.add')}</span>
      </div>
    </FormItem>
  );
};

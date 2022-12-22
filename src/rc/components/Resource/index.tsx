import React, { SetStateAction, useState, useEffect } from 'react';
import { Form, Input, Icon } from '@alicloud/console-components';
import { formItemLayout } from '../../utils';

const FormItem = Form.Item;

interface ResourceDataType {
  index: number;
  key: string;
  value: string;
  disabled?: boolean;
}

export default (props: { setResourceData: SetStateAction<any>; required: boolean }) => {
  const { setResourceData, required = false } = props;

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
    // 不能删除date
    if (index !== 0) {
      const filterValue = value.filter((_, k) => k !== index);
      setValue(filterValue);
      setResourceData([...filterValue]);
    }
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
            onChange={(v) => {
              onChange('key', k, v);
            }}
          />
          <Input
            value={i.value}
            defaultValue={i.value}
            style={{ width: '30vw' }}
            onChange={(v) => {
              onChange('value', k, v);
            }}
          />
          {!['object', 'bucket'].includes(i.key) && (
            <Icon
              type="delete"
              onClick={() => del(k)}
              style={{ marginRight: '10px', marginLeft: '10px' }}
            />
          )}
        </div>
      ))}
      <div onClick={() => add(value.length)} style={{ color: '#3581d2', width: '50px' }}>
        +添加
      </div>
    </FormItem>
  );
};

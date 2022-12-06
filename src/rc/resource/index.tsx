import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from '@alicloud/console-components';

const FormItem = Form.Item;

interface ResourceDataType {
  index: number;
  key: string;
  value: string;
  disabled?: boolean;
}

export default (props: { setResourceData: Function }) => {
  const { setResourceData } = props;

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
      const filterValue = value.filter((i, k) => k !== index);
      setValue(filterValue);
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
    <FormItem label="Canonicalized Resource">
      {value.map((i, k) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
          key={k}
        >
          <Input
            defaultValue={i.key}
            disabled={i?.disabled}
            onChange={(v) => {
              onChange('key', i.index, v);
            }}
          />
          <Input
            value={i.value}
            defaultValue={i.value}
            style={{ width: '30vw' }}
            onChange={(v) => {
              onChange('value', i.index, v);
            }}
          />
          <Button onClick={() => add(value.length)}>+</Button>
          {!['object', 'bucket'].includes(i.key) && <Button onClick={() => del(i.index)}>-</Button>}
        </div>
      ))}
    </FormItem>
  );
};

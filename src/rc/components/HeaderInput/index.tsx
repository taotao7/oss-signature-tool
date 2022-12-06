import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from '@alicloud/console-components';
import { toGMT } from '../../utils';

const FormItem = Form.Item;

interface HeaderInputType {
  dateField: string;
  setHeadersData: Function;
}

interface InputType {
  index: number;
  key: string;
  value: string;
  disabled?: boolean;
}

export default (props: HeaderInputType) => {
  const { dateField, setHeadersData } = props;
  const [value, setValue] = useState<InputType[]>([
    {
      index: 0,
      key: 'date',
      value: dateField,
      disabled: true,
    },
  ]);

  useEffect(() => {
    if (dateField) {
      const tempValue = value;
      tempValue[0].value = toGMT(dateField);
      setValue([...tempValue]);
      setHeadersData([...tempValue]);
    }
  }, [dateField]);

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
      setValue([...filterValue]);
    }
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
    <FormItem label="Canonicalized Headers">
      {value.map((i, k) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
          key={k}
        >
          <Input
            innerBefore="x-oss-"
            value={i.key}
            disabled={i?.disabled}
            onChange={(v) => {
              onChange('key', k, v);
            }}
          />
          <Input
            disabled={i?.disabled}
            value={i.value}
            defaultValue={i.value}
            style={{ width: '30vw' }}
            onChange={(v) => {
              onChange('value', k, v);
            }}
          />
          <Button onClick={() => add(value.length)}>+</Button>
          {i.key !== 'date' && <Button onClick={() => del(k)}>-</Button>}
        </div>
      ))}
    </FormItem>
  );
};

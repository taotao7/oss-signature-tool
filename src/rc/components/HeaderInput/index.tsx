import React, { SetStateAction, useEffect, useState } from 'react';
import { Form, Input, Icon } from '@alicloud/console-components';
import { toGMT, formItemLayout } from '../../utils';

const FormItem = Form.Item;

interface HeaderInputType {
  dateField?: string;
  setHeadersData: SetStateAction<any>;
  prefix: string;
}

interface InputType {
  index: number;
  key: string;
  value: string;
  disabled?: boolean;
}

export default (props: HeaderInputType) => {
  const { dateField = '', setHeadersData, prefix } = props;
  const [value, setValue] = useState<InputType[]>(
    !['standard'].includes(prefix)
      ? [
          {
            index: 0,
            key: '',
            value: '',
          },
        ]
      : [
          {
            index: 0,
            key: 'date',
            value: dateField,
            disabled: true,
          },
        ],
  );

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
      setHeadersData([...filterValue]);
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
          {i.key !== 'date' && k > 0 && (
            <Icon
              type="delete"
              size="small"
              onClick={() => del(k)}
              style={{ marginRight: '10px', marginLeft: '10px', marginTop: '5px' }}
            />
          )}
        </div>
      ))}
      <div
        onClick={(e) => {
          e.stopPropagation();
          add(value.length);
        }}
        style={{ color: '#3581d2', width: '50px' }}
      >
        +添加
      </div>
    </FormItem>
  );
};

import React, { SetStateAction, useState } from 'react';
import { Form, Input, Icon } from '@alicloud/console-components';
import { formItemLayout } from '../../utils';
import intl from '../../../intl';
import moment from 'moment';
import styles from './index.module.less';

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
      index: moment().valueOf(),
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
    const filterValue = value.filter((i) => i.index !== index);
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
      {value.map((i) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
          }}
          key={i.index}
        >
          <Input
            addonTextBefore="x-oss-"
            value={i.key}
            disabled={i?.disabled}
            onChange={(v) => {
              onChange('key', i.index, v);
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
              onChange('value', i.index, v);
            }}
            placeholder={intl('common.tooltip.input')}
          />
          <Icon
            className={styles.pointer}
            type="delete"
            size={12}
            onClick={() => del(i.index)}
            style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}
          />
        </div>
      ))}
      <div
        className={styles.pointer}
        onClick={(e) => {
          e.stopPropagation();
          add(moment().valueOf());
        }}
        style={{ color: '#3581d2', width: '50px' }}
      >
        +<span style={{ marginLeft: '4px' }}>{intl('common.tool.add')}</span>
      </div>
    </FormItem>
  );
};

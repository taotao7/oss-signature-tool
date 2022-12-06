import React, {useState} from 'react';
import {Button, DatePicker, Form, Input} from '@alicloud/console-components';
import moment from 'moment';

interface DatePickerType {
  onDateFieldChange: any;
  dateField: string;
}

const FormItem = Form.Item;


const onActiveStyle = (action: string, type: string) => {
  if (type === action) {
    return {
      // borderColor: 'blue',
      borderWidth:'1px',
      background:'#F3F3F3',
    }
  }
}

export default (props: DatePickerType) => {
  const {onDateFieldChange, dateField} = props;
  const [type, setType] = useState<string>('input');

  // type change
  const onTypeChange = (v: string) => {
    setType(v);
  };

  return (
    <FormItem required label="Date">
      {type !== 'pick' ? (
        <Input
          placeholder="此次操作的时间，且必须为GMT格式，例如: Sun, 22 Nov 2015 08:16:38 GMT"
          style={{width: '40vw'}}
          name="Date"
          onChange={onDateFieldChange}
          value={dateField}
        />
      ) : (
        <DatePicker
          showTime
          name="Date"
          onChange={(v) => {
            onDateFieldChange(new Date(v as string).toUTCString());
          }}
          value={moment(dateField)}
        />
      )}
      <Button
        onClick={() => onTypeChange('input')}
        style={onActiveStyle('input', type)}
      >
        输入
      </Button>
      <Button
        onClick={() => onTypeChange('pick')}
        style={onActiveStyle('pick', type)}
      >
        选择
      </Button>
    </FormItem>
  );
};

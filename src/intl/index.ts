import intlFactory from '@ali/intl-factory';
//@ts-ignore
import messageCommon from './message';
//@ts-ignore
import confGet from '../util/conf/get';

const {
  intl: _intl,
  intlNumber,
  intlPercent,
  intlByte,
  intlConst,
} = intlFactory(
  {
    ...messageCommon,
  },
  confGet('LOCALE'),
);

const intl = (id: string, values?: string, extra?: any) => {
  if (/^help:/.test(id)) {
    extra = {
      html: true,
      lines: true,
    };
  }

  return _intl(id, values, extra);
};

export default intl;

export { intlNumber, intlPercent, intlByte, intlConst };

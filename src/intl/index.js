import intlFactory from '@ali/intl-factory';
import messageCommon from './message';
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

const intl = (id, values, extra) => {
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

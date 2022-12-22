import confGet, { LOCALE_CODE } from '../util/conf/get';
import i18n from '@alife/mcms_oss-console_package-recommend-tool';

let messages_cn = {
  'common.must': '必填',
};
let messages_en = {};

const messageAll = {
  'tool.common_question': {
    'zh-cn': '常见问题',
    'en-us': 'common question',
  },
};

Object.keys(messageAll).forEach((item) => {
  messages_cn[item] = messageAll[item]['zh-cn'];
  messages_en[item] = messageAll[item]['en-us'] || messageAll[item]['zh-cn'];
});

let messages = messages_cn;

if (confGet('LOCALE') === LOCALE_CODE.ZH_CN) {
  if (i18n['zh-cn']) {
    messages = {
      ...messages_cn,
      ...i18n['zh-cn'],
    };
  } else {
    messages = messages_cn;
  }
} else if (confGet('LOCALE') === LOCALE_CODE.EN_US) {
  if (i18n['en-us']) {
    messages = {
      ...messages_en,
      ...i18n['en-us'],
    };
  } else {
    const locale = confGet('LOCALE')?.toLowerCase();
    messages = i18n[locale];
  }
}

export default messages;

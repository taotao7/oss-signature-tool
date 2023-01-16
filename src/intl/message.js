import confGet, { LOCALE_CODE } from '../util/conf/get';
import i18n from '@alife/mcms_oss-console_signature_tool';

let messages_cn = {
  'tool.common.sigUrl.bucket.tip': '如果使用了自定义域名,请输入对应bucket',
};
let messages_en = {};

const messageAll = {
  'std.tool.privateKey': {
    'zh-cn': '密钥',
    'en-us': 'private key',
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
      ...i18n['zh-cn'],
      ...messages_cn,
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

console.log(messages);

export default messages;

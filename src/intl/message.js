import confGet, { LOCALE_CODE } from '../util/conf/get';
import i18n from '@alife/mcms_oss-console_signature_tool';

let messages_cn = {
  'common.tool.standardSig': '标准签名',
  'common.tool.postSig': 'PostObject Policy签名',
  'common.tool.sigUrl': '获取签名链接',
  'common.tool.clear': '清空',
  'common.tool.history': '历史记录',
  'common.tool.standardTip': '标准签名文档，详情查看',
  'common.tool.standardTip.link': '在Header中包含签名',
  'common.tool.postPolicyTip': 'policy签名文档，详情查看',
  'common.tool.sigUrlTip': '获取签名文档，详情查看',
  'common.tool.sigUrlTip.link': '在URL中包含签名',
  'common.tool.akAndSk.ramPanel': 'RAM控制台获取',
  'common.tooltip.akAndSk':
    'AccessKeyId/AccessKeySecret 不会保留在服务端，只在浏览器记录里保存记录。AccessKeyId/AccessKeySecret 可以在',
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

export default messages;

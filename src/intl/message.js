import confGet, { LOCALE_CODE } from '../util/conf/get';
import i18n from '@alife/mcms_oss-console_package-recommend-tool';

let messages_cn = {
  'common.tool.privateKey': '密钥',
  'common.tooltip.akAndSk':
    'AccessKeyId/AccessKeySecret 不会保留在服务端，只在浏览器记录里保存记录。',
  'common.tooltip.input': '请输入',
  'common.tool.param': '参数',
  'common.tool.method': '请求方法',
  'common.tool.contentMD5.helper':
    '请求内容数据的MD5值，例如: eB5eJF1ptWaXm4bijSPyxw==，也可以为空',
  'common.tool.contentType.helper': '请求内容的类型，例如: application/octet-stream，也可以为空',
  'common.tool.other': '其他',
  'common.tool.generateSig': '生成签名',
  'common.tool.policy.tooltip': '选择过期时间后会自动填充到Policy',
  'common.tool.expireTime.s': '过期时间(秒)',
  'common.tool.expireTime.defaultTime': '默认300秒',
  'common.tool.otherMust': '其他必填',
  'common.tool.second': '秒',
  'common.tool.otherChoice': '其他可选',
  'common.tool.tooltip.stsToken': '如果是STS服务生成,请输入STSToken',
  'common.tool.generateUrl': '生成链接',
  'common.tool.warning': '警告',
  'common.tool.warning.sigUrl.bucketAndObject': '必须填写bucket 和 object名称',
  'common.tool.jsonEditor.click': '点击查看更多Policy选项',
  'common.tool.add': '添加',
  'common.tool.signatureHistory.clearCurrentHistory.title': '确认清空当前结果反馈?',
  'common.tool.signatureHistory.clearCurrentHistory.content':
    '清空后,可在历史纪录中查看当前反馈,是否继续?',
  'common.tool.signatureHistory.clear.ok': '清空成功!',
  'common.tool.signatureHistory.clear.success': '删除成功!',
  'common.tool.signatureHistory.clearSingle.title': '确认删除历史纪录?',
  'common.tool.signatureHistory.clearSingle.content': '删除后不可恢复，是否继续?',
  'common.tool.signatureHistory.clearAll.title': '确认清除全部历史纪录?',
  'common.tool.signatureHistory.result': '结果反馈（签名过程）',
  'common.tool.signatureHistory.sigDate': '纪录时间',
  'common.tool.signatureHistory.sigCut': '当前签名字段',
  'common.tool.signatureHistory.sigFunc': '签名调用函数',
  'common.tool.signatureHistory.Func': '调用函数',
  'common.tool.signatureHistory.link': '签名链接',
  'common.tool.signatureHistory.sigHeader': '请求头',
  'common.tool.signatureHistory.collapse': '展开历史记录',
  'common.tool.signatureHistory.clearAll': '清除全部历史记录',
  'common.tool.signatureHistory.year': '年',
  'common.tool.signatureHistory.month': '月',
  'common.tool.signatureHistory.day': '日',
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

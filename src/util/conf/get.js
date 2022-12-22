import _get from 'lodash/get';

const LOCALE_CODE = {
  EN_US: 'en-US',
  JA_JP: 'ja-JP',
  ZH_CN: 'zh-CN',
  ZH_HK: 'zh-HK',
  ZH_TW: 'zh-TW',
};

const theConf = {
  LOCALE: LOCALE_CODE.ZH_CN,
  SUPPORTED_LOCALES: [LOCALE_CODE.ZH_CN, LOCALE_CODE.ZH_TW, LOCALE_CODE.EN_US, LOCALE_CODE.JA_JP],
  CHANNEL: '',
  USER_ID: '', // 注意这是主账号 ID
  USER_IS_SUB: false, // 是否为子账号
  SEC_TOKEN: '', // POST 请求需要回传的 TOKEN
  OPEN_STATUS: {}, // 所有服务的开通状况
  SERVICE_STATUS: {}, // 用于判断 oss 服务状态的对象 mapping
  SERVICE_STATUS_SLS: {},
  SERVICE_STATUS_FC: false, // 用于判断 FC 服务开通状态的boolean值
  SERVICE_STATUS_SGW: {}, // 云存储网关状态
  LINK: {}, // 渠道链接
  FEATURE_STATUS: {},
  REGION_LIST_CONFIG: [], // 所有 OSS 可用的 region 对象列表
  IN18N_TEXT: window.ALIYUN_CONSOLE_I18N_MESSAGE || {},
  TAG: '', // 虚商平台过来的资源 TAG
  CLUSTER_IS_CDS: null,
  ...((typeof window !== 'undefined' &&
    (window.ALIYUN_OSS_CONSOLE_CONFIG || window.ALIYUN_CONSOLE_CONFIG)) ||
    {}), // typeof window for unit test to pass
};

export default (path) => _get(theConf, path);

export { LOCALE_CODE };

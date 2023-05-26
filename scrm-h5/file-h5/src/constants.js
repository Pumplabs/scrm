export const LOCAL_KEY = 'extId';
export const WX_CB_KEY = 'search';
export const SUCCESS_CODE = 0;

export const PARAMS_RULES = [
  {
    name: 'staffId',
    wxRequired: true,
  },
  {
    name: 'materialId',
    // 企微需要
    // wwRequired: true,
    required: true,
  },
];


// 本地开发域名
export const TEST_DOMAIN = "https://wwww.xxx.xxx";
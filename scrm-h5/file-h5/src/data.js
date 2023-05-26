import { TEST_DOMAIN } from "./constants";
export default {
  isMock: window.isMock,
  userInfo: {},
  baseHost: window.isMock
    ? TEST_DOMAIN
    : window.location.origin,
  fileInfo: {},
};

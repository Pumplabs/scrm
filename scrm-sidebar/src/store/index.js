import UserStore from "./userStore";
import WxStore from './wxStore'
import ModifyStore from './modifyStore'
class RootStore {
  constructor() {
    this.UserStore = new UserStore(this)
    this.WxStore = new WxStore(this)
    this.ModifyStore = new ModifyStore(this)
  }
}
export default new RootStore()
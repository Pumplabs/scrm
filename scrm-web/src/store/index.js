import UserStore from './User'
import MenuStore from './Menu'
import WxWorkStore from './Wxwork'
class RootStore{
  constructor() {
    this.UserStore = new UserStore(this)
    this.MenuStore = new MenuStore(this)
    this.WxWorkStore = new WxWorkStore(this)
  }
}
export default new RootStore()
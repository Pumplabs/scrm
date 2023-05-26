import { observable, action, toJS } from 'mobx'

class ModifyStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  // 新增编辑跟进数据（跟进列表入口的）
  @observable addFollowData = {
    customers: [],
    users: [],
    files: [],
    followText: '',
    followId: '',
    taskList: [],
    remindTime: null,
    // 是否为初始状态
    init: true,
  }
  // 素材
  @observable addMaterialData = {
    init: true,
    materialTags: [],
    customerTags: [],
    files: [],
    title: '',
    description: '',
    link: '',
    hasInform: true,
  }
  // 标签
  @observable tagData = {
    mode: '',
    oldValue: [],
    newValue: [],
    hasChange: false,
  }
  // 订单
  @observable orderData = {
    // 客户
    customers: [],
    // 员工
    users: [],
    // 产品
    products: [],
    // 文件
    files: [],
    // 折扣
    discount: 100,
    // 金额
    orderAmount: 0,
    // 描述
    description: '',
    collectionAmount: 0,
    // 是否为初始状态
    init: true,
  }

  // 跟进任务
  @observable followTask = {
    name: '',
    users: [],
    dealine: null,
    init: true,
  }

  // 客户跟进
  @observable customerFollow = {
    info: '',
    files: [],
    remindTime: null,
    taskList: [],
    users: [],
    init: true,
  }

  // 商机跟进
  @observable oppFollowData = {
    info: '',
    files: [],
    remindTime: null,
    taskList: [],
    remindCooperator: false,
    init: true,
  }

  // 商机新增
  @observable oppAddData = {
    name: '',
    // 负责人
    users: [],
    // 客户
    customer: [],
    // 协作人
    partners: [],
    expectMoney: '',
    date: '',
    desc: '',
    priority: '',
    priorityName: '',
    groupId: '',
    groupName: '',
    stageId: '',
    stageName: '',
    failId: '',
    failName: '',
    dealChance: 1,
    init: true
  }

  // 更新跟进数据
  @action.bound updateFollowData(...args) {
    this.updateData('addFollowData', ...args)
  }
  // 清除跟进数据
  @action.bound clearFollowData() {
    this.addFollowData = {
      customers: [],
      users: [],
      files: [],
      init: true,
      followText: '',
      followId: '',
      taskList: [],
      remindTime: null,
    }
  }

  // 标签： 客户详情、客户群详情
  @action.bound updateTagData(key, val) {
    this.tagData[key] = val
  }
  @action.bound clearTagData() {
    this.tagData = {
      mode: '',
      oldValue: [],
      newValue: [],
      hasChange: false,
    }
  }

  // 更新素材数据
  @action.bound updateMaterialData(key, val) {
    if (this.addMaterialData.init) {
      this.addMaterialData.init = false
    }
    // 如果key值为字符串，则表示更改某个属性值
    if (typeof key === 'string') {
      this.addMaterialData[key] = val
    } else {
      this.addMaterialData = {
        ...toJS(this.addMaterialData),
        ...key,
      }
    }
  }

  // 清除素材
  @action.bound clearMaterialData() {
    this.addMaterialData = {
      init: true,
      materialTags: [],
      customerTags: [],
      files: [],
      title: '',
      description: '',
      hasInform: true,
      link: '',
    }
  }

  // 更新跟进任务
  @action.bound updateFollowTask(...args) {
    this.updateData('followTask', ...args)
  }

  // 清除任务
  @action.bound clearFollowTask() {
    this.followTask = {
      name: '',
      users: [],
      dealine: null,
      init: true,
    }
  }

  // 更新客户待办
  @action.bound updateCustomerFollow(...args) {
    this.updateData('customerFollow', ...args)
  }

  // 清除客户待办
  @action.bound clearCustomerFollow() {
    this.customerFollow = {
      info: '',
      files: [],
      remindTime: null,
      taskList: [],
      users: [],
      init: true,
    }
  }

  @action.bound updateOppFollow(...args) {
    this.updateData('oppFollowData', ...args)
  }
  @action.bound clearOppFollow() {
    this.oppFollowData = {
      info: '',
      files: [],
      remindCooperator: false,
      remindTime: null,
      taskList: [],
      init: true,
    }
  }

  // 更新商机新增数据
  @action.bound updateOppAddData(...args) {
    this.updateData('oppAddData', ...args)
  }

  // 重置商机新增数据
  @action.bound clearOppAddData() {
    this.oppAddData = {
      name: '',
      // 负责人
      users: [],
      // 客户
      customer: [],
      // 协作人
      partners: [],
      desc: '',
      priority: '',
      priorityName: '',
      groupId: '',
      groupName: '',
      stageId: '',
      stageName: '',
      expectMoney: '',
      date: '',
      dealChance: 1,
      init: true
    }
  }
 
   // 更新订单
   @action.bound updateOrderData(...args) {
    this.updateData('orderData', ...args)
  }

  // 清除
  @action.bound clearOrderData() {
    this.orderData = {
      // 客户
      customers: [],
      // 员工
      users: [],
      // 产品
      products: [],
      // 文件
      files: [],
      // 折扣
      discount: 100,
      collectionAmount: 0,
      // 金额
      orderNum: 0,
      // 描述
      description: '',
      // 是否为初始状态
      init: true,
    }
  }

    @action.bound updateData(attrName, key, val) {
      const isTemp =
        typeof key === 'string' ? key === 'temp' : Reflect.has(key, 'temp')
      if (!isTemp && this[attrName].init) {
        this[attrName].init = false
      }
      // 如果key值为字符串，则表示更改某个属性值
      if (typeof key === 'string') {
        this[attrName][key] = val
      } else {
        this[attrName] = {
          ...toJS(this[attrName]),
          ...key,
        }
      }
    }
  @action.bound clearData() {}

}
export default ModifyStore

import { SYSTEM_PREFIX_PATH } from 'src/utils/constants'
// 潜在菜单，以列表的url为key,内容格式参照menu格式
export default {
  // 客户群群发
  [`${SYSTEM_PREFIX_PATH}/customerGroupMass`]: [
    // 客户群群发新增
    {
      name: '创建客户群群发',
      url: `${SYSTEM_PREFIX_PATH}/customerGroupMass/add`,
    },
    // 客户群群发编辑
    {
      name: '编辑客户群群发',
      url: `${SYSTEM_PREFIX_PATH}/customerGroupMass/edit/:id`,
    },
    // 客户群群发详情
    {
      name: '详情',
      url: `${SYSTEM_PREFIX_PATH}/customerGroupMass/detail/:id`,
    }
  ],
  // 客户群发： 详情，新增，编辑
  [`${SYSTEM_PREFIX_PATH}/customerMass`]: [
    {
      name: '创建客户群发',
      url: `${SYSTEM_PREFIX_PATH}/customerMass/add`,
    },
    // 客户群发详情
    {
      name: '客户群发详情',
      url: `${SYSTEM_PREFIX_PATH}/customerMass/detail/:id`,
    },
    // 客户群发编辑
    {
      name: '编辑客户群发',
      url: `${SYSTEM_PREFIX_PATH}/customerMass/edit/:id`,
    }
  ],
  // 客户群列表: 详情
  [`${SYSTEM_PREFIX_PATH}/groupList`]: [{
    name: '群详情',
    url: `${SYSTEM_PREFIX_PATH}/groupList/detail/:id`
  }],
  // 轨迹素材
  [`${SYSTEM_PREFIX_PATH}/saleOperation/trackMaterial`]: [
    {
      name: '新增文章',
      url: `${SYSTEM_PREFIX_PATH}/saleOperation/trackMaterial/article/add`,
    },
    {
      name: '编辑文章',
      url: `${SYSTEM_PREFIX_PATH}/saleOperation/trackMaterial/article/edit/:id`,
    }
  ],
}
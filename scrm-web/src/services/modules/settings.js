import {  post, get } from '../request'
import { handleArray } from '../utils'
import menuData from 'src/data/menu.json'
// 获取系统配置
export const GetSysSettings = async (params) => {
  return post('/api/sysSwitch/list', params, { needJson: true}).then(res => handleArray(res))
}
// 修改系统配置
export const EditSysSettings = async (params) => {
  return post("/api/sysSwitch/update", params, { needJson: true})
}
// 获取系统菜单
export const GetSysMenu = async () => {
  return new Promise((resolve) => {
    resolve(menuData)
  })
}
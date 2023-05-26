import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Empty, Input, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  SearchOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { toJS } from 'mobx'
import PathContext from '../../../PathContext'
import { filterMenusFn, convertTreeToPlain } from '../utils'
import styles from './index.module.less'

const { SubMenu } = Menu
const HREF_KEY = 'url'
const MenuSideBar = ({ collapsed, width, menus, onSelect }) => {
  const navigate = useNavigate()
  const [openKeys, setOpenKeys] = useState([])
  const [searchText, setSearchText] = useState('')
  const { pageNames } = useContext(PathContext)

  const handleSelectMenuItem = (item) => {
    if (item[HREF_KEY]) {
      navigate(item[HREF_KEY])
      if (typeof onSelect === 'function') {
        onSelect(item[HREF_KEY])
      }
    }
  }

  const loopRenderMenuItem = (list = []) => {
    return list.map((ele) => {
      const child = toJS(ele.children)
      if (Array.isArray(child) && child.length) {
        return (
          <SubMenu key={ele.id} icon={<MailOutlined />} title={ele.name}>
            {loopRenderMenuItem(ele.children)}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item
            key={`${ele.id}`}
            icon={<ContainerOutlined />}
            onClick={() => handleSelectMenuItem(ele)}>
            {ele.name}
          </Menu.Item>
        )
      }
    })
  }

  const onOpenChange = (keys) => {
    setOpenKeys(keys)
  }

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const { selectedKey } = useMemo(() => {
    let menuKey = ''
    // eslint-disable-next-line for-direction
    const item = [...pageNames].reverse().find(ele => {
      return ele && !ele.isHideMenu
    })
    if (item) {
      menuKey = item.id
    }
    return {
      selectedKey: menuKey,
    }
  }, [pageNames])

  const pageNamesOpenKeys = useMemo(
    () => pageNames.map((item) => item.id),
    [pageNames]
  )
  useEffect(() => {
    setOpenKeys(pageNamesOpenKeys)
  }, [pageNamesOpenKeys])

  const filterMenus = useMemo(() => {
    const menuRes = filterMenusFn(toJS(menus), searchText)
    if (searchText) {
      setOpenKeys(convertTreeToPlain(menuRes))
    } else {
      setOpenKeys(pageNamesOpenKeys)
    }
    return menuRes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, searchText, pageNamesOpenKeys])

  return (
    <div className={styles['menu-sidebar']} style={{ width }}>
      <div className={styles['menu-sidebar-header']}>
        {collapsed ? (
          <img
            src={'../logo192.png'}
            style={{ width: 48, paddingTop: 20 }}
            alt=""
          />
        ) : (
          <div>
            <Input
              placeholder="请输入关键词"
              prefix={<SearchOutlined />}
              onChange={onSearchTextChange}
              value={searchText}
              allowClear={true}
            />
          </div>
        )}
      </div>
      <div className={styles['menu-sidebar-body']}>
        <Menu
          openKeys={openKeys}
          selectedKeys={selectedKey}
          mode="inline"
          inlineCollapsed={collapsed}
          style={{ width }}
          onOpenChange={onOpenChange}>
          {loopRenderMenuItem(filterMenus)}
        </Menu>
        {searchText.length > 0 && filterMenus.length === 0 ? (
          <div style={{ paddingTop: 40 }}>
            <Empty description="没有找到相关菜单" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default MenuSideBar

import { useState, useEffect, useMemo } from 'react'
import { Radio, Tabs, message } from 'antd'
import { mergeWith } from 'lodash'
import CommonDrawer from 'components/CommonDrawer'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
import TabContent from './List'
import LinkList from './LinkList'
import ImgList from './ImgList'
import { ATTACH_RULE_TYPE, MAX_ATTACH_COUNT } from '../../../constants'
import { getSelectedAttachObj, covertValidTypeOptions } from '../../../valid'
import styles from './index.module.less'

const { TabPane } = Tabs
const NORMAL_MATERIAL_TYPES = [
  {
    label: '图片',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.PICTUER,
  },
  {
    label: '海报',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.POSTER,
  },
  {
    label: '文章',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.ARTICLE,
  },
  {
    label: '视频',
    value: MATERIAL_TYPE_EN_VALS.VIDEO,
  },
  {
    label: '链接',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.LINK,
  },
  {
    label: '小程序',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.MINI_APP,
  },
]
const TRACK_MATERIAL_TYPES = [
  {
    label: '文章',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.ARTICLE,
  },
  {
    label: '视频',
    value: MATERIAL_TYPE_EN_VALS.VIDEO,
  },
  {
    label: '链接',
    needRemote: true,
    value: MATERIAL_TYPE_EN_VALS.LINK,
  },
  {
    label: '文件',
    value: MATERIAL_TYPE_EN_VALS.FILE,
  },
]
export const MATERIAL_TABS = {
  NORMAL: 'normal',
  TRACK: 'track',
}
const TABS_CONFIG = [
  {
    tab: '普通素材',
    key: MATERIAL_TABS.NORMAL,
    subTab: NORMAL_MATERIAL_TYPES,
  },
  {
    tab: '感知素材',
    key: MATERIAL_TABS.TRACK,
    subTab: TRACK_MATERIAL_TYPES,
  },
]
const defaultTypes = {
  [MATERIAL_TABS.NORMAL]: MATERIAL_TYPE_EN_VALS.PICTUER,
  [MATERIAL_TABS.TRACK]: MATERIAL_TYPE_EN_VALS.ARTICLE,
}
const MATERIAL_TO_RULETYPE = {
  // 普通素材-图片
  [`${MATERIAL_TABS.NORMAL}_${MATERIAL_TYPE_EN_VALS.PICTUER}`]:
    ATTACH_RULE_TYPE.IMAGE,
  // 普通素材-海报
  [`${MATERIAL_TABS.NORMAL}_${MATERIAL_TYPE_EN_VALS.POSTER}`]:
    ATTACH_RULE_TYPE.IMAGE,
  // 普通素材-文章
  [`${MATERIAL_TABS.NORMAL}_${MATERIAL_TYPE_EN_VALS.ARTICLE}`]:
    ATTACH_RULE_TYPE.LINK,
  // 普通素材-视频
  [`${MATERIAL_TABS.NORMAL}_${MATERIAL_TYPE_EN_VALS.VIDEO}`]:
    ATTACH_RULE_TYPE.VIDEO,
  // 普通素材-链接
  [`${MATERIAL_TABS.NORMAL}_${MATERIAL_TYPE_EN_VALS.LINK}`]:
    ATTACH_RULE_TYPE.LINK,
  // 普通素材-小程序
  [`${MATERIAL_TABS.NORMAL}_${MATERIAL_TYPE_EN_VALS.MINI_APP}`]:
    ATTACH_RULE_TYPE.MINI_APP,
  // 轨迹素材-文章
  [`${MATERIAL_TABS.TRACK}_${MATERIAL_TYPE_EN_VALS.ARTICLE}`]:
    ATTACH_RULE_TYPE.LINK,
  // 轨迹素材-视频
  [`${MATERIAL_TABS.TRACK}_${MATERIAL_TYPE_EN_VALS.VIDEO}`]:
    ATTACH_RULE_TYPE.LINK,
  // 轨迹素材-文件
  [`${MATERIAL_TABS.TRACK}_${MATERIAL_TYPE_EN_VALS.FILE}`]:
    ATTACH_RULE_TYPE.LINK,
  // 轨迹素材-链接
  [`${MATERIAL_TABS.TRACK}_${MATERIAL_TYPE_EN_VALS.LINK}`]:
    ATTACH_RULE_TYPE.LINK,
}
// 获取可选择的附件类型
const getCanChooseFilesData = (chooseData = {}, attachmentRules = {}) => {
  const {
    attachTypeData = {},
    attachChooseTypes = [],
    chooseLen = 0,
  } = chooseData
  const validOptions = covertValidTypeOptions(attachTypeData, attachmentRules)
  let res = {}
  if (attachChooseTypes.length === 0) {
    validOptions.forEach(({ menuItem, max = MAX_ATTACH_COUNT }) => {
      if (menuItem) {
        res = {
          ...res,
          [menuItem.type]: max,
        }
      }
    })
    return res
  }
  // 如果是或类型
  if (attachmentRules.type === 'or') {
    // 找到已选择的类型
    const chooseItem = validOptions.find((item) => item.count > 0)
    if (chooseItem && chooseItem.menuItem) {
      res = {
        [chooseItem.menuItem.type]:
          (chooseItem.max || MAX_ATTACH_COUNT) - chooseItem.count,
      }
    }
  } else {
    // 如果为且
    const ruleMax = attachmentRules.max || MAX_ATTACH_COUNT
    const hasDefinedCount = validOptions.some((item) => item.max > 0)
    if (hasDefinedCount) {
      validOptions.forEach(({ max = MATERIAL_TABS, count, menuItem }) => {
        if (count < max) {
          res = {
            ...res,
            [menuItem.type]: max - count,
          }
        }
      })
    } else if (chooseLen < ruleMax) {
      validOptions.forEach(({ menuItem, max = MAX_ATTACH_COUNT }) => {
        if (menuItem) {
          res = {
            ...res,
            [menuItem.type]: max - chooseLen,
          }
        }
      })
    }
  }
  return res
}

// 通过当前选择的素材获取已选择类型
const getChooseDataByMaterial = (materialList = []) => {
  let chooseData = {}
  materialList.forEach((item) => {
    const typeRuleName = MATERIAL_TO_RULETYPE[`${item.tabKey}_${item.type}`]
    if (chooseData[typeRuleName]) {
      chooseData[typeRuleName]++
    } else {
      chooseData[typeRuleName] = 1
    }
  })
  return chooseData
}

/**
 * @param {Object} attachmentRules 附件规则
 */
export default (props) => {
  const {
    visible,
    data = {},
    onOk,
    chooseMediaList,
    attachmentRules,
    typeRuleOptions,
    ...rest
  } = props
  const [selectedTypes, setSelectedTypes] = useState(defaultTypes)
  const [keys, setKeys] = useState([])
  const [materialTab, setMaterialTab] = useState(MATERIAL_TABS.NORMAL)

  useEffect(() => {
    if (visible) {
      setKeys([])
      setSelectedTypes(defaultTypes)
      setMaterialTab(MATERIAL_TABS.NORMAL)
    }
  }, [visible])

  const oldChooseData = useMemo(() => {
    return getSelectedAttachObj(chooseMediaList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chooseMediaList])

  const couldChooseMap = useMemo(() => {
    const currentChooseData = getChooseDataByMaterial(keys)
    const { attachTypeData = {} } = oldChooseData
    const newAttachTypeData = mergeWith(
      currentChooseData,
      attachTypeData,
      (val1 = 0, val2 = 0) => val1 + val2
    )
    const chooseData = {
      attachTypeData: newAttachTypeData,
      attachChooseTypes: Object.keys(newAttachTypeData),
      chooseLen: keys.length + chooseMediaList.length,
    }
    return getCanChooseFilesData(chooseData, attachmentRules)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, attachmentRules, oldChooseData])

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(keys)
    }
  }

  const onMaterialSubTypeChange = (e) => {
    setSelectedTypes({
      ...selectedTypes,
      [materialTab]: e.target.value,
    })
  }

  const onKeysChange = (nextCheck, item, tabKey) => {
    const ruleType = MATERIAL_TO_RULETYPE[`${tabKey}_${item.type}`]
    if (!couldChooseMap[ruleType] && nextCheck) {
      message.warning(`不能再选啦！`)
    } else {
      setKeys((arr) =>
        nextCheck
          ? [
              ...arr,
              {
                ...item,
                tabKey,
              },
            ]
          : arr.filter((ele) => ele.uniqKey !== item.uniqKey)
      )
    }
  }

  const onMaterialTypeChange = (key) => {
    setMaterialTab(key)
  }

  const tabsConfig = useMemo(() => {
    return TABS_CONFIG.map((tab) => {
      return {
        ...tab,
        subTab: tab.subTab.map((item) => {
          const ruleType = MATERIAL_TO_RULETYPE[`${tab.key}_${item.value}`]
          const subTabDisabled = !Reflect.has(couldChooseMap, ruleType)
          return {
            ...item,
            disabled: subTabDisabled,
          }
        }),
      }
    })
  }, [couldChooseMap])

  return (
    <CommonDrawer
      visible={visible}
      onOk={handleOk}
      bodyStyle={{
        padding: 16,
      }}
      okButtonProps={{
        disabled: keys.length === 0,
      }}
      {...rest}
      width={740}
      className={styles['material-drawer']}>
      <Tabs activeKey={materialTab} onChange={onMaterialTypeChange}>
        {tabsConfig.map((item) => (
          <TabPane tab={item.tab} key={item.key}>
            <PanleContent
              typeList={item.subTab}
              onTypeChange={onMaterialSubTypeChange}
              tabKey={item.key}
              type={selectedTypes[item.key]}
              selectedKeys={keys}
              onChange={onKeysChange}
            />
          </TabPane>
        ))}
      </Tabs>
    </CommonDrawer>
  )
}

/**
 *
 * @param {Array} typeList 类型
 * @param {Function} onTypeChange 当类型变化时
 * @param {Function} onChange 勾选变化
 * @param {Array} selectedKeys 选中的值
 * @param {String} type 选中的类型值
 * @returns
 */
const PanleContent = (props) => {
  const {
    tabKey,
    type,
    onTypeChange,
    selectedKeys,
    onChange,
    typeList = [],
  } = props
  const handleChange = (...args) => {
    if (typeof onChange === 'function') {
      onChange(...args, tabKey)
    }
  }
  return (
    <>
      <div>
        <Radio.Group value={type} onChange={onTypeChange}>
          {typeList.map((item) => (
            <Radio value={item.value} key={item.value} disabled={item.disabled}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <div>
        <Tabs
          activeKey={`${type}`}
          tabBarStyle={{ height: 0, border: 'none' }}
          className={styles['material-tabs']}>
          {typeList.map((item) => {
            return (
              <TabPane key={item.value}>
                <TabContent
                  isActive={item.value === type}
                  needRemoteUrl={item.needRemote}
                  type={item.value}
                  tabKey={`${tabKey}`}
                  contentClassName={styles['list-content']}
                  renderChildren={(list) => {
                    if (
                      type === MATERIAL_TYPE_EN_VALS.PICTUER ||
                      type === MATERIAL_TYPE_EN_VALS.POSTER
                    ) {
                      return (
                        <ImgList
                          dataSource={list}
                          uniqKey={(record) => `${tabKey}_${record.id}`}
                          selectedKeys={selectedKeys}
                          onChange={handleChange}
                          disabled={item.disabled}
                        />
                      )
                    }
                    return (
                      <LinkList
                        dataSource={list}
                        selectedKeys={selectedKeys}
                        onChange={handleChange}
                        disabled={item.disabled}
                        uniqKey={(record) => `${tabKey}_${record.id}`}
                      />
                    )
                  }}
                />
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    </>
  )
}

export { ImgList }
export { TabContent as ContentList }

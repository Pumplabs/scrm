import {  useState, useEffect, useMemo, useRef} from 'react'
import { Modal, Tooltip, Tabs } from 'antd'
import { useRequest, usePrevious } from 'ahooks'
import cls from 'classnames'
import { PageContent } from 'layout'
import GroupSide from 'components/GroupSide'
import ImmediateInput from 'components/ImmediateInput'
import PaneContent from './components/PaneContent'
import { useModalHook } from 'src/hooks'
import {
  GetGroupList,
  AddGroup,
  EditGroup,
  RemoveGroup,
} from 'services/modules/commercialOpportunity'
import { GetConfigAllList } from 'services/modules/commercialOpportunityConfiguration'
import { actionRequestHookOptions } from 'services/utils'
import { OPP_STATUS_VALS } from './constants'
import styles from './index.module.less'

const { TabPane } = Tabs

const TABS_TYPE = {
  FOLLOW: 'follow',
  CLOSE: 'close',
}

export default () => {
  const [activeGroup, setActiveGroup] = useState({})
  const [activeTab, setActiveTab] = useState(TABS_TYPE.FOLLOW)
  const refreshStat = useRef({
    [TABS_TYPE.FOLLOW]: 0,
    [TABS_TYPE.CLOSE]: 0
  })
  const preTab = useRef(TABS_TYPE.FOLLOW)
  const {
    data: groupList,
    loading: groupListLoading,
    refresh: refreshGroup,
  } = useRequest(GetGroupList, {
    onSuccess: (res) => {
      const isExist = res.some((item) => item.id === activeGroup.id)
      if (!isExist && res[0]) {
        setActiveGroup(res[0])
      }
    },
  })
  const { run: runRemoveGroup } = useRequest(RemoveGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refreshGroup()
      },
    }),
  })
  const { run: runAddGroup } = useRequest(AddGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshGroup()
        closeModal()
      },
    }),
  })
  const { run: runEditGroup } = useRequest(EditGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshGroup()
        closeModal()
      },
    }),
  })

  const {
    data: stageList = [],
    run: runGetStageList,
    params: stageParams = [],
  } = useRequest(GetConfigAllList, {
    manual: true,
  })

  const { openModal, closeModal, modalInfo, confirmLoading, visibleMap } =
    useModalHook([
      'detail',
      'addGroup',
      'editGroup'
    ])

  useEffect(() => {
    if (activeGroup.id) {
      runGetStageList({
        groupId: activeGroup.id,
        typeCode: 'OPPORTUNITY_STAGE',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup.id])

  const onAddGroup = () => {
    openModal('addGroup')
  }

  const onEditGroup = (data) => {
    openModal('editGroup', data)
  }

  const onSelectGroup = (item) => {
    setActiveGroup(item)
  }

  const onRemoveGroup = (item) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除分组“${item.name}”吗`,
      centered: true,
      onOk: () => {
        runRemoveGroup({
          id: item.id,
        })
      },
    })
  }

  const onSaveGroup = (text) => {
    if (modalInfo.type === 'addGroup') {
      runAddGroup({
        name: text,
      })
    }
    if (modalInfo.type === 'editGroup') {
      runEditGroup({
        id: modalInfo.data.id,
        name: text,
      })
    }
  }

  const onAction = (key, item) => {
    switch (key) {
      case 'edit':
        onEditGroup(item)
        break
      case 'remove':
        onRemoveGroup(item)
        break
      default:
        break
    }
  }

  const onValidInputMsg = (text) => {
    const isExist = groupList.some(
      (ele) => ele.name === text && ele.id !== modalInfo.data.id
    )
    if (isExist) {
      return '分组名称已存在'
    }
  }

  const onTabChange = (key) => {
    if (preTab.current) {
     refreshStat.current[preTab.current] = 0
    }
    setActiveTab(key)
    preTab.current = key
  }

  const updateRefreshStat = () => {
    Object.values(TABS_TYPE).forEach(ele => {
      if (ele !== activeTab) {
        refreshStat.current[ele]++
      }
    })
  }

  const inputProps = {
    onSave: onSaveGroup,
    required: true,
    onCancel: closeModal,
    validMsg: onValidInputMsg,
    maxLength: 30,
    confirmLoading,
  }

  const {openStageList, closeStageList} = useMemo(() => {
    let openStageList= []
    let closeStageList = []
    stageList.forEach(item => {
      if (item.isSystem) {
        closeStageList = [...closeStageList, item]
      } else {
        openStageList = [...openStageList, item]
      }
    })
    return {
      openStageList,
      closeStageList
    }
  }, [stageList])
  return (
    <PageContent>
      <div className={styles['page']}>
        <div className={styles['left-side']}>
          <GroupSide
            title="全部分组"
            selectedKey={activeGroup.id}
            dataSource={groupList}
            loading={groupListLoading}
            onSelect={onSelectGroup}
            itemProps={{
              preAction: true,
              showAction: (item) => !item.isSystem,
              onAction: onAction,
            }}
            onAdd={onAddGroup}
            addonBefore={
              modalInfo.type === 'addGroup' ? (
                <div style={{ marginBottom: 6 }}>
                  <ImmediateInput {...inputProps} />
                </div>
              ) : null
            }
            renderItemContent={(item) => {
              return (
                <div
                  className={cls({
                    [styles['list-item']]: true,
                  })}>
                  <Tooltip title={item.name} placement="topLeft">
                    <span className={styles['group-name']}>{item.name}</span>
                  </Tooltip>
                  <span className={styles['group-count']}>{item.count}</span>
                </div>
              )
            }}
            renderItem={(item) => {
              if (
                modalInfo.type === 'editGroup' &&
                item.id === modalInfo.data.id
              ) {
                return (
                  <div style={{ marginBottom: 6 }}>
                    <ImmediateInput defaultValue={item.name} {...inputProps} />
                  </div>
                )
              } else {
                return undefined
              }
            }}
          />
        </div>
        <div className={styles['right-side']}>
          <Tabs activeKey={activeTab} onChange={onTabChange}>
            <TabPane tab="跟进中" key={TABS_TYPE.FOLLOW}>
              <PaneContent
                status={OPP_STATUS_VALS.FOLLOW}
                groupList={groupList}
                stageList={openStageList}
                sideLoading={groupListLoading}
                activeGroup={activeGroup}
                updateRefreshStat={updateRefreshStat}
                shouldRefresh={refreshStat.current[TABS_TYPE.FOLLOW] > 0 && TABS_TYPE.FOLLOW === activeTab}
              />
            </TabPane>
            <TabPane tab="已关闭" key={TABS_TYPE.CLOSE}>
              <PaneContent
                status={OPP_STATUS_VALS.CLOSE}
                groupList={groupList}
                stageList={closeStageList}
                sideLoading={groupListLoading}
                activeGroup={activeGroup}
                updateRefreshStat={updateRefreshStat}
                shouldRefresh={refreshStat.current[TABS_TYPE.CLOSE] > 0 && TABS_TYPE.CLOSE === activeTab}

              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContent>
  )
}

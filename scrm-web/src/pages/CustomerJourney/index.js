import { useEffect, useMemo, useState } from 'react'
import cls from 'classnames'
import { useRequest } from 'ahooks'
import { EllipsisOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Row, Col, Modal } from 'antd'
import { get } from 'lodash'
import { PageContent } from 'layout'
import GroupSide from 'components/GroupSide'
import OpenEle from 'components/OpenEle'
import AddJourneyDrawer from './components/AddJourneyDrawer'
import JourneyStages from './JourneyStages'
import StageContext from './StageContext'
import { useModalHook, useInfiniteHook } from 'src/hooks'
import {
  AddJourney,
  GetJourneyList,
  EditJourney,
  RemoveJourney,
  GetJourneyAllStage,
} from 'services/modules/customerJourney'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'
import { MAX_JOURNEY } from './constants'

export default () => {
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    setConfirm,
    confirmLoading,
  } = useModalHook(['addJourney', 'editJourney'])
  const [selectedJourney, setSelectedJourney] = useState({})
  const {
    run: runGetAllStage,
    loading: journeyStageLoading,
    data: stageList = [],
    mutate: mutateJourneyStage,
    refresh: refreshGetAllStage,
    cancel: cancelGetAllStage,
  } = useRequest(GetJourneyAllStage, {
    manual: true,
  })

  const {
    tableProps: journeyProps,
    run: runGetJourneyList,
  } = useInfiniteHook({
    request: GetJourneyList,
    onDoneUpdate: () => {
      const [firstItem = {}] = journeyProps.dataSource
      const isExist = journeyProps.dataSource.some(
        (item) => item.id === selectedJourney.id
      )
      if (!isExist) {
        setSelectedJourney(firstItem)
      }
    },
  })

  const { run: runAddJourney } = useRequest(AddJourney, {
    manual: true,
    onBefore() {
      setConfirm(true)
    },
    onFinally() {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        runGetJourneyList()
        closeModal()
      },
    }),
  })
  const { run: runEditJourney } = useRequest(EditJourney, {
    manual: true,
    onBefore() {
      setConfirm(true)
    },
    onFinally() {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: (_, [{ id }]) => {
        closeModal()
        if (id === selectedJourney.id) {
          refreshGetAllStage()
        }
        runGetJourneyList()
      },
    }),
  })
  const { run: runRemoveJourney } = useRequest(RemoveJourney, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        runGetJourneyList()
      },
    }),
  })

  const onAddJourney = () => {
    openModal('addJourney')
  }

  const onEditJourney = (data) => {
    openModal('editJourney', data)
  }

  const onSelectJourney = (item) => {
    setSelectedJourney(item)
  }

  const onRemoveJourney = (item) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除旅程"${item.name}"吗`,
      centered: true,
      onOk: () => {
        runRemoveJourney({
          id: item.id,
        })
      },
    })
  }

  const onAddJourneyOk = ({ stages, name }) => {
    if (modalInfo.type === 'addJourney') {
      runAddJourney({
        name,
        sort: 1,
        journeyStageList: stages.map((ele) => ({
          name: ele.name,
        })),
      })
    } else if (modalInfo.type === 'editJourney') {
      runEditJourney({
        name,
        sort: modalInfo.data.sort,
        id: modalInfo.data.id,
        journeyStageList: stages.map((ele) =>
          ele.isNew
            ? {
                name: ele.name,
              }
            : ele
        ),
      })
    }
  }

  useEffect(() => {
    if (selectedJourney.id) {
      mutateJourneyStage([])
      if (journeyStageLoading) {
        cancelGetAllStage()
      }
      runGetAllStage({
        journeyId: selectedJourney.id,
      })
    } else {
      if (stageList.length > 0) {
        mutateJourneyStage([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJourney])

  const journeyTitle = useMemo(() => {
    const actionName = modalInfo.type === 'editJourney' ? '编辑' : '新增'
    return `${actionName}旅程`
  }, [modalInfo.type])

  return (
    <PageContent>
      <StageContext.Provider
        value={{
          allStageList: stageList,
        }}>
        <AddJourneyDrawer
          title={journeyTitle}
          confirmLoading={confirmLoading}
          visible={
            visibleMap.addJourneyVisible || visibleMap.editJourneyVisible
          }
          stageList={stageList}
          onCancel={closeModal}
          data={modalInfo.data}
          onOk={onAddJourneyOk}
        />
        <Row gutter={20}>
          <Col span={6} className={styles['journeyListWrap']}>
            <GroupSide
              title={`旅程列表(${journeyProps.pagination.total})`}
              selectedKey={selectedJourney.id}
              onSelect={onSelectJourney}
              {...journeyProps}
              onAdd={onAddJourney}
              showAddIcon={journeyProps.dataSource.length < MAX_JOURNEY}
              renderItem={(ele) => {
                return (
                  <JourneyItem
                    data={ele}
                    key={ele.id}
                    onSelect={onSelectJourney}
                    isActive={ele.id === selectedJourney.id}
                    onEdit={onEditJourney}
                    onRemove={onRemoveJourney}
                  />
                )
              }}
            />
            {/* <Empty
                    description={
                      <div>
                        <p>没有创建任何旅程哦</p>
                        <Button type="primary" ghost onClick={onAddJourney}>
                          创建旅程
                        </Button>
                      </div>
                    }
                  /> */}
          </Col>
          <Col span={18} className={styles['journeyDetailWrap']}>
          <JourneyStages
                selectedJourney={selectedJourney}
                stageList={stageList}
                getAllJourney={runGetAllStage}
              />
          </Col>
        </Row>
      </StageContext.Provider>
    </PageContent>
  )
}

const JourneyItem = ({ data, onEdit, onSelect, onRemove, isActive }) => {
  const [isHover, setIsHover] = useState(false)
  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(data)
    }
  }
  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }
  const handleSelect = () => {
    if (typeof onSelect === 'function') {
      onSelect(data)
    }
  }

  const onMouseOver = () => {
    setIsHover(true)
  }

  const onMouseOut = () => {
    setIsHover(false)
  }

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={handleEdit}>
        编辑
      </Menu.Item>
      <Menu.Item key="remove" onClick={handleRemove}>
        删除
      </Menu.Item>
    </Menu>
  )

  const isAcitveItem = isHover || isActive
  return (
    <div
      className={cls({
        [styles['journey-list-item']]: true,
        [styles['journey-list-item-active']]: isAcitveItem,
      })}
      onClick={handleSelect}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}>
      <div className={styles['journey-list-item-header']}>
        <span className={styles['journey-name']}>{data.name}</span>
        <Dropdown overlay={menu}>
          <EllipsisOutlined className={styles['drop-icon']} />
        </Dropdown>
      </div>
      <div className={styles['journey-list-item-footer']}>
        <span className={styles['creator-name']}>
          <OpenEle
            type="userName"
            openid={get(data, 'creatorStaff.name')}
            style={{ color: isAcitveItem ? '#fff' : '#666' }}
          />
        </span>
        <span className={styles['create-time']}>{data.createdAt}</span>
      </div>
    </div>
  )
}

import React, { useState, useRef, useImperativeHandle } from 'react'
import { Empty } from 'antd'
import cls from 'classnames'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import {
  EditJourneyCustomer,
  MoveJourenyStageCustomer,
} from 'services/modules/customerJourney'
import StageCard from './StageCard'
import { DragContent } from '../DragStage/Draggable'
import CustomerItem from './CustomerItem'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

export default React.forwardRef(({ dataSource = [] }, ref) => {
  const listRefs = useRef({})
  const [dragInfo, setDragInfo] = useState(null)

  const refreshById = (stageId) => {
    if (listRefs.current[stageId]) {
      listRefs.current[stageId].getData()
    }
  }

  const rollbackStageList = (stageId) => {
    if (listRefs.current[stageId]) {
      listRefs.current[stageId].rollbackList()
    }
  }

  const moveStageData = (stageId, ...args) => {
    if (listRefs.current[stageId]) {
      listRefs.current[stageId].moveData(...args)
    }
  }

  const { run: runMoveJourneyCustomer } = useRequest(EditJourneyCustomer, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '移动',
      successFn: (_, [, { oldJourneyStageId, newJourneyStageId }]) => {
        refreshById(oldJourneyStageId)
        refreshById(newJourneyStageId)
      },
      failFn: ([, { oldJourneyStageId, newJourneyStageId }]) => {
        rollbackStageList(oldJourneyStageId)
        rollbackStageList(newJourneyStageId)
      },
    }),
  })
  const { run: runMoveUsers } = useRequest(MoveJourenyStageCustomer, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '移动',
      successFn: (_, [{ sourceId, targetId }]) => {
        refreshById(sourceId)
        refreshById(targetId)
      },
    }),
  })

  useImperativeHandle(ref, () => ({
    refreshById,
  }))

  function handleDragStart(event) {
    setDragInfo({
      data: event.active.data.current,
      id: event.active.id,
    })
  }

  function handleDragEnd(event) {
    if (event.over) {
      const dropId = event.over.id
      const oldJourneyStageId = dragInfo.data.journeyStageId
      if (dropId !== oldJourneyStageId) {
        const customerId = get(dragInfo, `data.customer.id`)
        const newJourneyStageId = event.over.data.current.id
        moveStageData(oldJourneyStageId, dragInfo.data)
        moveStageData(newJourneyStageId, dragInfo.data, true)
        runMoveJourneyCustomer(
          {
            customerId,
            id: dragInfo.data.id,
            journeyStageId: dropId,
          },
          {
            oldJourneyStageId,
            newJourneyStageId,
          }
        )
      }
    }
    setDragInfo(null)
  }

  const isDragging = !!dragInfo
  return (
    <ul
      className={cls({
        [styles['stage-list']]: true,
      })}
      ref={ref}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setDragInfo({})
        }}>
        {dataSource.length > 0 ? (
          dataSource.map((ele, idx) => (
            <li key={ele.id} className={styles['stage-list-float-item']}>
              <StageCard
                dragging={isDragging}
                data={ele}
                idx={idx}
                ref={(ref) => {
                  if (ref) {
                    listRefs.current[ele.id] = ref
                  }
                }}
                moveUsersRequest={runMoveUsers}
              />
            </li>
          ))
        ) : (
          <Empty description="暂时没有阶段数据哦" />
        )}
        <DragOverlay>
          {dragInfo ? <CustomerOverlay data={dragInfo.data} /> : null}
        </DragOverlay>
      </DndContext>
    </ul>
  )
})

const CustomerOverlay = ({ data, ...rest }) => {
  return (
    <DragContent
      dragId={data.id}
      data={data}
      dragOverlay={true}
      dragging={true}>
      <CustomerItem data={data} {...rest} removeable={true} />
    </DragContent>
  )
}

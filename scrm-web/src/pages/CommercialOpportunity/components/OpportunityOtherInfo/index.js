import { useState, useImperativeHandle, forwardRef, useMemo } from 'react'
import { Tabs, Empty, Modal } from 'antd'
import { useRequest } from 'ahooks'
import OpportunityMoment from './components/OpportunityMoment'
import OppFollow from './components/OppFollow'
import OppTask from './components/OppTask'
import { AttachPane } from './components/OppFollow/FollowContent'
import { actionRequestHookOptions } from 'services/utils'
import { DoneOppTask } from 'services/modules/commercialOpportunity'
import styles from './index.module.less'
const { TabPane } = Tabs
const TAB_KEYS = {
  MOMENT: 'moment',
  FOLLOW: 'follow',
  TASK: 'task',
  ATTACH: 'attachment',
}
export default forwardRef((props, ref) => {
  const { data = {}, refresh, toFirstOppMoment, momentPaneProps = {} } = props
  const [activeKey, setActiveKey] = useState(TAB_KEYS.MOMENT)

  const { run: runDoneOppTask } = useRequest(DoneOppTask, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        toFirstOppMoment()
        refresh()
      },
    }),
  })

  const resetKey = () => {
    setActiveKey(TAB_KEYS.MOMENT)
  }

  useImperativeHandle(ref, () => ({
    resetKey,
  }))
  const onTabChange = (tab) => {
    setActiveKey(tab)
  }

  const onDoneTask = (item) => {
    Modal.confirm({
      title: '提示',
      content: `确定要将任务“${item.name}”更改为已完成吗?`,
      onOk: () => {
        runDoneOppTask({
          taskId: item.id,
        })
      },
    })
  }

  const { followList, mediaList, taskList } = useMemo(() => {
    const { followList, mediaList, taskList } = data
    return {
      followList: Array.isArray(followList) ? followList : [],
      mediaList: Array.isArray(mediaList) ? mediaList : [],
      taskList: Array.isArray(taskList) ? taskList : [],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.followList])

  return (
    <div className={styles['other-side']} ref={ref}>
      <Tabs activeKey={activeKey} onChange={onTabChange}>
        <TabPane tab="商机动态" key={TAB_KEYS.MOMENT}>
          <OpportunityMoment {...momentPaneProps} />
        </TabPane>
        <TabPane tab="商机跟进" key={TAB_KEYS.FOLLOW}>
          <OppFollow
            dataSource={followList}
            refresh={refresh}
            onDoneTask={onDoneTask}
          />
        </TabPane>
        <TabPane tab="关联任务" key={TAB_KEYS.TASK}>
          {taskList.length ? (
            <OppTask dataSource={taskList} onDoneTask={onDoneTask} />
          ) : (
            <div style={{ paddingBottom: 20 }}>
              <Empty />
            </div>
          )}
        </TabPane>
        <TabPane tab="关联附件" key={TAB_KEYS.ATTACH}>
          <div className={styles['attach-pane']}>
            {mediaList.length ? <AttachPane list={mediaList} /> : <Empty />}
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
})

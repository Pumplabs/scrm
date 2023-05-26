import { useEffect, useMemo, useState } from 'react'
import { Collapse } from 'antd'
import cls from 'classnames'
import moment from 'moment'
import { MsgCell } from 'components/WeChatMsgEditor'
import DescriptionsList from 'components/DescriptionsList'
import ExcuteResult from '../ExcuteResult'
import SendTime from '../SendTime'
import { REPEAT_TYPES } from '../../constants'
import styles from './index.module.less'

const { Panel } = Collapse
const descItemProps = {
  labelWidth: 62,
  labelStyle: {
    fontSize: 12,
  },
}
/**
 * @param {String} triggerName 触发条件
 * @param {Object} data 数据
 * @param {Function} onDetail 点击详情
 * @param {Array} wayOptions 执行方式数据
 * @param {Boolean} isTriggerTime 触发条件为时间
 * @param {String} executorName 执行人名称
 * @param {String} executedName 执行对象名称
 */
export default (props) => {
  const {
    triggerName,
    isTriggerTime,
    data = {},
    onDetail,
    executorName = '',
    executedName = '',
    msgProps = {},
    visible,
    children,
  } = props
  const [collapseKey, setCollapseKey] = useState(['1'])
  useEffect(() => {
    if (!visible) {
      setCollapseKey(['1'])
    }
  }, [visible])

  const onChangeCollapse = (keys) => {
    setCollapseKey(keys)
  }

  const { startDate, endDate } = useMemo(() => {
    if (data.startDate) {
      return {
        startDate: data.startDate,
        endDate: data.endDate,
      }
    }
    const startDate = data.executeAt
      ? moment(data.executeAt).format('YYYY/MM/DD')
      : ''
    let endDate = ''
    const endDateStr = data.endAt
      ? moment(data.endAt, 'YYYY-MM-DD').format('YYYY/MM/DD')
      : ''
    if (startDate) {
      switch (data.period) {
        case REPEAT_TYPES.DATE:
        case REPEAT_TYPES.WEEK:
        case REPEAT_TYPES.TWO_WEEK:
        case REPEAT_TYPES.MONTH:
        case REPEAT_TYPES.DEFINED:
          endDate = endDateStr
          break
        case REPEAT_TYPES.NEVER:
          endDate = startDate
          break
        default:
          break
      }
    }
    return {
      startDate,
      endDate,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const executeList = Array.isArray(data.executeDetailList)
    ? data.executeDetailList
    : []
  const isRepeatTask = executeList.length > 1
  return (
    <div className={styles['rule-item']}>
      <div className={styles['rule-item-header']}>
        <p className={styles['rule-title']}>{data.ruleName}</p>
        <DescriptionsList.Item label="规则描述" {...descItemProps}>
          <SendTime
            data={data}
            prefix={triggerName}
            suffix={'发送以下消息'}
            isTriggerTime={isTriggerTime}
          />
        </DescriptionsList.Item>
        {isTriggerTime ? (
          <DescriptionsList.Item label="执行周期" {...descItemProps}>
            {startDate}-{endDate}
          </DescriptionsList.Item>
        ) : (
          false
        )}
      </div>
      <div className={styles['rule-item-body']}>
        <div className={styles['msg-content']}>
          <span className={styles['info-label']}>消息内容</span>
          <span>
            <MsgCell data={data.msg} maxHeight="auto" {...msgProps} />
          </span>
        </div>
        <Collapse
          activeKey={collapseKey}
          bordered={false}
          onChange={onChangeCollapse}
          expandIconPosition="right">
          <Panel
            header="任务概况"
            {...(isRepeatTask
              ? {}
              : {
                  showArrow: false,
                  collapsible: 'disabled',
                })}
            key="1"
            className={cls({
              [styles['disabled-collapse-panel']]: !isRepeatTask,
              [styles['collapse-panel']]: true,
            })}>
            {children ? (
              children
            ) : (
              <>
                {executeList.length
                  ? executeList.map((taskItem) => (
                      <TaskExecuteResultItem
                        ruleData={data}
                        data={taskItem}
                        key={taskItem.executeAt}
                        onDetail={onDetail}
                        executorName={executorName}
                        executedName={executedName}
                      />
                    ))
                  : '暂无'}
              </>
            )}
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}

/**
 * 任务执行结果
 * @param {Object} data 任务数据
 * @param {Object} ruleData 规则数据
 * @param {Function} onDetail 点击详情
 * @param {String} executorName 执行人名称
 * @param {String} executedName 执行对象名称
 * @returns 
 */
const TaskExecuteResultItem = ({ data = {}, onDetail, ruleData, executorName, executedName }) => {
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail({
        ...data,
        ruleId: ruleData.id,
      })
    }
  }
  return (
    <div className={styles['execute-item']}>
      <p className={styles['execute-item-header']}>
        <span className={styles['execute-time']}>{data.executeAt}</span>提醒
        <span className={styles['count-item']}>{data.doneNum}</span>个{executorName}给
        <span className={styles['count-item']}>{data.customerNum || data.chatNum}</span>
        个{executedName}推送消息
      </p>
      {/* 执行结果 */}
      <ExcuteResult
        onClick={handleDetail}
        name={executorName}
        undoneStr={`${executorName}未完成发送`}
        data={{
          successCount: data.doneNum - data.notDoneNum,
          failCount: data.notDoneNum,
        }}
      />
    </div>
  )
}
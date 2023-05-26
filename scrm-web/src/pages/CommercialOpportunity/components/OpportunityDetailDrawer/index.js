import { useEffect, useRef } from 'react'
import { Row, Col, Button, Spin } from 'antd'
import { useRequest } from 'ahooks'
import CommonDrawer from 'components/CommonDrawer'
import OpportunityBaseInfo from '../OpportunityBaseInfo'
import OpportunityOtherInfo from '../OpportunityOtherInfo'
import AddFollowDrawer from '../AddFollowDrawer'
import { useInfiniteHook, useModalHook } from 'src/hooks'
import {
  getMediaParams,
  TEXT_KEY_BY_VAL,
} from 'components/WeChatMsgEditor/utils'
import { handleTime } from 'src/utils/times'
import {
  AddFollow,
  GetOppDetail,
  GetOppMoment
} from 'services/modules/commercialOpportunity'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

export default (props) => {
  const { visible, data = {}, groupName, ...rest } = props
  const otherInfoRef = useRef(null)
  const {
    openModal,
    visibleMap,
    closeModal,
    confirmLoading,
    requestConfirmProps,
  } = useModalHook(['addFollow', 'addTask'])
  const {
    run: runGetOppDetail,
    data: oppData = {},
    refresh: refreshDetailData,
    loading: oppDetailLoading,
  } = useRequest(GetOppDetail, {
    manual: true,
  })
  const { run: runAddFollow } = useRequest(AddFollow, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '创建',
      successFn: () => {
        runGetOppMoment(
          {},
          {
            dataId: data.id,
          }
        )
        refreshDetailData()
        closeModal()
      },
    }),
  })

  const {
    run: runGetOppMoment,
    tableProps: oppTableProps,
    params: momentSearchParams,
    toFirst: toFirstOppMoment
  } = useInfiniteHook({
    manual: true,
    rigidParams: {
      tableName: 'br_opportunity',
    },
    request: GetOppMoment,
  })
  useEffect(() => {
    if (data.id) {
      runGetOppMoment(
        {},
        {
          dataId: data.id,
        }
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  const cooperatorList = Array.isArray(data.cooperatorList)
    ? data.cooperatorList
    : []

  useEffect(() => {
    if (visible) {
      if (otherInfoRef.current) {
        otherInfoRef.current.resetKey()
        runGetOppDetail({
          id: data.id,
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onAddFollow = () => {
    openModal('addFollow')
  }

  const putTaskFieldValues = (fieldValues = {}) => {
    let res = {}
    Object.entries(fieldValues).forEach(([key, val]) => {
      if (key.startsWith(`todoTask`)) {
        const [, recordId, keyName] = key.split('_')
        if (res[recordId]) {
          res[recordId][keyName] = val
        } else {
          res[recordId] = {
            [keyName]: val,
          }
        }
      }
    })
    return res
  }

  const handleFollowTaskParams = (taskList = [], taskFieldVals = {}) => {
    const taskVals = putTaskFieldValues(taskFieldVals)
    return taskList.map((ele) => {
      const recordVals = taskVals[ele.id] || {}
      let data = {
        finishAt: handleTime(recordVals.doneTime, {
          format: 'YYYY-MM-DD HH:mm',
          suffix: ':00',
        }),
        name: recordVals.name,
        owner: recordVals.principal,
        status: ele.status || 0,
      }
      if (ele.isOld) {
        data.id = ele.id
      }
      return data
    })
  }
  const onAddFollowOk = (vals) => {
    const {
      followContent = {},
      remindFollow = {},
      taskList = [],
      taskSettings = {},
      remindCoordinate = {},
      ...taskFieldVals
    } = vals
    let params = {
      content: {
        media: getMediaParams(followContent.media),
        text: [
          {
            type: TEXT_KEY_BY_VAL.TEXT,
            content: followContent.text,
          },
        ],
      },
      followTaskList: [],
      extCustomerStaffList: [
        {
          extCustomerId: data.id,
        },
      ],
      isTodo: false,
      shareExtStaffIds: [],
      type: 2,
    }
    if (taskSettings.checked) {
      params.isTodo = true
      params.followTaskList = handleFollowTaskParams(taskList, taskFieldVals)
    }
    if (remindFollow.checked && remindFollow.data) {
      params.remindAt = `${remindFollow.data.format('YYYY-MM-DD HH:mm')}:00`
    }
    if (remindCoordinate.checked && cooperatorList.length > 0) {
      params.shareExtStaffIds = cooperatorList.map((ele) => ele.cooperatorId)
    }
    runAddFollow(params)
  }
  return (
    <CommonDrawer
      visible={visible}
      footer={null}
      {...rest}
      width={940}
      closable={true}
      extra={
        <Button onClick={onAddFollow} type="primary">
          添加跟进
        </Button>
      }>
      <AddFollowDrawer
        confirmLoading={confirmLoading}
        onCancel={closeModal}
        onOk={onAddFollowOk}
        title="添加跟进"
        visible={visibleMap.addFollowVisible}
        cooperatorList={cooperatorList}
      />
      <Spin spinning={oppDetailLoading}>
        <Row>
          <Col span={10}>
            <OpportunityBaseInfo data={oppData} groupName={groupName} />
          </Col>
          <Col span={14}>
            <div className={styles['other-side']}>
              <OpportunityOtherInfo
                data={oppData}
                toFirstOppMoment={toFirstOppMoment}
                momentPaneProps={{
                  dataSource: oppTableProps.dataSource,
                  pagination: oppTableProps.pagination,
                  searchParams: momentSearchParams,
                  loadNext: oppTableProps.onChange,
                }}
                refresh={refreshDetailData}
                ref={(r) => (otherInfoRef.current = r)}
              />
            </div>
          </Col>
        </Row>
      </Spin>
    </CommonDrawer>
  )
}

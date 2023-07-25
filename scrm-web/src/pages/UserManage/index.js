import { useState, useMemo, useEffect, useRef } from 'react'
import { Button, Row, Col, Form, message } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { SyncOutlined, ExportOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import UserTag from 'components/UserTag'
import { PageContent } from 'src/layout'
import DepCard from './DepCard'
import {
  getUserByDepId,
  AsyncUserData,
  ExportUser,
  GetTreeDepData,
} from 'services/modules/userManage'
import styles from './index.module.less'
import { GENDER_OPTIONS, STATUS_OPTIONS } from './constants'
import { exportByLink, getRequestError, actionRequestHookOptions } from 'services/utils'

function loopFindTreeData(dataSource, fn, config = {}) {
  const { childKey = 'children' } = config
  for (const item of dataSource) {
    const { [childKey]: children } = item
    const fnRes = typeof fn === 'function' ? fn(item) : true
    if (fnRes) {
      return
    }
    if (Array.isArray(children) && children.length > 0) {
      loopUpdateTreeData(children, fn, config)
    }
  }
}
function loopUpdateTreeData(dataSource, fn, config = {}) {
  const { childKey = 'children' } = config
  let res = []
  for (const item of dataSource) {
    const { [childKey]: children, ...rest } = item
    let data = {
      ...rest,
    }
    if (Array.isArray(children) && children.length > 0) {
      data[childKey] = loopUpdateTreeData(children, fn, config)
    }
    const fnRes = typeof fn === 'function' ? fn(data) : data
    if (fnRes) {
      res = Array.isArray(fnRes) ? [...res, ...fnRes] : [...res, fnRes]
    }
  }
  return res
}

export default () => {
  const [treeExpandKeys, setTreeExpandKeys] = useState([])
  const [depTreeData, setDepTreeData] = useState([])
  const [tableSelectedKeys, setTableSelectedKeys] = useState([])
  const [selectedNode, setSelectedNode] = useState({})
  const [searchForm] = Form.useForm()
  const companyNodeRef = useRef({})
  const initOpen = useRef(false)

  const { selectedKeys, selectedKey } = useMemo(() => {
    const selectedKey = selectedNode.id || selectedNode.key
    return {
      selectedKey,
      selectedKeys: selectedKey ? [selectedKey] : [],
    }
  }, [selectedNode])

  const { loading: depLoading, refresh: refreshAllDep } = useRequest(
    GetTreeDepData,
    {
      onFinally: (par, data) => {
        const [firstNode] = data
        if (firstNode) {
          const { children: treeList = [], ...companyNode } = firstNode
          setDepTreeData(data)
          companyNodeRef.current = companyNode
          if (!initOpen.current || !selectedKeys.length) {
            initOpen.current = true
            setTreeExpandKeys([companyNode.id])
          }
          if (selectedNode.id) {
            let hasFindSelected = false
            loopFindTreeData(data, (node) => {
              if (node.id === selectedNode.id) {
                hasFindSelected = true
                return true
              }
            })
            if (!hasFindSelected) {
              setSelectedNode(companyNode)
            }
          } else {
            setSelectedNode(companyNode)
          }
        } else {
          companyNodeRef.current = {}
          setSelectedNode({})
          setTreeExpandKeys([])
          setDepTreeData([])
        }
      },
    }
  )
  const { run: runAsyncUserData, loading: asyncLoading } = useRequest(
    AsyncUserData,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '同步',
        successFn: () => {
          refreshUserList()
          refreshAllDep()
        },
      }),
    }
  )
  const { run: runExportUser } = useRequest(ExportUser, {
    manual: true,
    onError: (e) => getRequestError(e, '导出异常')
  })

  const {
    search,
    run: runGetUserByDepId,
    refresh: refreshUserList,
    tableProps,
    params: [pagerParams, formParams = {}],
  } = useAntdTable(
    (pager, par) =>
      getUserByDepId(pager, {
        ...par,
        departmentId: selectedKey,
      }),
    {
      manual: true,
      defaultPageSize: 10,
      refreshDeps: [selectedKey],
      form: searchForm,
    }
  )

  useEffect(() => {
    if (selectedKey) {
      runGetUserByDepId(pagerParams, {
        ...formParams,
        departmentId: selectedKey,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey])

  useEffect(() => {
    if (selectedKey) {
      runGetUserByDepId(pagerParams, {
        ...formParams,
        departmentId: selectedKey,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey])

  const columns = [
    {
      dataIndex: 'name',
      title: '员工',
      render: (val, record) => {
        return (
          <UserTag
            data={{
              avatarUrl: record.avatarUrl,
              name: val,
            }}
          />
        )
      },
    },
    {
      title: '客户数量',
      dataIndex: 'customerCount',
      render: val => val > 0 ? val : 0
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (v) => {
        const item = GENDER_OPTIONS.find((ele) => `${ele.value}` === `${v}`)
        if (item) {
          return item.name
        } else {
          return '-'
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v) => {
        const item = STATUS_OPTIONS.find((ele) => `${ele.value}` === `${v}`)
        if (item) {
          return item.label
        } else {
          return ''
        }
      },
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
    },
  ]

  const onExpandTree = (keys) => {
    setTreeExpandKeys(keys)
  }
  const onTableRowChange = (keys) => {
    setTableSelectedKeys(keys)
  }
  const onSelectTree = (keys, { node }) => {
    setSelectedNode(node)
  }

  const onAsyncUser = () => {
    runAsyncUserData()
  }

  const onExport = () => {
    runExportUser(formParams)
  }

  const configList = [
    {
      label: '员工姓名',
      name: 'name',
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      eleProps: {
        options: STATUS_OPTIONS,
      },
    },
  ]

  return (
    <PageContent loading={asyncLoading} loadingText="正在同步中...">
      <Row className={styles['page-row']}>
        <Col span={6} className={styles['dep-side']}>
          <DepCard
            loading={depLoading}
            isSelectedCompany={
              companyNodeRef.current.id &&
              companyNodeRef.current.id === selectedKey
            }
            dataSource={depTreeData}
            onSelect={onSelectTree}
            selectedKeys={selectedKeys}
            onExpand={onExpandTree}
            expandedKeys={treeExpandKeys}
          />
        </Col>
        <Col span={18}>
          <div>
            <SearchForm
              name="userSearch"
              configList={configList}
              form={searchForm}
              onSearch={search.submit}
              onReset={search.reset}
            />
            <TableContent
              columns={columns}
              {...tableProps}
              rowSelection={{
                selectedRowKeys: tableSelectedKeys,
                onChange: onTableRowChange,
              }}
              rowKey="id"
              toolBar={[
                <Button
                  onClick={onAsyncUser}
                  key="async"
                  type="primary"
                  ghost
                  loading={asyncLoading}>
                  <SyncOutlined />
                  同步数据
                </Button>,
                <Button key="export" onClick={onExport} type="primary" ghost>
                  <ExportOutlined />
                  导出excel
                </Button>
              ]}
            />
          </div>
        </Col>
      </Row>
    </PageContent>
  )
}

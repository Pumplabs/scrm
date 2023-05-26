import { forwardRef, useEffect, useContext, useMemo, useState } from 'react'
import { Form, message, Tree } from 'antd'
import { mergeWith, isEqual } from 'lodash'
import OpenEle from 'components/OpenEle'
import ModalContext from '../../ModalContext'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'

const loopConverData = (arr, options) => {
  let res = []
  let keysMap = {
    dep: [],
    user: [],
  }
  let opt = {}
  if (!Array.isArray(arr)) {
    return {
      arr: res,
      opt,
      keysMap,
    }
  }
  const { disabledDep, disableArr = [], valueKey } = options
  arr.forEach((ele) => {
    const depKey = `dep_${ele[valueKey]}`
    const depTreeKey =`${depKey}_${ele.pkey}`
    const depItem = {
      id: ele.id,
      extId: ele.extId,
      key: depKey,
      treeKey: depTreeKey,
      name: ele.name,
      disabled: disabledDep || disableArr.includes(depKey),
      isDep: true,
    }
    opt[depKey] = [depTreeKey]
    let childArr = []
    if (Array.isArray(ele.staffList) && ele.staffList.length) {
      ele.staffList.forEach((staffItem) => {
        const staffKey = `user_${staffItem[valueKey]}`
        const treeKey = `${staffKey}_${ele.pkey}`
        const staffData = {
          avatarUrl: staffItem.avatarUrl,
          name: staffItem.name,
          key: staffKey,
          treeKey,
          id: staffItem.id,
          isUser: true,
          extId: staffItem.extId,
          disabled: disableArr.includes(staffKey),
        }
        if (!opt[staffKey]) {
          opt[staffKey] = [treeKey]
        } else {
          opt[staffKey] = [...opt[staffKey], treeKey]
        }
        childArr = [...childArr, staffData]
        keysMap.dep = [...keysMap.dep, depTreeKey]
        keysMap.user = [...keysMap.user, treeKey]
      })
    }
    if (Array.isArray(ele.children) && ele.children.length) {
      const {
        arr: childRes,
        opt: childOpt,
        keysMap: childKeysMap,
      } = loopConverData(ele.children, options)
      childArr = [...childArr, ...childRes]
      opt = mergeWith(opt, childOpt, (arr1 = [], arr2 = []) => [
        ...arr1,
        ...arr2,
      ])
      keysMap.dep = [...keysMap.dep, ...childKeysMap.dep]
      keysMap.user = [...keysMap.user, ...childKeysMap.user]
    }
    res = [
      ...res,
      {
        ...depItem,
        children: childArr,
      },
    ]
  })
  return {
    arr: res,
    opt,
    keysMap,
  }
}
/**
 * @param {String} valueKey 值
 * @param {Function} onFilterChange 当筛选条件变化时
 * @param {ReactNode} formContent 表单内容
 * @param {Array} selectedArr 选中的值
 * @param {Function} onKeysChange 当勾选变化时
 * @param {Boolean} disabledDep 是否禁用部门
 * @param {Array} disableArr 禁用列表
 * @param {Number} max 最多可勾选数量
 * @param {Array} dataSource 源数据
 */
const TreeSide = forwardRef((props, ref) => {
  const {
    max,
    valueKey,
    dataSource = [],
    disableArr,
    onFilterChange,
    disabledDep,
    formContent,
    selectedArr,
    onKeysChange,
  } = props
  const [form] = Form.useForm()
  const { visible } = useContext(ModalContext)
  const [expandedKeys, setExpandedKeys] = useState([])

  const {
    arr: depData,
    opt: treeObj,
    keysMap: treeKeysMap,
  } = useMemo(() => {
    return loopConverData(dataSource, { disabledDep, disableArr, valueKey })
  }, [dataSource, disabledDep, disableArr, valueKey])

  useEffect(() => {
    if (depData.length) {
      const values = form.getFieldsValue()
      const isAllEmpty = Object.values(values).every((item) => {
        return (
          item === null ||
          item === undefined ||
          item === '' ||
          isEqual(item, [])
        )
      })
      const nextKeys = isAllEmpty ? [depData[0].treeKey] : treeKeysMap.dep
      setExpandedKeys(nextKeys)
    } else {
      setExpandedKeys([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depData])

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onExpand = (keys) => {
    setExpandedKeys(keys)
  }

  const onCheck = (checkedKeys, { checked, node }) => {
    const nodeData = node.props.data
    if (checked && selectedArr.length >= max) {
      message.warning(`最多只能选择${max}项数据`)
      return
    }
    onKeysChange(
      checked
        ? [...selectedArr, nodeData]
        : selectedArr.filter((ele) => ele.key !== nodeData.key)
    )
  }

  const checkedKeys = useMemo(() => {
    let keys = []
    selectedArr.forEach((ele) => {
      const arr = treeObj[ele.key] || [ele.key]
      keys = [...keys, ...arr]
    })
    return keys
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArr, treeObj])

  const defaultExpandedKeys = useMemo(() => {
    if (depData.length) {
      return [depData[0].treeKey]
    } else {
      return []
    }
  }, [depData])
  return (
    <div ref={ref}>
      <Form
        onValuesChange={onFilterChange}
        form={form}
        labelCol={{
          span: 0,
        }}
        wrapperCol={{ span: 24 }}>
        {formContent}
      </Form>
      <div>
        <Tree
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          defaultExpandedKeys={defaultExpandedKeys}
          checkable
          checkStrictly={true}
          checkedKeys={checkedKeys}
          fieldNames={{
            key: 'treeKey',
          }}
          onCheck={onCheck}
          treeData={depData}
          titleRender={(nodeData) => {
            const type = nodeData.isDep ? 'departmentName' : 'userName'
            return (
              <span>
                {nodeData.isUser ? (
                  <img
                    alt=""
                    width={14}
                    style={{ marginRight: 4 }}
                    src={
                      nodeData.avatarUrl ? nodeData.avatarUrl : defaultAvatorUrl
                    }
                  />
                ) : null}
                <OpenEle type={type} openid={nodeData.name} />
              </span>
            )
          }}
        />
      </div>
    </div>
  )
})

export default TreeSide

import { Tree } from 'antd'
import ImmediateInput from 'components/ImmediateInput'
import DepName from 'components/DepName'
import styles from './index.module.less'

const { TreeNode } = Tree

const TitleNode = (props) => {
  const { nodeData, inputNode } = props
  if (nodeData.eleType === 'input') {
    return inputNode
  }
  return (
    <div className={styles['treetitle-wrap']}>
      <DepName id={nodeData.name}/>
      <span style={{ marginLeft: 4 }}>({nodeData.staffNum})</span>
    </div>
  )
}
export default (props) => {
  const {
    treeData,
    modifyNode,
    onInputCancel,
    onInputOk,
    onEditNode,
    onRemoveNode,
    ...rest
  } = props

  const loopNodes = (data) => {
    return data.map((ele, idx) => {
      if (Array.isArray(ele.children) && ele.children) {
        return (
          <TreeNode
            title={
              <TitleNode
                nodeData={ele}
              />
            }
            key={ele.id}>
            {loopNodes(ele.children)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode
            title={
              <TitleNode
                nodeData={ele}
              />
            }
            key={ele.id}></TreeNode>
        )
      }
    })
  }

  return (
    <Tree
      blockNode={true}
      showIcon
      {...rest}>
      {loopNodes(treeData)}
    </Tree>
  )
}

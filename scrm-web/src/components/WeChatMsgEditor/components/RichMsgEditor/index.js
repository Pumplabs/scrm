import React from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { NINAME_LABEL } from '../../constants'
import 'braft-editor/dist/index.css'
import { TEXT_KEY_BY_VAL } from '../../utils'
import styles from './index.module.less'

var includeEditors = []
export const MAX_COUNT = 600
const entityExtension = {
  // 指定扩展类型
  type: 'entity',
  name: 'KEYBOARD-ITEM',
  mutability: 'IMMUTABLE',
  data: {
    foo: 'hello',
  },
  component: (props) => {
    const entity = props.contentState.getEntity(props.entityKey)
    const { foo } = entity.getData()
    return (
      <span data-foo={foo} className={styles['keyboard-item']}>
        {props.children}
      </span>
    )
  },
  importer: (nodeName, node, source) => {
    if (
      nodeName.toLowerCase() === 'span' &&
      node.classList &&
      node.classList.contains('keyboard-item')
    ) {
      return {
        mutability: 'IMMUTABLE',
        data: {
          foo: node.dataset.foo,
        },
      }
    }
  },
  exporter: (entityObject, originalText) => {
    const { foo } = entityObject.data
    return (
      <span data-foo={foo} className="keyboard-item">
        {originalText}
      </span>
    )
  },
}
const getFillRichText = (arr = [], editorId) => {
  const htmlText = '<span class="keyboard-item">用户昵称</span>'
  let content = ''
  arr.forEach((ele) => {
    if (ele.type === TEXT_KEY_BY_VAL.NICKNAME) {
      content += htmlText
    }
    if (ele.type === TEXT_KEY_BY_VAL.TEXT) {
      content += ele.content
    }
  })
  const contentStr = content ? `<p>${content}</p>` : ''
  return BraftEditor.createEditorState(contentStr, {
    editorId,
  })
}
function createEntityExtension() {
  return {
    ...entityExtension,
    includeEditors,
  }
}
const registerNickNameExension = (editorId) => {
  if (!includeEditors.includes(editorId)) {
    includeEditors = [...includeEditors, editorId]
    BraftEditor.use(createEntityExtension())
  }
}

const getRealTextLength = (editorState, ninameLabel = NINAME_LABEL) => {
  if (!editorState) {
    return 0
  }
  const curCount = editorState ? editorState.toText().length : 0
  const htmlData = editorState.toHTML()
  const entityReg = /<span class="keyboard-item">/g
  const matchRes = htmlData.match(entityReg) || []
  const varCount = matchRes.length
  const varLen = ninameLabel.length
  return curCount - varCount * varLen
}
/**
 * @param {String} ninameLabel 昵称名称，默认为“用户昵称”
 * @param {String} editorId 编辑器id
 * @param {String} value
 */
class RichEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleChange = (editorState) => {
    this.changeEditorState(editorState)
  }

  onAdd = () => {
    const { value: editorState, ninameLabel = NINAME_LABEL } = this.props
    const htmlText = `<span class="keyboard-item">${ninameLabel}</span>`
    const nextEditorState = ContentUtils.insertHTML(editorState, htmlText)
    this.changeEditorState(nextEditorState)
  }

  changeEditorState = (editorState) => {
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      onChange(editorState)
    }
  }

  render() {
    const { value: editorState, editorId, ninameLabel } = this.props
    const curCount = getRealTextLength(editorState, ninameLabel)

    return (
      <div style={{ height: 390, position: 'relative' }}>
        <BraftEditor
          id={editorId}
          controls={[]}
          value={editorState}
          className={styles['braft-editor']}
          contentStyle={{ height: 320 }}
          onChange={this.handleChange}
        />
        <div className={styles['editor-word-count']}>
          {curCount}/{MAX_COUNT}
        </div>
      </div>
    )
  }
}

export { entityExtension, getFillRichText,getRealTextLength, registerNickNameExension }
export default RichEditor

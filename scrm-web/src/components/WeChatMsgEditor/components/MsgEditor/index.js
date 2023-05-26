import { useState, forwardRef, useMemo } from 'react'
import { uniqueId, isEmpty } from 'lodash'
import cls from 'classnames'
import { ContentUtils } from 'braft-utils'
import RichMsgEditor from '../RichMsgEditor'
import TextAreaWithCount from 'components/TextAreaWithCount'
import {
  AddImgModal,
  AddLinkModal,
  AddMiniApp,
  ChooseMaterialDrawer,
  ChooseTextDrawer,
  ChooseVideoModal,
} from '../AttachmentFileModal'
import { MATERIAL_TABS } from '../AttachmentFileModal/ChooseMaterialDrawer'
import AttachmentList from '../AttachmentList'
import { ATTACH_TYPE_EN_VAL, NINAME_LABEL } from '../../constants'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
import { useModalHook } from 'src/hooks'
import store from 'store'
import { createUrlByType } from 'src/utils/paths'
import { validShouldAddAttach } from '../../valid'
import styles from './index.module.less'

const initModalType = [
  'chooseText',
  'img',
  'app',
  'video',
  'link',
  'editimg',
  'editapp',
  'editlink',
  'editvideo',
  'material',
  'normalmaterial',
]
/**
 * @param {ReactNode} editor 编辑器
 * @param {String} editorType 编辑器类型 text 纯文本
 * @param {reactNode} footer 底部
 * @param {Number} maxAttachCount 附件数量
 * @param {Object} attachmentRules 附件规则
 * * @param {String} type 规则条件， and(且都可以) , or(或， n选1)
 * * @param {Array} options 规则选项, 可选
 * * * @param {String} type 附件类型, img, video, link, text miniprogram
 * * * @param {Number} max 最多支持的附件数，如果不设置，则默认为最大附件数
 * * @param {Number} max 如果不设置options,则可以直接设置max。表示
 * @example  只能选图片和链接
 * {
 *   type: 'and',
 *  options: [
 *   {
 *     type: 'image',
 *           max: 9,
 *   },
 *  {
 *     type: 'image',
 *           max: 9,
 *   }
 * ]
 *}
 * @example 类型只能三选一
 *{
 *   type: 'or',
 *   options: [
 *     {
 *       type: 'image',
 *       max: 9,
 *     },
 *     {
 *       type: 'video',
 *       max: 1
 *     },
 *     {
 *       type: '链接',
 *       max: 1
 *     }
 *   ]
 * }
 * @param {object} value
 * * @param {array<object>} media 附件
 */
const MEDIA_KEY = 'mediaKey'

const EditorContent = (props) => {
  const {
    value,
    editor,
    editorType,
    editorProps,
    onChange,
    onChooseText,
    ...rest
  } = props
  const isText = editorType === 'text'

  const controls = useMemo(() => {
    const baseControls = ['clear', 'inserttext']
    if (isText) {
      return baseControls
    } else {
      return [...baseControls, 'insernickname']
    }
  }, [isText])

  // 优先使用editor
  if (typeof editor === 'function') {
    return editor({ ...rest })
  }

  const triggerTextChange = (text) => {
    if (typeof onChange === 'function') {
      onChange(text)
    }
  }
  const onEditorChange = (e) => {
    triggerTextChange(e.target.value)
  }

  const onInsertNickname = () => {
    const { ninameLabel = NINAME_LABEL } = editorProps
    const htmlText = `<span class="keyboard-item">${ninameLabel}</span>`
    const nextEditorState = ContentUtils.insertHTML(value, htmlText)
    triggerTextChange(nextEditorState)
  }

  const onToolAction = (toolType) => {
    switch (toolType) {
      case 'reset':
        triggerTextChange(isText ? '' : ContentUtils.clear(value))
        break
      case 'insertNickname':
        if (!isText) {
          onInsertNickname()
        }
        break
      case 'chooseText':
        onChooseText()
        break
      default:
        break
    }
  }

  return (
    <div className={'wy-msgEditor'}>
      <ToolBar onAction={onToolAction} controls={controls} />
      {isText ? (
        <TextAreaWithCount
          className={cls({
            [styles['text-editor']]: true,
          })}
          value={value}
          onChange={onEditorChange}
          placeholder="请输入"
          {...editorProps}
          {...rest}
        />
      ) : (
        <RichMsgEditor
          value={value}
          onChange={onChange}
          {...editorProps}
          {...rest}
        />
      )}
    </div>
  )
}
export default forwardRef((props, ref) => {
  const {
    value,
    editorType,
    onChange,
    editor,
    footer,
    editorProps = {},
    attachmentRules,
    ...rest
  } = props
  const { openModal, closeModal, visibleMap, modalInfo } =
    useModalHook(initModalType)
  const [data, setData] = useState({})
  const isDefinedValue = typeof value !== 'undefined'
  const curValue = isDefinedValue ? value : data
  const mediaArr = Array.isArray(curValue.media) ? curValue.media : []
  const mediaList =
    mediaArr[0] && !mediaArr[0].id
      ? mediaArr.map((ele) => ({ ...ele, [MEDIA_KEY]: uniqueId('item_') }))
      : mediaArr
  const triggerChange = (nextData) => {
    const nextValue = {
      ...curValue,
      ...nextData,
    }
    if (typeof onChange === 'function') {
      onChange(nextValue)
    }
    if (!isDefinedValue) {
      setData(nextValue)
    }
  }

  const onTextChange = (value) => {
    triggerChange({
      text: value,
    })
  }

  const onSelectMenu = (key) => {
    openModal(key)
  }

  const onAddImgOk = (values) => {
    setNewMediaList('img', values)
  }

  const onAddMiniAppOk = (values) => {
    setNewMediaList('app', values)
  }

  const onAddLinkOk = ({ isAdvancedSet, href, ...values }) => {
    const newVals = { href, ...values }
    setNewMediaList('link', newVals)
  }

  const onAddVideoOk = (vals) => {
    setNewMediaList(ATTACH_TYPE_EN_VAL.VIDEO, vals)
  }

  const handleNormalMaterial = (mItem) => {
    let data = {}
    switch (mItem.type) {
      case MATERIAL_TYPE_EN_VALS.POSTER:
      case MATERIAL_TYPE_EN_VALS.PICTUER:
        data = {
          type: ATTACH_TYPE_EN_VAL.IMAGE,
          content: {
            name: mItem.title,
            mediaInfoId: mItem.id,
            file: [
              {
                uid: mItem.fileId,
                isOld: true,
                thumbUrl: mItem.filePath,
              },
            ],
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.MINI_APP:
        data = {
          type: ATTACH_TYPE_EN_VAL.MINI_APP,
          content: {
            name: mItem.appInfo.name,
            appId: mItem.appInfo.appId,
            pathName: mItem.appInfo.appPath,
            file: [
              {
                uid: mItem.fileId,
                isOld: true,
                name: mItem.title,
                thumbUrl: mItem.filePath,
              },
            ],
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.ARTICLE:
        data = {
          type: ATTACH_TYPE_EN_VAL.TRACK_MATERIAL,
          content: {
            title: mItem.title,
            requestUrl: mItem.requestUrl,
            description: mItem.description || mItem.summary,
            mediaInfoId: mItem.id,
            file: [
              {
                uid: mItem.fileId,
                isOld: true,
                thumbUrl: mItem.filePath,
              },
            ],
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.LINK:
        data = {
          type: ATTACH_TYPE_EN_VAL.LINK,
          content: {
            href: mItem.link,
            name: mItem.title,
            info: mItem.description,
            file: [
              {
                uid: mItem.fileId,
                isOld: true,
                thumbUrl: mItem.filePath,
              },
            ],
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.VIDEO:
        data = {
          type: ATTACH_TYPE_EN_VAL.VIDEO,
          content: {
            name: mItem.title,
            mediaInfoId: mItem.id,
            file: [
              {
                uid: mItem.fileId,
                isOld: true,
                name: mItem.title,
              },
            ],
          },
        }
        break
      default:
        break
    }
    return data
  }

  const handleTrackMaterial = (mItem) => {
    let content = {}
    switch (mItem.type) {
      case MATERIAL_TYPE_EN_VALS.ARTICLE:
      case MATERIAL_TYPE_EN_VALS.LINK:
        content = {
          title: mItem.title,
          requestUrl: mItem.requestUrl,
          description: mItem.description || mItem.summary,
          mediaInfoId: mItem.id,
          file: [
            {
              uid: mItem.fileId,
              isOld: true,
              thumbUrl: mItem.filePath,
            },
          ],
        }
        break
      case MATERIAL_TYPE_EN_VALS.VIDEO:
      case MATERIAL_TYPE_EN_VALS.FILE:
        content = {
          title: mItem.title,
          requestUrl: createUrlByType({
            type: 'previewFile',
            data: {
              extCorpId: store.UserStore.userData.extCorpId,
              mediaInfoId: mItem.id,
            },
          }),
          description: mItem.description,
          mediaInfoId: mItem.id,
        }
        break
      default:
        break
    }
    return {
      type: ATTACH_TYPE_EN_VAL.TRACK_MATERIAL,
      content,
    }
  }

  const onMaterialOk = (items) => {
    const newMedialList = items.map((mItem) => {
      let data = {}
      const [materialType] = mItem.key.split('_')
      if (materialType === MATERIAL_TABS.NORMAL) {
        data = handleNormalMaterial(mItem)
      } else if (materialType === MATERIAL_TABS.TRACK) {
        data = handleTrackMaterial(mItem)
      }
      return {
        [MEDIA_KEY]: uniqueId('media'),
        ...data,
      }
    })
    triggerChange({
      media: [...mediaList, ...newMedialList],
    })
    closeModal()
  }

  const onEditMediaItem = (item, order) => {
    openModal(`edit${item.type}`, { ...item, order })
  }

  const onRemoveMediaItem = (item, idx) => {
    triggerChange({
      media: mediaList.filter((ele, index) => index !== idx),
    })
  }

  const handleMediaListChange = (val) => {
    triggerChange({
      media: val,
    })
  }

  const setNewMediaList = (type, values) => {
    const order = modalInfo.data.order
    const record = { type, content: values, [MEDIA_KEY]: uniqueId('item_') }
    closeModal()
    const newList = order
      ? mediaList.map((ele, idx) =>
          idx + 1 === order ? { ...record, type: ele.type } : ele
        )
      : [...mediaList, record]
    triggerChange({
      media: newList,
    })
  }
  const replaceText = (text) => {
    let nextValue =
      editorType === 'text' ? text : ContentUtils.clear(curValue.text)
    if (editorType !== 'text') {
      nextValue = ContentUtils.insertText(nextValue, text)
    }
    onTextChange(nextValue)
  }

  const onChooseText = () => {
    openModal('chooseText')
  }

  const onChooseTextOk = (item) => {
    if (item) {
      replaceText(item.content)
    }
    closeModal()
  }

  const menuOptions = useMemo(() => {
    const { menuOptions } = validShouldAddAttach(mediaList, attachmentRules)
    return menuOptions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaList, attachmentRules])

  return (
    <>
      <AddImgModal
        title={`${modalInfo.type === 'img' ? '新增' : '编辑'}图片附件`}
        data={modalInfo.data}
        visible={visibleMap.imgVisible || visibleMap.editimgVisible}
        onOk={onAddImgOk}
        onCancel={closeModal}
      />
      <AddLinkModal
        title={`${modalInfo.type === 'link' ? '新增' : '编辑'}链接附件`}
        data={modalInfo.data}
        visible={visibleMap.linkVisible || visibleMap.editlinkVisible}
        onOk={onAddLinkOk}
        onCancel={closeModal}
      />
      <AddMiniApp
        title={`${modalInfo.type === 'app' ? '新增' : '编辑'}小程序附件`}
        data={modalInfo.data}
        visible={visibleMap.appVisible || visibleMap.editappVisible}
        onOk={onAddMiniAppOk}
        onCancel={closeModal}
      />
      <ChooseVideoModal
        title={`${modalInfo.type === 'video' ? '新增' : '编辑'}视频附件`}
        data={modalInfo.data}
        visible={visibleMap.videoVisible || visibleMap.editvideoVisible}
        onOk={onAddVideoOk}
        onCancel={closeModal}
      />
      <ChooseTextDrawer
        title="选择文案"
        data={modalInfo.data}
        visible={visibleMap.chooseTextVisible}
        onOk={onChooseTextOk}
        onCancel={closeModal}
      />
      <ChooseMaterialDrawer
        title="选择素材"
        data={modalInfo.data}
        chooseMediaList={mediaList}
        attachmentRules={attachmentRules}
        typeRuleOptions={menuOptions}
        visible={visibleMap.normalmaterialVisible}
        onOk={onMaterialOk}
        onCancel={closeModal}
      />
      <div className={styles.msgEditor} ref={ref} {...rest}>
        <EditorContent
          onChooseText={onChooseText}
          editorProps={editorProps}
          editor={editor}
          value={curValue.text}
          onChange={onTextChange}
          editorType={editorType}
        />
        {typeof footer === 'undefined' ? (
          <div className={styles['msgEditor-footer']}>
            <AttachmentList
              attachmentRules={attachmentRules}
              uniqKey={MEDIA_KEY}
              onChange={handleMediaListChange}
              dataSource={mediaList}
              onEdit={onEditMediaItem}
              onRemove={onRemoveMediaItem}
              onSelectMenu={onSelectMenu}
            />
          </div>
        ) : (
          footer
        )}
      </div>
    </>
  )
})

const ToolBar = ({
  onAction,
  controls = ['clear', 'insernickname', 'inserttext'],
}) => {
  const handleClick = (type) => {
    if (typeof onAction === 'function') {
      onAction(type)
    }
  }
  const onReset = () => {
    handleClick('reset')
  }
  const onInsertNickname = () => {
    handleClick('insertNickname')
  }
  const onChooseText = () => {
    handleClick('chooseText')
  }
  if (isEmpty(controls)) {
    return null
  }
  return (
    <div className={styles['editor-toobar']}>
      {controls.map((ele) => {
        if (ele === 'clear') {
          return (
            <span
              className={cls({
                [styles['toolbar-action']]: true,
              })}
              onClick={onReset}
              key={ele}>
              清空
            </span>
          )
        }
        if (ele === 'insernickname') {
          return (
            <span
              key={ele}
              className={cls({
                [styles['toolbar-action']]: true,
              })}
              onClick={onInsertNickname}>
              插入客户昵称
            </span>
          )
        }
        if (ele === 'inserttext') {
          return (
            <span
              className={cls({
                [styles['toolbar-action']]: true,
                [styles['right-toolbar']]: true,
              })}
              onClick={onChooseText}
              key={ele}>
              选择文案
            </span>
          )
        }
        return null
      })}
    </div>
  )
}

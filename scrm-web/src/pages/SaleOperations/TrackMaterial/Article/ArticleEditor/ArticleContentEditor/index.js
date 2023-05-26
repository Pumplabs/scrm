import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import E from 'wangeditor'
import { message } from 'antd'
import cls from 'classnames'
import { uniqueId, get } from 'lodash'
import { UploadImg } from 'services/modules/common'
import { getFileUrl } from 'src/utils'
import styles from './index.module.less'
import { SUCCESS_CODE } from 'utils/constants'

export default forwardRef(
  ({ onChange, style, className, getEditorRef }, ref) => {
    const editorRef = useRef()
    const domIdRef = useRef(uniqueId('dom_'))
    const lastHtmlRef = useRef()

    useImperativeHandle(ref, () => ({
      editorRef: editorRef.current,
    }))

    const initEditor = () => {
      const editor = new E(`#${domIdRef.current}`)
      editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      editor.config.showLinkImg = false
      editor.config.uploadImgShowBase64 = true
      editor.config.menus = [
        'undo',
        'redo',
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        'todo',
        'justify',
        'quote',
        'table',
        'code',
        'splitLine',
        'bold',
        'head',
        'link',
        'italic',
        'image',
        'underline'
      ]
      editor.create()
      // 隐藏插入网络图片的功能
      editor.config.showLinkImg = true
      // 忽略粘贴内容中的图片, 如果复制的内容有图片又有文字，则只粘贴文字，不粘贴图片。
      editor.config.pasteIgnoreImg = true
      // 判断
      editor.config.customUploadImg = async function (
        resultFiles,
        insertImgFn
      ) {
        const res = await UploadImg({ file: resultFiles[0] })
        if (res.code === SUCCESS_CODE && get(res, 'data.mediaId')) {
          const url = await getFileUrl(res.data.mediaId)
          insertImgFn(url, '', `${res.data.id}`)
        } else {
          message.error(res.msg || '图片上传失败')
        }
      }
      editor.config.zIndex = 0
      // 配置 onchange 回调函数
      editor.config.onchange = function (newHtml, mewText) {
        lastHtmlRef.current = newHtml
        if (typeof onChange === 'function') {
          onChange(newHtml)
        }
      }
      editorRef.current = editor
    }

    useEffect(() => {
      initEditor()
      if (editorRef.current) {
        if (typeof getEditorRef === 'function') {
          getEditorRef(editorRef.current)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div ref={ref}>
        <div
          id={domIdRef.current}
          className={cls({
            [styles['article-editor']]: true,
            [className]: className,
          })}
          style={style}></div>
      </div>
    )
  }
)

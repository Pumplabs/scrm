import { useEffect, useRef } from 'react'
import {
  Form,
  Row,
  Col,
  Button,
  Input,
  Switch,
  message,
} from 'antd'
import { get, isEmpty } from 'lodash'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { PageContent } from 'layout'
import { PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import TagSelect from 'components/TagSelect'
import ArticleEditor from '../ArticleEditor'
import ArticleTitle from '../ArticleTitle'
import { getRequestError } from 'services/utils'
import { SUCCESS_CODE } from 'utils/constants'
import { getFileUrl } from 'src/utils'
import {
  AddTrackMaterial,
  GetMaterialDetail,
  EditTrackMaterial,
} from 'services/modules/trackMaterial'
import { MATERIAL_TYPE_EN_VALS } from '../../../constants'
import { COVER_IMG_TYPES } from 'src/utils/constants'
import styles from './index.module.less'
import { findAllImgFileIds, updateAllImgUrl } from '../ArticleDetailDrawer/ArticlePreview/utils'
const refillFormByData = async (data) => {
  const fileUrl = await getFileUrl(data.mediaId)
  return {
    hasInform: Boolean(data.hasInform),
    summary: data.summary,
    customerTags: Array.isArray(data.wxTagDetailList)
      ? data.wxTagDetailList
      : [],
    materialTags: Array.isArray(data.mediaTagDetailList)
      ? data.mediaTagDetailList
      : [],
    articleTitle: data.title,
    files: [
      {
        uid: data.fileId,
        isOld: true,
        url: fileUrl,
        name: `${data.title}.${data.mediaSuf}`,
      },
    ],
  }
}
const refillArticleContent = async (richText) => {
  const imgFileIds = findAllImgFileIds(richText)
  const imgUrls = await getFileUrl({ ids: imgFileIds })
  return updateAllImgUrl(richText, imgUrls)
}
export default () => {
  const [form] = Form.useForm()
  const editorRef = useRef()
  const navigate = useNavigate()
  const { id: articleId } = useParams()
  const { run: runAddArticle, loading: addLoading } = useRequest(
    AddTrackMaterial,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === SUCCESS_CODE) {
          message.success(`新增成功`)
          backToList()
        } else {
          message.error(res.message ? res.message : `新增失败`)
        }
      },
      onError: (e) => getRequestError(e, '新增失败'),
    }
  )
  const { run: runEditArticle, loading: editLoading } = useRequest(
    EditTrackMaterial,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === SUCCESS_CODE) {
          message.success(`编辑成功`)
          backToList()
        } else {
          message.error(res.message ? res.message : `编辑失败`)
        }
      },
      onError: (e) => getRequestError(e, '编辑失败'),
    }
  )
  const { run: runGetArticleData, data: articleData = {} } = useRequest(
    GetMaterialDetail,
    {
      manual: true,
      onSuccess: async (data) => {
        if (isEmpty(data)) {
          message.error('查询的数据不存在')
          backToList()
        } else {
          const formVals = await refillFormByData(data)
          const articleRichContent = await refillArticleContent(data.richText)
          form.setFieldsValue(formVals)
          if (editorRef.current) {
            editorRef.current.editorRef.txt.setJSON(articleRichContent)
          }
        }
      },
      onError: (e) => {
        getRequestError(e, '查询失败')
        backToList()
      },
    }
  )

  useEffect(() => {
    if (articleId) {
      runGetArticleData({
        id: articleId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId])

  const onSave = (vals) => {
    const {
      articleInfo,
      articleTitle,
      files = [],
      materialTags = [],
      customerTags = [],
      ...rest
    } = vals
    const [file] = files
    const fileId = file.isOld ? file.uid : get(files[0], 'response.data.id')
    const editorJson = editorRef
      ? editorRef.current.editorRef.txt.getJSON()
      : []
    const params = {
      fileId,
      richText: editorJson,
      title: articleTitle,
      mediaTagList: materialTags.map((ele) => ele.id),
      wxTagList: customerTags.map((ele) => ele.id),
      ...rest,
      type: MATERIAL_TYPE_EN_VALS.ARTICLE,
    }

    if (articleId) {
      runEditArticle({
        id: articleId,
        ...params,
      })
    } else {
      runAddArticle(params)
    }
  }

  const onCancel = () => {
    backToList()
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const backToList = () => {
    navigate(`/saleOperation/trackMaterial`)
  }

  return (
    <PageContent showBack={true} backUrl={`/saleOperation/trackMaterial`}>
      <div className={styles.page}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onSave}
          scrollToFirstError={true}>
          <div className={styles['form-content']}>
            <div className={styles['others-form']}>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="封面"
                    name="files"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                      {
                        required: true,
                        type: 'array',
                        message: '请上传封面',
                      },
                    ]}>
                    <PictureUpload
                      listType="picture-inline"
                      maxCount={1}
                      validOptions={{
                        maxFileSize: 2,
                        maxFileTotalLen: 2,
                        acceptTypeList: COVER_IMG_TYPES,
                      }}
                      onBeforeUpload={(_, flag) => flag}>
                      <UploadImgBtn title="上传封面" />
                    </PictureUpload>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="摘要"
                    name="summary"
                    rules={[
                      {
                        required: true,
                        message: '请输入摘要',
                      },
                    ]}>
                    <Input.TextArea
                      maxLength={35}
                      rows={4}
                      placeholder="请输入不超过35个字符"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="分类标签"
                    name="materialTags"
                    rules={[
                      {
                        required: true,
                        type: 'array',
                        message: '请选择分类标签',
                      },
                    ]}>
                    <TagSelect
                      placeholder="请选择标签"
                      style={{ width: '100%' }}
                      tagType="material"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="动态通知"
                    name="hasInform"
                    valuePropName="checked"
                    initialValue={true}>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="客户标签"
                    name="customerTags"
                    rules={[
                      {
                        required: true,
                        message: '请选择客户标签',
                      },
                    ]}>
                    <TagSelect
                      tagType="customer"
                      placeholder="请选择标签"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <Row>
              <Col span={24}>
                <Form.Item
                  label=""
                  name="articleTitle"
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  colon={false}
                  rules={[
                    {
                      required: true,
                      message: '请输入文章标题',
                    },
                  ]}>
                  <ArticleTitle />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label=""
                  name="articleInfo"
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  colon={false}
                  rules={[
                    {
                      required: true,
                      message: '请输入文章内容',
                    },
                  ]}>
                  <ArticleEditor
                    editorRef={(ref) => (editorRef.current = ref)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
        <div className={styles['page-footer']}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            type="primary"
            ghost
            onClick={form.submit}
            loading={addLoading || editLoading}>
            保存
          </Button>
        </div>
      </div>
    </PageContent>
  )
}

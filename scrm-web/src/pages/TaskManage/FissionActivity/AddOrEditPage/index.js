import { useState, useEffect, useMemo } from 'react'
import { Collapse, Form, Button, message, Spin } from 'antd'
import { get, isEmpty, compact, uniq } from 'lodash'
import { useRequest } from 'ahooks'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { PageContent } from 'layout'
import { getFileUrl } from 'utils'
import { getRequestError } from 'services/utils'
import { handleTime } from 'utils/times'
import {
  TEXT_KEY_BY_VAL,
  MEDIA_REQ_KEY_BY_VAL,
  getMsgList,
} from 'components/WeChatMsgEditor/utils'
import { SUCCESS_CODE } from 'utils/constants'
import {
  CreateMarketFission,
  GetMarketFissionDetail,
  EditMarketFission,
} from 'services/modules/marketFission'
import { actionRequestHookOptions } from 'services/utils'
import { formatColorStr } from 'components/MyColorPicker/utils'
import { getPosterConfig, getColor, handleTags } from '../utils'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { INDATE_EN_VAL } from './IndateSelect'
import { avatarSize, qcodeSize, width, height } from '../PosterViewer/constants'
import styles from './index.module.less'

const { Panel } = Collapse
const nameConfig = {
  1: [
    'name',
    'serviceStaff',
    'endTime',
    'indate',
    'hasCheckDelete',
    'activityPoster',
    'userName',
    'hasHead',
  ],
  2: ['tasks'],
  3: [
    'official',
    'title',
    'summary',
    'files',
    'inviteUsers',
    'immediatelyInvited',
  ],
}
export default () => {
  const { id: activityId } = useParams()
  const [form] = Form.useForm()
  const [expandPanelKeys, setExpandPanelKeys] = useState(['1', '2', '3'])
  const [immediatelyInvited, setImmediatelyInvited] = useState(true)
  const [mediaList, setMediaList] = useState([])
  const [posterConfig, setPosterConfig] = useState({
    showName: true,
    showAvatar: true,
    code: {
      left: width - qcodeSize - 40,
      top: height - qcodeSize - 40,
    },
    avatar: {
      left: 40,
      top: 40,
    },
    name: {
      left: avatarSize + 40 + 40,
      top: 40,
    },
    color: 'rgba(0, 0, 0, 1)',
  })
  const navigate = useNavigate()
  const { run: runEditActivity, loading: editLoading } = useRequest(
    EditMarketFission,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === SUCCESS_CODE) {
          message.success('编辑成功')
          backToList()
        } else {
          message.error(res.msg || '编辑失败')
        }
      },
      onError: (e) => getRequestError(e, '编辑失败'),
    }
  )
  const { run: runAddActivity, loading: addLoading } = useRequest(
    CreateMarketFission,
    {
      manual: true,
      ...actionRequestHookOptions({
        successFn: () => {
          backToList()
        },
      }),
    }
  )
  const {
    run: runGetActivity,
    data: activityData = {},
    loading,
  } = useRequest(GetMarketFissionDetail, {
    manual: true,
    onSuccess: async (res) => {
      if (!isEmpty(res)) {
        const { text: msgText = [], media: msgMedia = [] } = res.msg
          ? res.msg
          : {}
        const linkInfo = msgMedia[0] || {}
        const file = linkInfo.file ? linkInfo.file : {}
        const fileIds = compact([res.posterFileId, file.id])
        const fileUrls = fileIds.length
          ? await getFileUrl({ ids: fileIds })
          : {}
        const color = getColor(res)
        const formData = {
          name: res.name,
          serviceStaff: Array.isArray(res.staffVOList) ? res.staffVOList : [],
          endTime: moment(res.endTime),
          hasCheckDelete: res.hasCheckDelete,
          hasHead: res.hasHead,
          tasks: [],
          official: {
            text: msgText[0] ? msgText[0].content : '',
          },
          files: [
            {
              uid: file.id,
              isOld: true,
              name: file.fileName,
              thumbUrl: fileUrls[file.id],
            },
          ],
          title: linkInfo.name,
          summary: linkInfo.info,
          inviteUsers: Array.isArray(res.customers) ? res.customers : [],
          userName: {
            checked: res.hasName,
            color,
          },
          activityPoster: {
            id: res.posterFileId,
            fileId: res.posterFileId,
            title: res.posterFile.fileName,
            filePath: fileUrls[res.posterFileId],
          },
          indate: {
            type:
              res.codeExpiredDays === 0
                ? INDATE_EN_VAL.IMMEDIATE
                : INDATE_EN_VAL.OTHER,
            day: res.codeExpiredDays,
          },
          joinTags: handleTags(res.tagList, res.tags),
        }
        const mList = await getMsgList(res.msg, fileUrls)
        setMediaList(mList)
        setPosterConfig({
          filePath: fileUrls[res.posterFileId],
          ...getPosterConfig(res, color),
        })
        // 回填数据
        form.setFieldsValue(formData)
      } else {
        message.error(res.msg || '查询失败')
        backToList()
      }
    },
    onError: (e) => {
      getRequestError(e, '查询数据失败')
      backToList()
    },
  })
  const isEdit = !isEmpty(activityId)
  useEffect(() => {
    if (activityId) {
      runGetActivity({
        id: activityId,
      })
      setImmediatelyInvited(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId])

  const changeMediaList = async (vals) => {
    const textItem = vals.official
      ? [
          {
            type: 'text',
            text: vals.official ? vals.official.text : '',
          },
        ]
      : []
    let linkFile = []
    if (Array.isArray(vals.files) && vals.files.length) {
      const [file] = vals.files
      const mediaId = get(file, 'response.data.mediaId')
      const thumbUrl = await getFileUrl(mediaId)
      linkFile = [
        {
          thumbUrl,
        },
      ]
    }
    // 如果
    const linkItem =
      vals.summary || vals.title || linkFile.length
        ? [
            {
              type: 'link',
              content: {
                info: vals.summary,
                name: vals.title,
                file: linkFile,
              },
            },
          ]
        : []
    const arr = [...textItem, ...linkItem]
    setMediaList(arr)
  }

  const onValuesChange = (changedValues, allValues) => {
    const [key] = Object.keys(changedValues)
    const val = changedValues[key]
    // 如果
    if (
      key === 'title' ||
      key === 'official' ||
      key === 'summary' ||
      key === 'files'
    ) {
      // 更新medialList
      changeMediaList(allValues)
    }

    if (key === 'userName') {
      const color = val.color
      setPosterConfig({
        ...posterConfig,
        showName: val.checked,
        color: formatColorStr(color),
      })
    }
    if (key === 'hasHead') {
      setPosterConfig({
        ...posterConfig,
        showAvatar: val,
      })
    }
    if (key === 'activityPoster') {
      setPosterConfig({
        ...posterConfig,
        filePath: val.filePath,
      })
    }
  }

  const onImmediatelyInvitedChange = (checked) => {
    setImmediatelyInvited(checked)
  }

  // 格式化有效期
  const getIndateTimeStr = (value = {}, endTimeStr, endTime) => {
    const { type, day } = value
    let params = {}
    if (type === INDATE_EN_VAL.IMMEDIATE) {
      params = {
        codeExpiredDays: 0,
        codeExpiredTime: endTimeStr,
      }
    } else {
      params = {
        codeExpiredDays: day,
        codeExpiredTime: handleTime(endTime.add(day, 'days'), {
          format: 'YYYY-MM-DD HH:mm',
          suffix: ':00',
        }),
      }
    }
    return params
  }

  const getNameParams = ({ checked, color }) => {
    let params = {
      hasName: checked,
    }
    if (checked) {
      params = {
        ...params,
        nameColor: {
          red: color.r,
          green: color.g,
          blue: color.b,
        },
      }
    }
    return params
  }

  // 获取海报参数
  const getPosterParams = (activityPoster) => {
    const headPos = {
      width: avatarSize,
      height: avatarSize,
      x: posterConfig.avatar.left,
      y: posterConfig.avatar.top,
    }
    const namePos = {
      x: posterConfig.name.left,
      y: posterConfig.name.top,
    }
    const qrCodePos = {
      width: qcodeSize,
      height: qcodeSize,
      x: posterConfig.code.left,
      y: posterConfig.code.top,
    }
    const posterSize = {
      width,
      height,
    }
    // mediaInfoId	如果海报是选的素材库，就有这个id
    // posterFileId	海报文件id
    // const posterIdPar = activityPoster.isNew ? { posterFileId: activityPoster.id } : { mediaInfoId: activityPoster.id }
    return {
      headPos,
      namePos,
      posterSize,
      qrCodePos,
      posterFileId: activityPoster.fileId,
      // ...posterIdPar
    }
  }

  const getStagesParams = (stages = []) => {
    // 编辑
    if (isEdit) {
      return oldStageList.map((ele) => {
        return {
          extStaffIds: ele.extStaffIds,
          num: ele.initNum,
          stage: ele.stage,
          tags: ele.tags,
        }
      })
    }
    return stages.reduce(
      ({ res, preNum }, ele, idx) => {
        const data = {
          extStaffIds: ele.preizeUser.map((ele) => ele.extId),
          num: ele.num - preNum,
          stage: idx + 1,
          tags: ele.taskTags.map((ele) => ele.id),
        }
        return {
          res: [...res, data],
          preNum: ele.num,
        }
      },
      { res: [], preNum: 0 }
    ).res
  }

  // 获取消息
  const getMsgParams = (formVals) => {
    const { official, title, summary, files } = formVals
    const [file] = files
    const coverId = file.isOld ? file.uid : get(file, 'response.data.id')
    const href = get(activityData, 'msg.media[0].href') || ''
    const linkHref = activityId ? href : ''
    return {
      msg: {
        text: [
          {
            content: official.text,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
        media: [
          {
            type: MEDIA_REQ_KEY_BY_VAL.link,
            info: summary,
            name: title,
            file: {
              fileName: file.name,
              id: coverId,
            },
            href: linkHref,
          },
        ],
      },
    }
  }

  const handleParams = (formVals) => {
    const {
      name,
      endTime,
      indate,
      hasHead,
      helpOrder,
      userName,
      activityPoster,
      hasCheckDelete,
      serviceStaff,
      tasks,
      inviteUsers,
      joinTags,
      ...rest
    } = formVals
    const endTimeStr = handleTime(endTime, {
      format: 'YYYY-MM-DD HH:mm',
      suffix: ':00',
    })
    const params = {
      name,
      // 接待员工
      extStaffIds: serviceStaff.map((ele) => ele.extId),
      // 结束时间
      endTime: endTimeStr,
      // 二维码有效时间
      ...getIndateTimeStr(indate, endTimeStr, endTime),
      // 删除员工后好友助力是否失效
      hasCheckDelete: Number(hasCheckDelete),
      // 是否有用户头像
      hasHead,
      // 是否有用户名
      ...getNameParams(userName),
      // 海报相关参数
      ...getPosterParams(activityPoster),
      // 阶段
      stageSaveDTOS: getStagesParams(tasks),
      // 助力失败
      // posterId: helpOrder.id,
      // userNameFlag: userName.checked,
      // userNameColor: userName.color,
      // 邀请客户
      extCustomerIds: immediatelyInvited
        ? inviteUsers.map((ele) => ele.extId)
        : [],
      ...getMsgParams(rest),
      tags: Array.isArray(joinTags) ? joinTags.map((ele) => ele.id) : [],
    }
    return params
  }

  const onFormFinish = (vals) => {
    // 判断活动时间是否小于当前时间
    if (moment().isAfter(vals.endTime)) {
      message.warning('活动时间不能小于当前时间,请前往"活动基本信息"修改')
      return
    }
    const params = {
      status: 1,
      ...handleParams(vals),
    }
    if (activityId) {
      runEditActivity({
        ...params,
        id: activityId,
      })
    } else {
      runAddActivity(params)
    }
  }

  const onCancel = () => {
    backToList()
  }

  const onFinishFailed = ({ errorFields }) => {
    let keys = []
    Object.keys(nameConfig).forEach((key) => {
      const hasFailField = nameConfig[key].some((ele) =>
        errorFields.some((errorField) => errorField.name[0] === ele)
      )
      if (hasFailField) {
        keys = [...keys, key]
      }
    })
    setExpandPanelKeys((preArr) => uniq([...preArr, ...keys]))
  }

  const onPanelChange = (keys) => {
    setExpandPanelKeys(keys)
  }

  const onUpdatePoster = (config) => {
    setPosterConfig((vals) => ({
      ...config,
      filePath: vals.filePath,
      color: vals.color,
    }))
  }

  const backToList = () => {
    navigate(`/taskManage/list`)
  }

  const confirmLoading = addLoading || editLoading
  const oldStageList = useMemo(() => {
    if (Array.isArray(activityData.wxFissionStageVOS)) {
      return activityData.wxFissionStageVOS.reduce(
        ({ res, total }, ele) => {
          return {
            res: [
              ...res,
              {
                ...ele,
                initNum: ele.num,
                num: total + ele.num,
                preizeUser: Array.isArray(ele.staffVOList)
                  ? ele.staffVOList
                  : [],
                taskTags: Array.isArray(ele.tagList) ? ele.tagList : [],
              },
            ],
            total: total + ele.num,
          }
        },
        { res: [], total: 0 }
      ).res
    } else {
      return []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityData.id])
  return (
    <PageContent
      showBack={true}
      backUrl={`/taskManage/list`}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        scrollToFirstError={true}
        onValuesChange={onValuesChange}
        initialValues={{
          hasHead: true,
          hasCheckDelete: true,
          indate: {
            type: INDATE_EN_VAL.IMMEDIATE,
            day: 7,
          },
          tasks: [
            {
              num: 1,
            },
          ],
          immediatelyInvited: false,
          userName: { checked: true, color: { r: 0, g: 0, b: 0, a: 1 } },
        }}
        onFinish={onFormFinish}
        onFinishFailed={onFinishFailed}>
        <div className={styles['page']}>
          <div className={styles['page-body']}>
            <Spin spinning={confirmLoading || loading}>
              <Collapse activeKey={expandPanelKeys} onChange={onPanelChange}>
                <Panel header="活动基本信息" key="1">
                  <Step1
                    posterConfig={posterConfig}
                    onUpdatePoster={onUpdatePoster}
                    isEdit={isEdit}
                  />
                </Panel>
                <Panel header="任务设置" key="2">
                  <Step2
                    form={form}
                    isEdit={isEdit}
                    oldStageList={oldStageList}
                  />
                </Panel>
                <Panel header="邀请客户" key="3">
                  <Step3
                    isEdit={isEdit}
                    mediaList={mediaList}
                    immediatelyInvited={immediatelyInvited}
                    onImmediatelyInvitedChange={onImmediatelyInvitedChange}
                  />
                </Panel>
              </Collapse>
            </Spin>
          </div>
          <div className={styles['page-footer']}>
            <Button style={{ marginRight: 8 }} onClick={onCancel}>
              取消
            </Button>
            <Button
              type="primary"
              ghost
              htmlType="submit"
              loading={confirmLoading}>
              {isEdit ? '提交' : '创建活动'}
            </Button>
          </div>
        </div>
      </Form>
    </PageContent>
  )
}

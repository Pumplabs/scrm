import { useMemo, useRef } from 'react'
import DragPriver, { DragItem } from './DragPriver'
import { width, height, qcodeSize, avatarSize, nameFontSize, ratio } from '../constants'

export default ({ onOk, avatarUrl, qcodeUrl, data = {}, width: deviceWidth }) => {
  const modifyData = useRef({})
  const deviceRatio = deviceWidth > 0 ? deviceWidth / width : ratio
  // useEffect(() => {
  //   if (!visible) {
  //     modifyData.current = {}
  //   }
  // }, [visible])

  // const handleOk = () => {
  //   if (typeof onOk === 'function') {
  //     onOk(modifyData.current)
  //   }
  // }

  // const handleCancel = () => {
  //   if (typeof onCancel === 'function') {
  //     onCancel()
  //   }
  // }
  const transformLocRealData = ({left = 0, top = 0}) => {
    return {
      left: left / deviceRatio,
      top: top / deviceRatio
    }
  }

  const transformLocalViewData = ({left = 0, top = 0}) => {
    return {
      left: left * deviceRatio,
      top: top * deviceRatio
    }
  }

  const onEnd = (data) => {
    const { id, ...rest } = data

    modifyData.current = {
      ...modifyData.current,
      [data.id]: transformLocRealData(rest)
    }
    onOk(modifyData.current)
  }

  const config = useMemo(() => {
    let codeConfig = data.code || {}
    let avatarConfig = data.avatar || {}
    let nameConfig = data.name || {}
    return {
      code: codeConfig,
      avatar: avatarConfig,
      name: nameConfig
    }
  }, [data])

  const eleSize = useMemo(() => {
    return {
      width: Math.ceil(width * deviceRatio),
      height:  Math.ceil(height * deviceRatio),
      qcodeSize: Math.ceil(qcodeSize * deviceRatio),
      avatarSize: Math.ceil(avatarSize * deviceRatio)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const codeViewLoc = useMemo(() => {
    return transformLocalViewData(config.code)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.code])

  const avatarViewLoc = useMemo(() => {
    return transformLocalViewData(config.avatar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.avatar])

  const nameViewLoc = useMemo(() => {
    return transformLocalViewData(config.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.name])

  return (
    <DragPriver
      canvasHeight={eleSize.height}
      canvasWidth={eleSize.width}
      backgroundUrl={data.filePath}
      onEnd={onEnd}
    >
      <DragItem
        id="code"
        // {...config.code}
        {...codeViewLoc}
      >
        <div>
          <img
            src={qcodeUrl}
            alt=""
            width={eleSize.qcodeSize}
            height={eleSize.qcodeSize}
          />
        </div>
      </DragItem>
      {
        data.showAvatar ? (
          <DragItem
            id="avatar"
            {...avatarViewLoc}
            // {...config.avatar}
          >
            <div
            >
              <img
                src={avatarUrl}
                alt=""
                width={eleSize.avatarSize}
                height={eleSize.avatarSize}
              />
            </div>
          </DragItem>
        ) : null
      }
      {
        data.showName ? (
          <DragItem
            id="name"
            {...nameViewLoc}
          >
            <span style={{ color: data.color,wordBreak: "keep-all", fontSize: nameFontSize }}
            >
              用户昵称
            </span>
          </DragItem>
        ) : null
      }
    </DragPriver>
  )
}
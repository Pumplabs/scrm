import { Tag } from 'antd'
import { Radio } from 'antd-mobile'
import cls from 'classnames'
import {
  MATERIAL_TYPE_EN_VALS,
  MATERIAL_TYPE_CN_VALS,
} from 'src/pages/Material/constants'
import MaterialIcon from 'src/pages/Material/components/MaterialIcon'
import styles from './index.module.less'

const MaterialTag = ({ type, className }) => {
  let color = ''
  const text = MATERIAL_TYPE_CN_VALS[type]
  switch (type) {
    case MATERIAL_TYPE_EN_VALS.POSTER:
      color = 'orange'
      break
    case MATERIAL_TYPE_EN_VALS.PICTUER:
      color = 'cyan'
      break
    case MATERIAL_TYPE_EN_VALS.TEXT:
      color = 'geekblue'
      break
    case MATERIAL_TYPE_EN_VALS.MINI_APP:
      color = 'purple'
      break
    case MATERIAL_TYPE_EN_VALS.ARTICLE:
      color = 'magenta'
      break
    case MATERIAL_TYPE_EN_VALS.VIDEO:
      color = 'volcano'
      break
    case MATERIAL_TYPE_EN_VALS.LINK:
      color = 'blue'
      break
    case MATERIAL_TYPE_EN_VALS.FILE:
      color = 'gold'
      break
    default:
      break
  }
  return (
    <Tag color={color} className={className}>
      {text}
    </Tag>
  )
}

const MaterialItemContent = ({ data = {}, className, coverSize = 40, onClick }) => {
  const desc = data.description || data.summary || data.content
  return (
    <div
      className={cls({
        [styles['material-item']]: true,
        [className]: className,
      })}
      style={{
        paddingLeft: coverSize + 10,
        minHeight: `${coverSize}px`,
      }}
      onClick={onClick}
    >
      <MaterialIcon
        data={data}
        className={styles['item-cover']}
        size={coverSize}
        style={{
          width: coverSize,
          height: coverSize,
        }}
      />
      <div className={styles['material-item-title']}>
        <p className={styles['material-item-title-text']}>{data.title}</p>
      </div>
      <div className={styles['material-item-desc']}>{desc}</div>
      <MaterialTag type={data.type} className={styles['material-item-tag']} />
    </div>
  )
}
const MaterialCheckItem = (props) => {
  const { data = {}, onCheck, selectedKeys = [], className } = props
  const checked = selectedKeys.includes(data.id)
  const handleChecked = (nextCheckStatus = !checked) => {
    if (typeof onCheck === 'function') {
      onCheck(data, nextCheckStatus)
    }
  }

  const onRadioCheckChange = (radioCheck) => {
    handleChecked(!radioCheck)
  }

  const onClickNode = () => {
    handleChecked()
  }
  return (
    <div
      className={cls({
        [styles['material-list-item']]: true,
        [styles['material-list-checked-item']]: checked,
        [className]: className
      })}
      onClick={onClickNode}>
      <Radio
        checked={checked}
        onChange={onRadioCheckChange}
        className={styles['radio-item']}
      />
      <MaterialItemContent
        data={data}
        className={styles['material-list-item-content']}
      />
    </div>
  )
}

export default MaterialItemContent
export { MaterialCheckItem }

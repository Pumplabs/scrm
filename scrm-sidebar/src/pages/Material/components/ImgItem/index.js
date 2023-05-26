import cls from 'classnames'
import { Radio } from 'antd-mobile'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import styles from './index.module.less'

/**
 *
 * @param {Boolean} checked 是否勾选
 * @returns
 */
const MaterialImgItemWithCheck = ({
  data = {},
  onCheck,
  checked,
  selectedKeys = [],
}) => {
  const itemChecked = typeof checked === 'boolean' ? checked: selectedKeys.includes(data.id) 
  const isPoster = MATERIAL_TYPE_EN_VALS.POSTER === data.type
  const handleCheck = (item, checked) => {
    if (typeof onCheck === 'function') {
      onCheck(item, checked)
    }
  }

  const onRadioChange = (item) => {
    handleCheck(item, checked)
  }
  return (
    <div
      key={data.id}
      onClick={() => handleCheck(data, !itemChecked)}
      className={cls({
        [styles['list-item']]: true,
        [styles['list-check-item']]: itemChecked,
        [styles['list-poster-item']]: isPoster,
      })}>
      <Radio
        checked={itemChecked}
        className={styles['list-item-radio']}
        onChange={(e) => onRadioChange(data, e)}
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px',
        }}
      />
      <MaterialImgItem data={data} isPoster={isPoster} />
    </div>
  )
}

/**
 *
 * @param {Boolean} isPoster 是否为海报
 * @returns
 */
const MaterialImgItem = ({ data = {}, isPoster, className }) => {
  return (
    <div
      className={cls({
        [styles['material-img-item']]: true,
        [styles['material-poster-item']]: isPoster,
        [className]: className,
      })}>
      <ImgEle src={data.filePath} isPoster={isPoster} />
      <p className={styles['list-item-name']}>
        <span className={styles['list-item-name-text']}> {data.title}</span>
      </p>
    </div>
  )
}

const ImgEle = ({ src, isPoster }) => {
  return (
    <img
      src={src}
      alt=""
      className={cls({
        [styles['img-item']]: true,
        [styles['poster-img']]: isPoster,
      })}
    />
  )
}

export default MaterialImgItem
export { MaterialImgItemWithCheck }

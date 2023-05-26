import { Radio } from 'antd'
import styles from './index.module.less'
const ChartItem = ({ title, subTitle, options = [], onOptionsChange, optionValue, children }) => {
  return (
    <div className={styles['chart-item']}>
      <div className={styles['chart-item-header']}>
        <p className={styles['chart-item-name']}>
          {title}
        </p>
        <span className={styles['chart-item-subTitle']}>
          {subTitle}
        </span>
          <Radio.Group
            className={styles['chart-options']}
            options={options}
            onChange={onOptionsChange}
            value={optionValue}
            buttonStyle="solid"
            optionType="button"
          />
      </div>
      <div className={styles['chart-item-body']}>{children}</div>
    </div>
  )
}
export default ChartItem
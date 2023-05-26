import { Row, Col } from 'antd'
import cls from 'classnames'
import DescriptionsList from 'components/DescriptionsList'
import { formatNumber } from 'src/utils'
import styles from './index.module.less'
/**
 * 统计板块
 * @param {String} title 标题
 * @param {Array} indexOptions 指标
 * @param {Array} chartOptions 图表指标
 * @param {Function} onChartOptionChange 图表指标变换
 */
export default (props) => {
  const { title, indexOptions = [], children, className } = props

  return (
    <div
      className={cls({
        [styles['statics-card']]: true,
        [className]: className,
      })}>
      <div className={styles['statics-card-header']}>
        <div className={styles['statics-card-title']}>
          <span className={styles['title-text']}>{title}</span>
        </div>
        {indexOptions.length > 0 ? (
          <DescriptionsList mode="wrap">
            <Row className={styles['index-statics']}>
              {indexOptions.map((ele) => (
                <Col span={8} key={ele.title}>
                  <DescriptionsList.Item label={ele.title}>
                    <span className={styles['num-item']}>
                      {formatNumber(ele.value)}
                    </span>
                  </DescriptionsList.Item>
                </Col>
              ))}
            </Row>
          </DescriptionsList>
        ) : null}
      </div>
      <div className={styles['statics-card-body']}>{children}</div>
    </div>
  )
}

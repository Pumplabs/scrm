import { useMemo } from 'react'
import { Empty } from 'antd'
import InfiniteList from 'components/InfiniteList'
import DateCard from './components/DateCard'
import MomentItem from './components/MomentItem'
import { covertListByDate } from 'src/utils'
import styles from './index.module.less'

export default ({dataSource = [], ...rest}) => {
  const pageData = useMemo(() => {
    return covertListByDate(dataSource)
  }, [dataSource])
  return (
    <div>
      <InfiniteList
      {...rest}
      dataSource={dataSource}
        style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}
        empty={<Empty description={'暂时没有动态哦'} />}>
        {pageData.map((item) => (
          <DateCard key={item.fullDate} date={item.fullDate}>
            {item.list.map((ele) => (
              <MomentItem
                className={styles['moment-item']}
                key={ele.id}
                data={ele}
              />
            ))}
          </DateCard>
        ))}
      </InfiniteList>
    </div>
  )
}
export { default as MomentContent } from './components/MomentContent'
export { default as MomentItemWrap } from './components/MomentItemWrap'
export { default as DateCard } from './components/DateCard'
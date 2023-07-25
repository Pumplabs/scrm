import InfiniteList from 'src/components/InfiniteList'
import LiveItem from 'src/pages/Opportunity/components/LiveItem'

import styles from './index.module.less'
export default (props) => {
  return (
    <div>
       <InfiniteList
        {...props}
        bordered={false}
        listItemClassName={styles['list-item']}
        renderItem={(ele) => (
          <LiveItem className={styles['list-item']} data={ele}/>
        )}></InfiniteList>
    </div>
  )
}
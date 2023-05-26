import { useRequest } from 'ahooks'
import InfiniteList from 'src/components/InfiniteList'
import { useInfiniteHook } from 'src/hooks'
import Item from './Item'
import styles from './index.module.less'
export default (props) => {
  return (
    <div>
       <InfiniteList
        {...props}
        bordered={false}
        listItemClassName={styles['list-item']}
        renderItem={(ele) => (
          <Item className={styles['list-item']} data={ele}/>
        )}></InfiniteList>
    </div>
  )
}
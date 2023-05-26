import { useContext } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import Content from './EditPosterDrawer/Content'
import defaultQcodeUrl from 'assets/images/qcode.png'
import styles from './index.module.less'

const PosterViewer = ({  data = {}, onChange, editable, width, qcodeUrl = defaultQcodeUrl }) => {
  const onOk = (vals) => {
    handleChange({
      ...data,
      ...vals,
    })
  }

  const handleChange = (nextVal) => {
    if (typeof onChange === 'function') {
      onChange(nextVal)
    }
  }

  return (
    <div className={styles['poster-viewer']}>
      <PosterContent
        onOk={onOk}
        qcodeUrl={qcodeUrl ? qcodeUrl : defaultQcodeUrl}
        data={data}
        editable={editable}
        width={width}
      />
    </div>
  )
}

const PosterContent = observer((props) => {
  const { UserStore } = useContext(MobXProviderContext)
  const userData = UserStore.userData
  return (
    <Content
      avatarUrl={userData.avatarUrl}
      userName={userData.name}
      {...props}
    />
  )
})
export default PosterViewer

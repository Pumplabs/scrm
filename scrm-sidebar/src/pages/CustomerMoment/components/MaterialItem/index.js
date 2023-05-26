import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { encode } from 'js-base64'
import { get } from 'lodash'
import { FileList } from 'components/UploadFile'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { encodeUrl } from 'src/utils'
import styles from './index.module.less'

const MaterialItem = ({ data = {} }) => {
  const { pathname, search } = useLocation()

  const currentPath = useMemo(() => {
    return `${pathname}${search}`
  }, [pathname, search])

  const fileUrl = useMemo(() => {
    if (data.type === MATERIAL_TYPE_EN_VALS.LINK) {
      return data.link
    } else {
      return `/sidebar/materialInfo/${encode(data.id)}?${encodeUrl({
        backUrl: currentPath,
      })}`
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className={styles['moment-material']}>
      <FileList.Item
        data={{
          type: 'link',
          content: {
            title: get(data, 'title'),
            description: get(data, 'description') || get(data, 'summary'),
            coverSrc: '',
            linkUrl: fileUrl,
          },
        }}
      />
    </div>
  )
}

export default MaterialItem
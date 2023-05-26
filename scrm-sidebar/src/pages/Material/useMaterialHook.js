import { getFileUrl } from 'services/modules/remoteFile'
import { GetTrackMaterialList } from 'services/modules/material'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { MATERIAL_TYPE_EN_VALS } from './constants'

export default (options) => {
  const { type, needRemoteUrl = true, manual } = options
  const handleList = async (dataSource) => {
    if (needRemoteUrl) {
      const mediaIds = dataSource.map((ele) => ele.mediaId)
      const res = await getFileUrl(mediaIds)
      return dataSource.map((ele) => ({
        ...ele,
        filePath: res[ele.mediaId],
      }))
    } else {
      return dataSource
    }
  }
  return useInfiniteHook({
    handleList,
    manual,
    rigidParams: {
      type: type ? (typeof type === 'string' ? MATERIAL_TYPE_EN_VALS[type] : type) : '',
    },
    request: GetTrackMaterialList,
  })
}

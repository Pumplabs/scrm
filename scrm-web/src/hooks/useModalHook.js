import { useState, useMemo } from 'react'

/**
 * @param {array} typeList
 * @returns
 * @param {object} modalInfo
 * @param {function} openModal
 * @param {function} closeModal
 * @param {object} visibleMap
 * @param {function} setConfirm
 * @param {function} closeConfirm
 * @param {boolean} confirmLoading
 */

export default (typeList = []) => {
  const [modalInfo, setModalInfo] = useState({})
  const [confirmLoading, setConfirmLoading] = useState(false)
  const openModal = (type, data = {}) => {
    setModalInfo({
      type,
      data
    })
  }
  const closeModal = () => {
    setModalInfo({})
    setConfirmLoading(false)
  }

  const visibleMap = useMemo(() => {
    let obj = {}
    typeList.forEach(ele => {
      obj = {
        ...obj,
        [`${ele}Visible`]: modalInfo.type === ele
      }
    })
    return obj
  }, [modalInfo.type, typeList])

  const setConfirm = (flag = true) => {
    setConfirmLoading(flag)
  }
  const closeConfirm = () => {
    setConfirmLoading(false)
  }
  
  const requestConfirmProps = {
    onBefore() {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    }
  }
  return {
    modalInfo,
    openModal,
    closeModal,
    visibleMap,
    setConfirm,
    closeConfirm,
    confirmLoading,
    requestConfirmProps
  }
}
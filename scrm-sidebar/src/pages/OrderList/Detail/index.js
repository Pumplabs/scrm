import {
  Fragment,
  useContext,
  useMemo,
  createContext,
  useEffect,
  useRef,
} from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { decode, encode } from 'js-base64'
import { get } from 'lodash'
import { Toast, Dialog } from 'antd-mobile'
import { InformationCircleOutline } from 'antd-mobile-icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import cls from 'classnames'
import { useRequest } from 'ahooks'
import { observer } from 'mobx-react'
import { MobXProviderContext } from 'mobx-react'
import CustomerText from 'components/CustomerText'
import OpenEle from 'components/OpenEle'
import { FileList } from 'components/UploadFile'
import PageContent from 'components/PageContent'
import { ATTACH_TYPES } from 'components/UploadFile/constants'
import ApprovePopup, { APPROVE_VALS } from './components/ApprovePopup'
import { useBack, useModalHook } from 'src/hooks'
import { formatNumber } from 'src/utils'
import { decodeUrl } from 'src/utils/paths'
import OrderStatus from '../OrderStatus'
import { GetOrderDetail, EditOrder } from 'services/modules/order'
import { getRequestError, actionRequestHookOptions } from 'services/utils'
import { encodeUrl } from 'src/utils/paths'
import { STATUS_VALS } from '../constants'
import styles from './index.module.less'

export default observer(() => {
  const { id: parId } = useParams()
  const toastRef = useRef()
  const navigate = useNavigate()
  const { search, pathname } = useLocation()
  const { UserStore } = useContext(MobXProviderContext)
  const searchParams = useMemo(
    () => (search ? decodeUrl(search) : {}),
    [search]
  )

  const onBack = () => {
    const url = searchParams.backUrl || '/orderList'
    navigate(url)
  }

  const { closeModal, visibleMap, openModal } = useModalHook(['approve'])
  const orderId = useMemo(() => {
    return parId ? decode(parId) : ''
  }, [parId])

  useBack({
    onBack,
  })

  const { data: orderData = {}, run: runGetOrderDetail } = useRequest(
    GetOrderDetail,
    {
      manual: true,
      onBefore: () => {
        toastRef.current = Toast.show({
          icon: 'loading',
          duration: 0,
        })
      },
      onFinally: () => {
        if (toastRef.current) {
          toastRef.current.close()
          toastRef.current = null
        }
      },
      onError: (e) => {
        getRequestError(e, '查询失败')
        onBack()
      },
    }
  )

  const { run: runEditOrder } = useRequest(EditOrder, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: onBack,
    }),
  })
  useEffect(() => {
    if (orderId) {
      runGetOrderDetail({
        id: orderId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toastRef.current.close()
        toastRef.current = null
      }
    }
  }, [])

  const onCopy = () => {
    Toast.show({
      icon: 'success',
      content: `复制成功`,
    })
  }

  const onApproveOrder = async () => {
    openModal('approve')
  }
  const onDoneOrder = async () => {
    const result = await Dialog.confirm({
      content: `订单金额¥${formatNumber(orderData.orderAmount)}是否全部回款？`,
    })
    const params = handleEditBaseParams({
      collectionAmount: orderData.orderAmount,
      // status: STATUS_VALS.DONE,
      stauts: orderData.status
    })
    if (result) {
      runEditOrder(params)
    }
  }

  const currentPath = useMemo(() => {
    return `${pathname}${search}`
  }, [pathname, search])
  const onEditOrder = () => {
    navigate(
      `/editOrder/${encode(orderData.id)}?${encodeUrl({
        backUrl: currentPath,
      })}`
    )
  }

  const handleEditBaseParams = (opts = {}) => {
    const {
      attachments = [],
      orderProductList,
      orderAmount,
      collectionAmount,
      managerStaffExtId,
      description,
      discount,
      customerExtId,
    } = orderData
    const files = Array.isArray(attachments) ? attachments : []
    const productList = Array.isArray(orderProductList) ? orderProductList : []
    return {
      attachments: files,
      description,
      customerExtId,
      discount,
      collectionAmount,
      orderAmount,
      managerStaffExtId,
      productList: productList.map((item) => ({
        id: item.id,
        orderId: orderData.id,
        discount: item.discount,
        productName: item.productName,
        productNum: item.productNum,
        productPrice: item.productPrice,
        remark: item.remark,
      })),
      id: orderData.id,
      orderCode: orderData.orderCode,
      ...opts,
    }
  }
  const onApproveOk = (vals) => {
    let opt = {}
    if (vals.type === APPROVE_VALS.PASS) {
      opt = {
        status: STATUS_VALS.CONFIRM,
      }
      // 审核通过
    } else {
      opt = {
        status: STATUS_VALS.REJECT,
        auditFailedMsg: vals.info,
      }
    }
    const params = handleEditBaseParams(opt)
    runEditOrder(params)
  }

  const detailColumns = [
    {
      title: '产品',
      dataIndex: 'productName',
    },
    {
      title: '单价',
      dataIndex: 'productPrice',
      render: (record) => {
        return (
          <>
            <span className={styles['money-icon']}>¥</span>
            {formatNumber(record.productPrice)}
          </>
        )
      },
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      render: () => `${orderData.discount * 100}%`,
    },
    {
      title: '数量',
      dataIndex: 'productNum',
    },
  ]
  const fileList = Array.isArray(orderData.attachments)
    ? orderData.attachments.map((attachItem) => ({
        type: ATTACH_TYPES.FILE,
        uid: attachItem.id,
        content: {
          fileId: attachItem.id,
          name: attachItem.name,
          fileSize: attachItem.size,
          filePath: `${window.location.origin}/api/common/downloadByFileId?fileId=${attachItem.id}`,
        },
      }))
    : []
  const Footer = () => {
    return (
      <div className={styles['page-footer']}>
        <div className={styles['btns-content']}>
          {shouldEdit ? (
            <span className={styles['action-btn']} onClick={onEditOrder}>
              修改
            </span>
          ) : null}
          {shouldDone ? (
            <span className={styles['action-btn']} onClick={onDoneOrder}>
              完成
            </span>
          ) : null}
          {shouldApprove ? (
            <span className={styles['action-btn']} onClick={onApproveOrder}>
              审核
            </span>
          ) : null}
          {/* <span
            className={cls({
              [styles['action-btn']]: true,
              [styles['cancel-btn']]: true,
            })}>
            取消
          </span> */}
        </div>
      </div>
    )
  }

  const { shouldDone, shouldEdit, shouldApprove } = useMemo(() => {
    const isCreator =
      UserStore.userData.extId &&
      get(orderData, 'creatorStaff.extId') === UserStore.userData.extId
    const shouldEdit = isCreator && orderData.status === STATUS_VALS.REJECT
    const shouldApprove =
      orderData.status === STATUS_VALS.WAIT_CHECK && UserStore.userData.isAdmin
    const shouldDone =
      orderData.status === STATUS_VALS.CONFIRM && UserStore.userData.isAdmin
    return {
      shouldEdit,
      shouldDone,
      shouldApprove,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData.status, UserStore.userData.extId])
  const shouldShowFooter = shouldDone || shouldEdit || shouldApprove
  return (
    <PageContent footer={shouldShowFooter ? <Footer /> : null}>
      <ApprovePopup
        visible={visibleMap.approveVisible}
        onCancel={closeModal}
        onOk={onApproveOk}
      />
      <div className={styles['detail-page']}>
        <div className={styles['base-info']}>
          <InfoList labelClassName={styles['base-list-name']}>
            <InfoList.Item label="订单编号">
              {orderData.orderCode}
              <CopyToClipboard text={orderData.orderCode} onCopy={onCopy}>
                <span className={styles['copy-action']}>复制</span>
              </CopyToClipboard>
            </InfoList.Item>
            <InfoList.Item
              label="订单状态"
              style={{
                alignItems: 'flex-start',
              }}>
              <div style={{ display: 'flex' }}>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <OrderStatus status={orderData.status} />
                </div>
                {orderData.auditFailedMsg &&
                orderData.status === STATUS_VALS.REJECT ? (
                  <span className={styles['reject-tip']}>
                    <InformationCircleOutline
                      className={styles['reject-icon']}
                    />
                    {orderData.auditFailedMsg}
                  </span>
                ) : null}
              </div>
            </InfoList.Item>
            <InfoList.Item label="客户名称">
              <CustomerText data={orderData.customer} />
            </InfoList.Item>
            <InfoList.Item label="负责人">
              <OpenEle
                type="userName"
                openid={get(orderData, 'managerStaff.name')}
              />
            </InfoList.Item>
            <InfoList.Item label="创建人">
              <OpenEle
                type="userName"
                openid={get(orderData, 'creatorStaff.name')}
              />
            </InfoList.Item>
            <InfoList.Item label="创建时间">
              {orderData.createdAt}
            </InfoList.Item>
          </InfoList>
        </div>
        <div className={styles['detail-info']}>
          <p className={styles['detail-info-title']}>明细</p>
          <div className={styles['detail-info-content']}>
            <DetailTable
              columns={detailColumns}
              dataSource={orderData.orderProductList}
              rowDesc={(record) => {
                return record.profile ? (
                  <div className={styles['row-desc']}>{record.profile}</div>
                ) : null
              }}
            />
          </div>
        </div>
        <div className={styles['discount-content']}>
          <InfoList
            wrapClassName={styles['discount-list-content']}
            labelClassName={styles['discount-list-name']}>
            <InfoList.Item label="折扣">
              {orderData.discount * 100}%
            </InfoList.Item>
            <InfoList.Item label="订单金额">
              ¥{formatNumber(orderData.orderAmount)}
            </InfoList.Item>
            <InfoList.Item label="已收款">
              ¥{formatNumber(orderData.collectionAmount || 0)}
            </InfoList.Item>
          </InfoList>
        </div>
        <div className={styles['order-desc']}>
          <p className={styles['order-desc-name']}>订单描述</p>
          <div className={styles['order-desc-content']}>
            {orderData.description || '-'}
          </div>
        </div>
        <div className={styles['file-content']}>
          附件
          <div>{fileList.length ? <FileList files={fileList} /> : '无'}</div>
        </div>
      </div>
    </PageContent>
  )
})

const DetailTable = ({ columns = [], dataSource = [], rowDesc }) => {
  return (
    <ul className={styles['detail-table']}>
      <li
        className={cls({
          [styles['detail-thead-tr']]: true,
          [styles['detail-tr']]: true,
        })}>
        {columns.map((ele) => (
          <span className={styles['detail-cell']} key={ele.dataIndex}>
            {ele.title}
          </span>
        ))}
      </li>
      {dataSource.map((record) => (
        <Fragment key={record.id}>
          <li
            className={cls({
              [styles['detail-tbody-tr']]: true,
              [styles['detail-tr']]: true,
            })}>
            {columns.map((ele, idx) => (
              <span className={styles['detail-cell']} key={ele.dataIndex}>
                {typeof ele.render === 'function'
                  ? ele.render(record, idx)
                  : record[ele.dataIndex]}
              </span>
            ))}
          </li>
          {typeof rowDesc === 'function' ? rowDesc(record) : null}
        </Fragment>
      ))}
    </ul>
  )
}

const InfoContext = createContext({
  nameClassName: '',
})
const InfoList = ({ children, labelClassName, wrapClassName }) => {
  return (
    <ul className={styles['info-list']}>
      <InfoContext.Provider
        value={{
          labelClassName,
          wrapClassName,
        }}>
        {children}
      </InfoContext.Provider>
    </ul>
  )
}
const InfoListItem = ({ label, children, style, className }) => {
  const { labelClassName, wrapClassName } = useContext(InfoContext)
  return (
    <li
      className={cls({
        [styles['info-list-item']]: true,
        [className]: className,
      })}
      style={style}>
      <span
        className={cls({
          [styles['info-item-name']]: true,
          [labelClassName]: labelClassName,
        })}>
        {label}
      </span>
      <div className={wrapClassName}>{children}</div>
    </li>
  )
}
InfoList.Item = InfoListItem

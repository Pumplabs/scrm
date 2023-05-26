import { useContext } from 'react'
import { Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { last } from 'lodash'
import cls from 'classnames'
import PathContext from '../PathContext'
import styles from './index.module.less'

/**
 * @param {boolean} showBack 展示返回按钮
 * @param {string} backUrl 返回路径
 * @param {function} onBack 点击返回
 * @param {function} handlePaths 处理面包屑路径
 * @param {function} loading
 */
export default (props) => {
  const {
    backUrl,
    onBack,
    showBack = false,
    loading = false,
    renderBreadcrumb,
    handlePaths,
    children,
    className,
    loadingText
  } = props
  const { pageNames } = useContext(PathContext)
  const navigate = useNavigate()
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else if (backUrl) {
      navigate(backUrl)
    } else {
      navigate(-1)
    }
  }

  const userDefinedBreadcrumb = typeof renderBreadcrumb !== 'undefined'
  const userBreadcrumbIsNotEmpty =
    userDefinedBreadcrumb && !userDefinedBreadcrumb
  const breadcrumbPathsArr =
    typeof handlePaths === 'function' ? handlePaths(pageNames) : pageNames
  const breadcrumbPaths = Array.isArray(breadcrumbPathsArr)
    ? breadcrumbPathsArr
    : []
  const currentMenu = last(breadcrumbPaths) || {}
  const shouldShowBreadcrumb = userDefinedBreadcrumb
    ? userBreadcrumbIsNotEmpty
    : showBack || currentMenu.name
  return (
    <div
      className={cls({
        [styles.pageContent]: true,
        [styles['pageContent-with-breadcrumb']]: shouldShowBreadcrumb,
        [className]: className,
      })}>
      {shouldShowBreadcrumb ? (
        <div
          className={cls({
            [styles['breadcrumb-section']]: true,
            [styles['breadcrumb-section-with-backBtn']]: showBack,
          })}>
          {showBack ? (
            <ArrowLeftOutlined
              onClick={handleBack}
              className={styles['backBtn']}
            />
          ) : null}
          {userDefinedBreadcrumb
            ? typeof renderBreadcrumb === 'function'
              ? renderBreadcrumb(pageNames)
              : renderBreadcrumb
            : currentMenu.name}
        </div>
      ) : null}
      <div className={styles['route-content']}>
        <Spin spinning={loading} tip={loadingText}>
          {children}
        </Spin>
      </div>
    </div>
  )
}

import { useContext, useMemo } from 'react'
import cls from 'classnames'
import ConfigContext from './configContext'
import styles from './index.module.less'

const DescItem = (props) => {
  const {
    label,
    children,
    labelStyle = {},
    labelWidth,
    style = {},
    className,
    mode,
  } = props
  const { labelWidth: configLabelWidth, mode: configMode } = useContext(ConfigContext)
  const itemMode = mode || configMode || 'inline'
  const { wrapStyle, innerStyle } = useMemo(() => {
    if (itemMode === 'wrap') {
      return {}
    }
    const lwidth = labelWidth || configLabelWidth || 80
    return {
      wrapStyle: lwidth ? { paddingLeft: lwidth } : {},
      innerStyle: lwidth ? { width: lwidth } : {}
    }
  }, [itemMode, labelWidth, configLabelWidth])
  return (
    <div
      className={cls({
        [styles['desc-item']]: true,
        [styles['inline-mode']]: itemMode === 'inline',
        [className]: true,
      })}
      style={{ ...wrapStyle, ...style }}>
      <div
        className={styles['desc-item-label']}
        style={{
          ...innerStyle,
          ...labelStyle,
        }}>
        {label}
      </div>
      <div className={styles['desc-item-content']}>{children}</div>
    </div>
  )
}
const DescriptionsList = ({ children, labelWidth, mode }) => {
  return (
    <ConfigContext.Provider value={{ labelWidth, mode }}>
      {children}
    </ConfigContext.Provider>
  )
}
DescriptionsList.Item = DescItem

export default DescriptionsList

import cls from 'classnames'
import { PlusCircleFilled } from '@ant-design/icons'
export default ({ title = '上传图片', className }) => {
  return (
    <div className={
      cls({
        [className]: className,
        'wx-upload-img-btn': true
      })
    }>
      <p>
        <PlusCircleFilled
          style={{ fontSize: 28, color: "#d2d2d2", marginBottom: 4 }}
        />
      </p>
      <span>{title}</span>
    </div>
  )
}
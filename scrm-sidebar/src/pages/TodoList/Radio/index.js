import cls from 'classnames'
import styles from './index.module.less'
export default ({ options, className, value, onChange }) => {
  return (
    <ul
      className={cls({
        [styles['radio']]: true,
        [className]: className,
      })}>
      {options.map((item) => (
        <li
          key={item.value}
          className={cls({
            [styles['radio-item']]: true,
            [styles['active-radio-item']]: item.value === value,
          })}
          onClick={() => onChange(item.value)}>
          {item.label}
        </li>
      ))}
    </ul>
  )
}

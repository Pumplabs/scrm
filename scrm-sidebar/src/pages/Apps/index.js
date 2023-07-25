import { useContext } from 'react'
import styles from './index.module.less'
import cls from 'classnames'
import { useNavigate } from 'react-router-dom'
import {
  HiUser,
  HiUsers,
  HiPhoto,
  HiShoppingBag,
  HiLightBulb,
  HiCurrencyYen,
  HiIdentification,
} from 'react-icons/hi2'
import talkScriptIconUrl from 'assets/images/icon/app/talk-script.svg'

const menuData = [
  {
    title: '客户群发',
    color: '#F0BF42',
    Comp: HiUser,
    url: '/customerMass',
  },
  {
    title: '客户群群发',
    color: '#5483ED',
    Comp: HiUsers,
    url: '/groupMass',
  },
  {
    title: '素材库',
    color: '#DD4377',
    Comp: HiPhoto,
    url: '/materialList',
  },
  {
    title: '产品',
    color: '#57A65B',
    Comp: HiShoppingBag,
    url: '/productList',
  },
  {
    title: '商机',
    color: '#D6503F',
    Comp: HiLightBulb,
    url: '/opportunity',
  },
  {
    title: '订单',
    color: '#5483ED',
    Comp: HiCurrencyYen,
    url: '/orderList',
  },
  {
    title: '话术库',
    color: '#7132F8',
    imgUrl: talkScriptIconUrl,
    url: '/talkScriptList',
  },
]
const IndexContent = () => {
  const navigate = useNavigate()
  const onClickCustomerMass = () => {
    navigate('/customerMass')
  }

  const onClickMaterial = () => {
    navigate('/materialList')
  }

  const onClickGroupMass = () => {
    navigate('/groupMass')
  }

  const onClickOpportunity = () => {
    navigate('/opportunity')
  }
  const onClickProduct = () => {
    navigate('/productList')
  }

  const onClickOrder = () => {
    navigate('/orderList')
  }

  const onClickTalkTrick = () => {
    navigate('/talkScriptList')
  }

  return (
    <div style={{ flex: '1' }}>
      <h2 style={{ padding: 12 }}>功能</h2>
      <ul className={styles['actions-ul']}>
        {menuData.map((ele) => (
          <MenuActionItem
            key={ele.url}
            className={cls({
              [styles['customer-action-item']]: true,
            })}
            imgUrl={ele.imgUrl}
            Comp={ele.Comp}
            title={ele.title}
            onClick={() => {
              navigate(ele.url)
            }}
            iconWrapStyle={{
              backgroundColor: ele.color,
            }}
          />
        ))}
      </ul>
    </div>
  )
}

const MenuActionItem = ({
  className,
  Comp,
  title,
  imgUrl,
  iconWrapStyle = {},
  ...rest
}) => {
  return (
    <li
      className={cls({
        [styles['action-item']]: true,
        [className]: className,
      })}
      {...rest}>
      <span className={styles['action-item-icon-wrap']} style={iconWrapStyle}>
        {Comp ? <Comp size={28} color="#fff" /> : null}
        {imgUrl ? (
          <img src={imgUrl} alt="" className={styles['action-item-icon']} />
        ) : null}
        {/* <img src={imgUrl} alt="" className={styles['action-item-icon']} /> */}
      </span>
      <p className={styles['action-item-name']}>{title}</p>
    </li>
  )
}

export default IndexContent

import "./home.less"
import { useContext, useState } from "react";
import { Radio } from "antd"
import OpenEle from '../../components/OpenEle';
import { MobXProviderContext, observer } from 'mobx-react'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'


export const ItemPanel = observer((props) => {
    const [value, setValue] = useState("last7Days")
    const onChange = (e) => {
        setValue(e.target.value)
    }


    const options = [
        {
            label: '近7天',
            value: 'last7Days',
        },
        {
            label: '近30天',
            value: 'last30Days',
        }]

    const renderStaffTotalFollowUpList = () => {
        if (props.data[value]?.length > 0) {
            return props.data[value].map((element, index) => {
                return <Item key={index} index={index + 1} itemData={element} />
            });
        } else {
            return (
                <div>Ops..暂无数据</div>
            )
        }
    }

    return (
        <div className='item-panel'>
            <div className='header'>
                <div className="title">{props.title}</div>
                <div className="switch-wrap">
                    <Radio.Group
                        options={options}
                        onChange={onChange}
                        value={value}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
            </div>
            <div className='content'>
                {renderStaffTotalFollowUpList()}
            </div>
        </div>
    )
})

export const Item = observer((props) => {
    return (
        <div className='item'>
            <div className='item-icon-wrap'>
                <div className='item-icon'>
                    {props.index}
                </div>

            </div>
            <div className='user-label'>
                <div className='user-avatar'>
                    <img src={props.itemData.src ? props.itemData.src : defaultAvatorUrl} />
                </div>
                <div className="username">
                    <div className="name">
                        <OpenEle type="userName" openid={props.itemData.staffExtId} />
                    </div>
                    <div className="department">
                        {/* <OpenEle type="userName" openid={props.itemData.staffExtId} /> */}
                    </div>
                </div>
            </div>
            <div className="value">
                {props.itemData.total}
            </div>
        </div>
    )
})
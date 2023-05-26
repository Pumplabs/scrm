import { useState, useEffect } from 'react'
import { Switch, Spin } from 'antd'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import CommonModal from 'components/CommonModal'
import { actionRequestHookOptions } from 'services/utils'
import { GetSysSettings, EditSysSettings } from 'services/modules/settings'

const SETTINGS_VAL = {
  USER_REMOVE_CUSTOMER: 1,
  CUSTOMER_REMOVE_USER: 0,
}
export default ({ visible, data, ...rest }) => {
  const [settingData, setSettingData] = useState({
    [SETTINGS_VAL.USER_REMOVE_CUSTOMER]: {
      status: false
    },
    [SETTINGS_VAL.CUSTOMER_REMOVE_USER]: {
      status: false
    }
  })
  const { loading, run: runGetSysSettings, data: sysSettingsData = [] } = useRequest(GetSysSettings, {
    manual: true,
    onSuccess(data) {
      if (data.length === 0) {
        return false
      }
      let res = {}
      data.forEach((ele) => {
        res = {
          ...res,
          [ele.code]: {
            id: ele.id,
            status: Boolean(ele.status)
          }
        }
      })
      setSettingData(res)
    },
  })
  const { run: runEditSysSettings } = useRequest(
    EditSysSettings,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '设置',
        successFn: () => {
          runGetSysSettings({
            codeList: [
              SETTINGS_VAL.USER_REMOVE_CUSTOMER,
              SETTINGS_VAL.CUSTOMER_REMOVE_USER,
            ],
          })
        },
      }),
    }
  )

  const onUserChange = (checked) => {
    runEditSysSettings({
      id: settingData[SETTINGS_VAL.USER_REMOVE_CUSTOMER].id,
      status: Number(checked)
    })
  }

  const onCustomerChange = (checked) => {
    runEditSysSettings({
      id: settingData[SETTINGS_VAL.CUSTOMER_REMOVE_USER].id,
      status: Number(checked)
    })
  }

  useEffect(() => {
    if (visible) {
      if (isEmpty(sysSettingsData)) {
        runGetSysSettings({
          codeList: [
            SETTINGS_VAL.USER_REMOVE_CUSTOMER,
            SETTINGS_VAL.CUSTOMER_REMOVE_USER,
          ],
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <CommonModal
      {...rest}
      visible={visible}
      title="提醒设置"
      bodyStyle={{
        height: 320,
      }}>
      <Spin spinning={loading}>
        <div>
          <div style={{ marginBottom: 12 }}>
            当客户删除员工时，通知被删除员工：
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={onCustomerChange}
              checked={settingData[SETTINGS_VAL.CUSTOMER_REMOVE_USER].status}
            />
          </div>
          <div>
            当员工删除客户时，通知管理员：
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={settingData[SETTINGS_VAL.USER_REMOVE_CUSTOMER].status}
              onChange={onUserChange}
            />
          </div>
        </div>
      </Spin>
    </CommonModal>
  )
}

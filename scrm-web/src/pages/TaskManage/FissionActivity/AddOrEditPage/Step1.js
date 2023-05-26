import { Form, Input, Switch, Row, Col, DatePicker } from 'antd'
import moment from 'moment'
import MySelect from 'components/MySelect'
import TagSelect from 'components/TagSelect'
import UserNickName from './UserNickName'
import ChoosePoster from './ChoosePoster'
import PosterViewer from '../PosterViewer'
import IndateSelect from './IndateSelect'
import styles from './index.module.less'

export default ({ posterConfig, onUpdatePoster, isEdit }) => {
  return (
    <>
      <div style={{ paddingRight: 400, position: 'relative', height: 700 }}>
        <div className={styles['poster-thumb']}>
          <PosterViewer
            data={posterConfig}
            onChange={onUpdatePoster}
            editable={true}
          />
        </div>
        <Row>
          <Col span={24}>
            <Form.Item
              label="活动名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入活动名称',
                },
              ]}>
              <Input placeholder="请输入不超过20个字符" maxLength={20} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="接待员工"
              name="serviceStaff"
              rules={[
                {
                  required: true,
                  type: 'array',
                  message: '请选择接待员工',
                },
              ]}>
              <MySelect title="选择员工" onlyChooseUser={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="活动结束时间"
              name="endTime"
              rules={[
                {
                  required: true,
                  message: '请选择活动结束时间',
                },
              ]}>
              <DatePicker
                placeholder="请选择时间"
                showTime={true}
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={(current) => current.isBefore(moment(), 'day')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="二维码有效期" name="indate">
              <IndateSelect />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="删除员工好友助力失效"
              name="hasCheckDelete"
              valuePropName="checked">
              <Switch
                disabled={isEdit}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="添加海报"
              name="activityPoster"
              rules={[
                {
                  required: true,
                  message: '请添加海报',
                },
              ]}>
              <ChoosePoster />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="用户头像" name="hasHead" valuePropName="checked">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="用户昵称" name="userName">
              <UserNickName />
            </Form.Item>
          </Col>
        </Row>
        <Row>
        <Col span={24}>
          <Form.Item
            label="参与活动标签"
            name="joinTags"
            rules={[
              {
                required: false,
                type: 'array',
                message: '参与活动标签',
              },
            ]}>
            <TagSelect
              placeholder="请选择标签"
              style={{ width: '100%' }}
              allowAddTag={true}
            />
          </Form.Item>
        </Col>
      </Row>
      </div>
    </>
  )
}

import { Row, Col } from 'antd'
import CustomerStatics from './CustomerStatics'
import MaterialStatics from './MaterialStatics'
import GroupStatics from './GroupStatics'
import PullNewSection from './PullNewSection'
import JourneyStatics from './JourneyStatics'
import { PageContent } from 'src/layout'
export default () => {
  return (
    <PageContent>
      <Row gutter={16} style={{ marginBottom: 28 }}>
        <Col span={12}>
          <CustomerStatics />
        </Col>
        <Col span={12}>
          <GroupStatics />
        </Col>
      </Row>
      <JourneyStatics />
      <MaterialStatics />
      <PullNewSection />
    </PageContent>
  )
}

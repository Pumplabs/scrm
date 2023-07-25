import { useState } from 'react'
import "./home.less";
import { PageContent } from 'src/layout'
import ChartItem from '../Home/ChartItem'
import { LineChart } from 'components/MyChart'
import {
    getOverviewStatics,
    // getStaffTotalFollowUpLast30DaysAndTop5,
    // getStaffOrderTotalAmountLast30DaysAndTop5,
    GetUserPullNewStatics,
    getStaffTotalFollowUpStatisticsTop5,
    getStaffOrderTotalAmountStatisticsTop5,
    getCustomerLastNDaysCountDaily,
    getOpportunityLastNDaysCountDaily,
    getOrderLastNDaysCountDaily
} from 'services/modules/home_v2';
import { useRequest } from 'ahooks';
import { ItemPanel } from './component';
import JourneyStatics from '../Home/JourneyStatics'


export default () => {
    const [customerOption, setCustomerOption] = useState('seven')
    const [opportunityOption, setOpportunityOption] = useState('seven')
    const [orderOption, setOrderOption] = useState('seven')



    /**
     * Request Top5 data 
     */
    const { data: staffTotalFollowUpRawData = { last7Days: [], last30Days: [] }, loading: staffTotalFollowUpDataLoading } = useRequest(getStaffTotalFollowUpStatisticsTop5)
    const { data: staffTotalAmountRawData = { last7Days: [], last30Days: [] }, loading: staffTotalAmountRawDataLoading } = useRequest(getStaffOrderTotalAmountStatisticsTop5)
    const {
        data: userPullNewData = {},
    } = useRequest(GetUserPullNewStatics, {
        defaultParams: [
            {
                topNum: 5,
            },
        ],
    })


    /**
     * Request Trending data
     */
    const {
        data: last30DaysCustomerDailyCount = [],
    } = useRequest(getCustomerLastNDaysCountDaily)
    const {
        data: last30DaysOpportunityDailyCount = [],
    } = useRequest(getOpportunityLastNDaysCountDaily)

    const {
        data: last30DaysOrderDailyCount = [],
        loading: orderLoading
    } = useRequest(getOrderLastNDaysCountDaily)


    const handleUserPullNewData = () => {
        let last7Days = [];
        let last30Days = [];
        if (userPullNewData.last30DaysStatisticsInfos) {
            last30Days = userPullNewData.last30DaysStatisticsInfos.map((ele) => {
                return { staffExtId: ele.extStaffId, total: ele.newCustomerTotal }
            })
        }
        if (userPullNewData.last7DaysStatisticsInfos) {
            last7Days = userPullNewData.last7DaysStatisticsInfos.map((ele) => {
                return { staffExtId: ele.extStaffId, total: ele.newCustomerTotal }
            })
        }
        return { last7Days, last30Days, }
    }



    const chartOptions = [
        { label: '7日', value: 'seven' },
        { label: '30日', value: 'thirty' },
    ]

    const { data: overviewData = {}, loading: staticsLoading } = useRequest(getOverviewStatics)


    let opportunityLast7DaysData = last30DaysOpportunityDailyCount.filter((item, index) => {
        return index < 7
    })
    opportunityLast7DaysData.reverse()
    let opportunityLast30DaysData = last30DaysOpportunityDailyCount.map(item => {
        return item
    })
    opportunityLast30DaysData.reverse()



    let customerLast7DaysData = last30DaysCustomerDailyCount.filter((item, index) => {
        return index < 7
    })
    customerLast7DaysData.reverse()
    let customerLast30DaysData = last30DaysCustomerDailyCount.map(item => {
        return item
    })
    customerLast30DaysData.reverse()



    let orderLast7DaysData = last30DaysOrderDailyCount.filter((item, index) => {
        return index < 7
    })
    orderLast7DaysData.reverse()
    let orderLast30DaysData = last30DaysOrderDailyCount.map(item => {
        return item
    })
    orderLast30DaysData.reverse()


    //客户增长趋势数据
    const customerData = customerOption == "seven" ? customerLast7DaysData : customerLast30DaysData;

    const opportunityData = opportunityOption == "seven" ? opportunityLast7DaysData : opportunityLast30DaysData

    const orderData = orderOption == "seven" ? orderLast7DaysData : orderLast30DaysData



    // handle chart change event
    const onCustomerOptionChange = (e) => {
        setCustomerOption(e.target.value)
    }

    const onOpportunityOptionChange = (e) => {
        setOpportunityOption(e.target.value)
    }


    const onOrderOptionChange = (e) => {
        setOrderOption(e.target.value)
    }


    return (
        <PageContent>
            <div className='overview-container'>
                <div className='header'>
                    <h3>数据总览</h3>
                </div>
                <div className='overview-list'>
                    <div className="overview-item">
                        <div className='index-name'>
                            新增客户
                        </div>
                        <div className='index-value'>
                            {overviewData.customerCount}
                        </div>
                    </div>
                    <div className="overview-item">
                        <div className='index-name'>
                            新增商机
                        </div>
                        <div className='index-value'>
                            {overviewData.opportunityCount}
                        </div>
                    </div>
                    <div className="overview-item">
                        <div className='index-name'>
                            新增订单
                        </div>
                        <div className='index-value'>
                            {overviewData.orderCount}
                        </div>
                    </div>
                    <div className="overview-item">
                        <div className='index-name'>
                            新增跟进
                        </div>
                        <div className='index-value'>
                            {overviewData.followUpCount}
                        </div>
                    </div>
                </div>
            </div>

            <div className='chart-container'>
                <div className='item-container'>
                    <ChartItem
                        options={chartOptions}
                        onOptionsChange={onCustomerOptionChange}
                        optionValue={customerOption}
                        title="客户趋势">
                        <LineChart
                            dataSource={customerData}
                            loading={staticsLoading}
                            needZoom={false}
                            fieldNames={{
                                label: 'day',
                                value: [
                                    {
                                        name: '新增总数',
                                        key: 'saveTotal',
                                    },
                                ],
                            }}
                        />
                    </ChartItem>
                </div>
                <div className='item-container'>
                    <ChartItem
                        options={chartOptions}
                        onOptionsChange={onOpportunityOptionChange}
                        optionValue={opportunityOption}
                        title="商机趋势">
                        <LineChart
                            needLegend={false}
                            dataSource={opportunityData}
                            loading={false}
                            needZoom={false}
                            fieldNames={{
                                label: 'day',
                                value: [
                                    {
                                        name: '新增总数',
                                        key: 'saveTotal',
                                    },
                                ],
                            }}
                        />
                    </ChartItem>
                </div>
                <div className='item-container'>
                    <ChartItem
                        options={chartOptions}
                        onOptionsChange={onOrderOptionChange}
                        optionValue={orderOption}
                        title="订单趋势">
                        <LineChart
                            dataSource={orderData}
                            loading={orderLoading}
                            needZoom={false}
                            fieldNames={{
                                label: 'day',
                                value: [
                                    {
                                        name: '新增总数',
                                        key: 'saveTotal',
                                    },
                                ],
                            }}
                        />
                    </ChartItem>
                </div>

            </div>

            <div className='chart-container'>

            </div>

            <JourneyStatics />
            <div className='section-container'>
                <ItemPanel key="1" data={staffTotalFollowUpRawData} title="员工跟进榜" />
                <ItemPanel key="2" data={staffTotalAmountRawData} title="员工订单榜" />
                <ItemPanel key="3" data={handleUserPullNewData()} title="新客户榜" />
            </div>
        </PageContent>
    )
}



import { NotFound, NotAuth, SysError, NoMenu } from 'src/pages/ExceptionPage'
import Layout from 'layout'
import loadable from "@loadable/component"
// 界面路由
const Login = loadable(() => import('routes/wrap/WrapLogin'))
const LoginCallbackPage = loadable(() => import('routes/wrap/WrapLoginMiddle'))
// 首页
const Home = loadable(() => import('pages/HomeV2'))
// 用户管理
const UserManage = loadable(() => import('pages/UserManage'))
// 群标签
const GroupTagManage = loadable(() => import('pages/GroupTagManage'))
// 客户管理
const CustomerManage = loadable(() => import('pages/CustomerManage'))
// 客户新增
const CustomerMassAddOrEditPage = loadable(() =>
  import('pages/CustomerMass/AddOrEditPage')
)
// 客户详情
const CustomerMassDetailPage = loadable(() =>
  import('pages/CustomerMass/DetailPage')
)
// 客户群发
const CustomerMass = loadable(() => import('pages/CustomerMass'))
// 客户群群发
const GroupMassAddOrEditPage = loadable(() =>
  import('pages/GroupMass/AddOrEditPage')
)
// 客户群详情
const GroupMassDetailPage = loadable(() => import('pages/GroupMass/DetailPage'))
// 客户群群发
const GroupMass = loadable(() => import('pages/GroupMass'))
// 流失记录
const LossingCustomer = loadable(() => import('pages/LossingCustomer'))
// 客户群详情
const GroupDetail = loadable(() => import('pages/CustomerGroup/GroupDetail'))
// 客户群管理
const CustomerGroup = loadable(() => import('pages/CustomerGroup'))
// 渠道码
const ChannelCode = loadable(() => import('pages/ChannelCode'))

// 客户旅程
const CustomerJourney = loadable(() => import('pages/CustomerJourney'))
// 在职转接
const IncumbencyTransfer = loadable(() => import('pages/IncumbencyTransfer/index'))
// 离职继承
const DimissionInherit = loadable(() => import('pages/DimissionInherit'))

// 轨迹素材
const TrackMaterial = loadable(() => import('pages/SaleOperations/TrackMaterial'))
// 新增文章
const AddArticlePage = loadable(() =>
  import('pages/SaleOperations/TrackMaterial/Article/AddArticlePage')
)
// 素材标签
const MaterialTags = loadable(() => import('pages/SaleOperations/MaterialTags'))
// 普通素材
const OrdinaryMaterial = loadable(() =>
  import('pages/SaleOperations/OrdinaryMaterial')
)
// 欢迎语设置
const WelcomeSetting = loadable(() => import('pages/WelcomeSetting'))
// 话术
const TalkScript = loadable(() => import('pages/TalkScript'))
// 管理员列表
const AdminList = loadable(() => import('pages/AdminList'))
// 角色管理
const RoleManage = loadable(() => import('pages/RoleManage'))
// 商机管理
const CommercialOpportunity = loadable(() => import('pages/CommercialOpportunity'))
// 商机管理配置
const CommercialOpportunityConfiguration = loadable(() => import('pages/CommercialOpportunityConfiguration'))
// 销售目标
const SaleTarget = loadable(() => import('pages/SaleTarget'))

// 产品分类
const ProductCategory = loadable(() => import('pages/ProductCategory'))
// 产品列表
const ProductList = loadable(() => import('pages/ProductList'))
// 订单列表
const OrderList = loadable(() => import('pages/OrderList'))

const config = [
  {
    path: '/system-error',
    element: <SysError />,
  },
  {
    path: '/no-auth',
    element: <NotAuth />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login-middle',
    element: (
      <LoginCallbackPage />
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'no-menu',
        element: <NoMenu />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'userManage',
        element: <UserManage />,
      },

      {
        path: 'groupTagManage',
        element: <GroupTagManage />,
      },
      {
        path: 'customerMass/add',
        element: <CustomerMassAddOrEditPage />,
      },
      {
        path: 'customerMass/detail/:id',
        element: <CustomerMassDetailPage />,
      },
      {
        path: 'customerMass/edit/:id',
        element: <CustomerMassAddOrEditPage />,
      },
      {
        path: 'customerMass',
        element: <CustomerMass />,
      },
      {
        path: 'customerGroupMass/add',
        element: <GroupMassAddOrEditPage />,
      },
      {
        path: 'customerGroupMass/edit/:id',
        element: <GroupMassAddOrEditPage />,
      },
      {
        path: 'customerGroupMass/detail/:id',
        element: <GroupMassDetailPage />,
      },
      {
        path: 'customerGroupMass',
        element: <GroupMass />,
      },
      {
        path: 'customerManage',
        element: <CustomerManage />,
      },
      {
        path: 'lossingHistory',
        element: <LossingCustomer />,
      },
      {
        path: 'groupList/detail/:id',
        element: <GroupDetail />,
      },
      {
        path: 'groupList',
        element: <CustomerGroup />,
      },
      {
        path: 'channelQrCode',
        element: <ChannelCode />,
      },

      {
        path: 'customerJourney',
        element: <CustomerJourney />,
      },
      {
        path: 'incumbencyTransfer',
        element: <IncumbencyTransfer />,
      },
      {
        path: 'dimissionInherit',
        element: <DimissionInherit />,
      },
      {
        path: 'saleOperation/trackMaterial',
        element: <TrackMaterial />,
      },
      {
        path: 'saleOperation/trackMaterial/article/add',
        element: <AddArticlePage />,
      },
      {
        path: 'saleOperation/trackMaterial/article/edit/:id',
        element: <AddArticlePage />,
      },
      {
        path: 'saleOperation/materialTags',
        element: <MaterialTags />,
      },
      {
        path: 'saleOperation/ordinaryMaterial',
        element: <OrdinaryMaterial />,
      },
      {
        path: 'welcomeSetting',
        element: <WelcomeSetting />,
      },
      {
        path: 'talkScript',
        element: <TalkScript />,
      },
      {
        path: 'adminList',
        element: <AdminList />,
      },
      {
        path: 'commercialOpportunity',
        element: <CommercialOpportunity />
      },
      {
        path: 'commercialOppConfiguration',
        element: <CommercialOpportunityConfiguration />
      },
      {
        path: 'saleTarget',
        element: <SaleTarget />
      },
      {
        path: 'productCategory',
        element: <ProductCategory />
      },
      {
        path: 'productList',
        element: <ProductList />
      },
      {
        path: 'orderList',
        element: <OrderList />
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]
export default config

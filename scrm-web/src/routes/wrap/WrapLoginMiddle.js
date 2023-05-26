import Login from '../../pages/Login/CallBackPage'
import LazyLoad from 'routes/LazyLoad'
export default () => <LazyLoad comp={Login} needLogin={false} needAuth={false} />
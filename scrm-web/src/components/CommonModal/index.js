import { Modal } from 'antd';

const getPreTitle = (modalType) => {
  switch (modalType) {
    case 'add':
      return '新增'
    case 'edit':
      return '编辑'
    default:
      return ''
  }
}
export default ({ modalType, name, children, ...rest }) => {
  return (
    <Modal
      width={620}
      title={`${getPreTitle(modalType)}${name}`}
      centered={true}
      maskClosable={false}
      {...rest}
    >
      {children}
    </Modal>
  );
};

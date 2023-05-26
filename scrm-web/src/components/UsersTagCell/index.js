import UserTag from 'components/UserTag'
import ExpandCell from 'components/ExpandCell'

export default ({ dataSource }) => {
  return (
    <ExpandCell
      dataSource={dataSource}
      renderItem={(ele, idx) => (
        <UserTag
          data={{ avatarUrl: ele.avatarUrl, name: ele.name }}
          key={ele.id}
          style={{ marginLeft: idx === 0 ? 0 : 4, marginBottom: 4 }}
        />
      )}
    />
  )
}

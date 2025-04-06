import { UserOutlined } from '@ant-design/icons';
import { EditButton, List, useTable } from '@refinedev/antd';
import { Avatar, Space, Table } from 'antd';
import { User } from '../../interfaces/user';

export const UserList: React.FC = () => {
  const { tableProps } = useTable<User>({
    resource: 'admin/users',
    pagination: { current: 1, pageSize: 10 },
  });

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      >
        <Table.Column
          title="Avatar"
          render={(_, record: User) => (
            <>
              <Avatar shape="square" src={record.avatar_url} alt={record.name} icon={<UserOutlined />} />
            </>
          )}
        />
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="role" title="Role" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_: any, record: User) => (
            <Space>
              <>
                <EditButton type="text" hideText recordItemId={record.id} />
              </>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

import { DeleteButton, EditButton, List, ShowButton, useTable } from '@refinedev/antd';
import { useCan, useCustomMutation, useGetIdentity } from '@refinedev/core';
import { Avatar, Badge, Button, Flex, Form, Input, Modal, Popover, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { Group } from '../../interfaces/group';
import { User } from '../../interfaces/user';

export const GroupList: React.FC = () => {
  const { data: createAccess } = useCan({
    resource: 'groups',
    action: 'create',
  });

  const { data: identity } = useGetIdentity<User>();

  const { tableProps } = useTable<Group>({
    resource: 'groups',
    pagination: { current: 1, pageSize: 10 },
  });
  const { mutate: addUser, isLoading: isLoadingAddUser } = useCustomMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');

  const handleAddUser = async () => {
    if (!selectedGroupId || !userEmail) return;
    addUser(
      {
        url: `groups/${selectedGroupId}/players`,
        method: 'post',
        values: { user_email: userEmail },
        successNotification: () => ({
          message: 'User added to group successfully!',
          type: 'success',
        }),
      },
      {
        onSuccess: (data, variables, context) => {
          //reloadTable();
        },
      }
    );
    setIsModalVisible(false);
    setUserEmail('');
  };

  return (
    <List canCreate={createAccess?.can} title="Groups" createButtonProps={{ size: 'large' }}>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
        }}
      >
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column<Group>
          title={'Members'}
          dataIndex="members"
          render={(_, record: Group) => (
            <Flex gap={12}>
              {record.members?.map((member) => {
                return (
                  <Popover
                    key={member.id}
                    content={
                      <Typography.Text>
                        {member.name}
                        {record.owner_id === member.id ? '/ Lead' : ''}
                      </Typography.Text>
                    }
                  >
                    <Badge dot={record.owner_id === member.id}>
                      <Avatar shape="square" src={member.avatar_url} alt={member.name} />
                    </Badge>
                  </Popover>
                );
              })}
            </Flex>
          )}
        />
        <Table.Column
          key="add_player"
          render={(_: any, record: Group) => (
            <Space>
              {identity?.id === record.owner_id && (
                <>
                  <Button
                    type="primary"
                    disabled={isLoadingAddUser}
                    onClick={() => {
                      setUserEmail('');
                      setSelectedGroupId(record.id);
                      setIsModalVisible(true);
                    }}
                  >
                    Add Player
                  </Button>
                </>
              )}
            </Space>
          )}
        />

        {createAccess?.can && (
          <Table.Column
            title="Actions"
            key="actions"
            render={(_: any, record: Group) => (
              <Space>
                {(identity?.role === 'admin' || identity?.id === record.owner_id) && (
                  <>
                    <ShowButton type="text" hideText recordItemId={record.id} />
                    <EditButton type="text" hideText recordItemId={record.id} />
                    <DeleteButton confirmTitle="Are you sure you want to delete this group?" type="text" hideText recordItemId={record.id} />
                  </>
                )}
              </Space>
            )}
          />
        )}
      </Table>

      <Modal
        title="Add Player to Group"
        open={isModalVisible}
        okButtonProps={{
          size: 'large',
        }}
        cancelButtonProps={{
          size: 'large',
        }}
        onOk={handleAddUser}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item
            label="User Email"
            rules={[
              { required: true },
              {
                type: 'email',
              },
            ]}
          >
            <Input size="large" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter user email" />
          </Form.Item>
        </Form>
      </Modal>
    </List>
  );
};

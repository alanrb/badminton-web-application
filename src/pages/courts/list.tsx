import { PlusSquareOutlined } from '@ant-design/icons';
import { DeleteButton, EditButton, List, useForm, useTable } from '@refinedev/antd';
import { CanAccess, useCan } from '@refinedev/core';
import { Button, Form, Input, Modal, Space, Table } from 'antd';
import { useState } from 'react';

interface Court {
  id: string;
  name: string;
  address: string;
  google_map_url?: string;
  contact?: string;
}
export const CourtsList: React.FC = () => {
  const { data: canAccess } = useCan({
    resource: 'courts',
    action: 'create',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { tableProps, tableQuery: courtsQuery } = useTable<Court>({});

  const { formProps, onFinish } = useForm({
    resource: 'courts',
    action: 'create',
    redirect: false,
    onMutationSuccess: () => {
      setIsModalVisible(false);
    },
    successNotification: {
      message: ``,
      description: `Court created successfully.`,
      type: 'success',
    },
  });

  const handleCreate = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <List
        headerButtons={[
          <CanAccess resource="courts" action="create">
            <Button type="primary" icon={<PlusSquareOutlined />} onClick={handleCreate}>
              Create
            </Button>
          </CanAccess>,
        ]}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          rowKey="id"
        >
          <Table.Column dataIndex={['name']} title={'Name'} />
          <Table.Column dataIndex={['address']} title={'Address'} />
          <Table.Column dataIndex={['contact']} title={'Contact'} />
          {canAccess?.can && (
            <Table.Column<Court>
              title={'Actions'}
              render={(_, record: Court) => (
                <Space>
                  <EditButton type="text" hideText recordItemId={record.id} />
                  <DeleteButton type="text" confirmTitle="Are you sure you want to delete this court?" hideText recordItemId={record.id} />
                </Space>
              )}
            />
          )}
        </Table>

        {/* Create/Edit Court Modal */}
        <Modal
          title={'Create Court'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
          }}
          footer={null}
        >
          <Form
            {...formProps}
            layout="vertical"
            hidden={!isModalVisible}
            onFinish={async (values) => {
              await onFinish({
                ...values,
              });
            }}
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please enter the address' }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Google Map URL"
              name="google_map_url"
              rules={[
                { required: true, message: 'Please enter the Google Map URL' },
                {
                  type: 'url',
                  message: 'Please enter a valid URL',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Estimate Price Per Hour" name="estimate_price_per_hour" rules={[{ required: true, message: 'Please enter the price' }]}>
              <Input type="number" size="large" />
            </Form.Item>
            <Form.Item label="Contact" name="contact" rules={[{ required: true, message: 'Please enter the contact' }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Remark" name="remark">
              <Input.TextArea size="large" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" size="large" htmlType="submit">
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </List>
    </>
  );
};

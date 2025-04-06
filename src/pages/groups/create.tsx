import { Create, useForm } from '@refinedev/antd';
import { useNavigation, useNotification } from '@refinedev/core';
import { Form, Input } from 'antd';
import { Group } from '../../interfaces/group';
import api from '../../utils/api';

export interface CreateGroupRequest {
  name: string;
}

export const createGroup = async (data: CreateGroupRequest): Promise<Group> => {
  const response = await api.post<Group>('/groups', data);
  return response.data;
};

export const GroupCreate: React.FC = () => {
  const [form] = Form.useForm();
  const { formProps, saveButtonProps } = useForm();

  const { open } = useNotification();
  const { push } = useNavigation();

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        size: 'large',
      }}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Group Name" name="name" rules={[{ required: true, message: 'Please enter a group name' }]}>
          <Input size="large" />
        </Form.Item>
      </Form>
    </Create>
  );
};

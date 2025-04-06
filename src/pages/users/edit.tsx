import { Edit, useForm } from '@refinedev/antd';
import { useOne, useResourceParams } from '@refinedev/core';
import { Form, Input, Select } from 'antd';
import { User, UserResponse } from '../../interfaces/user';

export const UserEdit = () => {
  const { identifier, id } = useResourceParams();

  const { data: userResponse, isLoading } = useOne<UserResponse>({
    resource: 'admin/users',
    id: id,
  });

  const { formProps, saveButtonProps, query, formLoading } = useForm<User>({
    action: 'edit',
    resource: 'admin/users',
    id: id,
  });

  const user = userResponse?.data?.user;

  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
        size: 'large',
      }}
      deleteButtonProps={{
        size: 'large',
      }}
      isLoading={formLoading || isLoading}
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          roles: userResponse?.data?.roles,
        }}
      >
        <Form.Item label="Name">
          <Input size="large" disabled value={user?.name} />
        </Form.Item>
        <Form.Item label="Role" name="roles">
          <Select
            mode="multiple"
            size="large"
            maxCount={1}
            defaultValue={user?.role}
            placeholder="Select role"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Group Owner', value: 'group_owner' },
              { label: 'Player', value: 'player' },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};

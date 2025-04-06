import { Edit, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

export const GroupEdit = () => {
  const { formProps, saveButtonProps, query, formLoading } = useForm({});

  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
        size: 'large',
      }}
      deleteButtonProps={{
        size: 'large',
      }}
      isLoading={formLoading}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
          <Input size="large" />
        </Form.Item>
      </Form>
    </Edit>
  );
};

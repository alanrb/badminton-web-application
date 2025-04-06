import { Edit, useForm } from '@refinedev/antd';
import { Form, Input } from 'antd';

export const CourtEdit = () => {
  const { formProps, saveButtonProps, query, formLoading } = useForm({});

  return (
    <Edit
      saveButtonProps={{
        ...saveButtonProps,
        size: 'large',
      }}
      isLoading={formLoading}
    >
      <Form {...formProps} layout="vertical">
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
      </Form>
    </Edit>
  );
};

import { Edit, useForm, useSelect } from '@refinedev/antd';
import { useNavigation } from '@refinedev/core';
import { DatePicker, Form, GetProps, Input, InputNumber, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';

interface Court {
  id: string;
  name: string;
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

export const SessionEdit = () => {
  const { list, create, edit, show, clone, push, replace, goBack, listUrl, createUrl, editUrl, showUrl, cloneUrl } = useNavigation();

  const {
    formProps,
    saveButtonProps,
    formLoading: isCourtsLoading,
  } = useForm({
    resource: `sessions`,
    action: 'edit',
    redirect: false,
    successNotification: (data, values, resource) => {
      return {
        message: ``,
        description: 'Session Updated Successfully',
        type: 'success',
      };
    },
    onMutationSuccess: () => {
      // Navigate back to the sessions list
      list('sessions');
    },
  });

  const { selectProps: courtSelectProps } = useSelect<Court>({
    resource: 'courts',
    optionValue: 'id',
    optionLabel: 'name',
  });

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  };

  return (
    <Edit
      resource="sessions"
      saveButtonProps={{
        ...saveButtonProps,
        size: 'large',
      }}
      deleteButtonProps={{
        size: 'large',
      }}
      isLoading={isCourtsLoading}
    >
      <Form {...formProps} layout="vertical">
        <Space
          direction="vertical"
          style={{
            width: '100%',
          }}
        >
          <Form.Item
            label={'Description'}
            name="description"
            rules={[
              {
                required: true,
                message: 'Please enter a description',
              },
            ]}
          >
            <Input size="large" placeholder="Type here" />
          </Form.Item>

          <Form.Item label="Badminton Court" name="badminton_court_id" rules={[{ required: true, message: 'Please select a badminton court' }]}>
            <Select
              {...courtSelectProps}
              size="large"
              loading={isCourtsLoading}
              placeholder="Badminton Court"
              labelRender={(court) => <Typography.Text strong>{court.label}</Typography.Text>}
            />
          </Form.Item>

          <Form.Item
            label={'Max Members'}
            name="max_members"
            rules={[
              {
                required: true,
                message: 'Please enter the max members',
              },
              {
                min: 1,
                max: 100,
                type: 'integer',
              },
            ]}
          >
            <InputNumber
              style={{
                width: '100%',
              }}
              size="large"
              placeholder="Type Description"
            />
          </Form.Item>

          {/* <Form.Item label="Date & Time" name="date_time" rules={[{ required: true, message: 'Please select a date and time' }]}>
            <DatePicker
              size="large"
              style={{
                width: '100%',
              }}
              showTime
              disabledDate={disabledDate}
              format="HH A DD/MM/YYYY"
            />
          </Form.Item> */}
        </Space>
      </Form>
    </Edit>
  );
};

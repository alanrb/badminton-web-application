import { Create, useForm } from '@refinedev/antd';
import { useList, useNavigation } from '@refinedev/core';
import { DatePicker, Form, GetProps, Input, InputNumber, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { Group } from '../../interfaces/group';

interface Court {
  id: string;
  name: string;
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

export const SessionCreate = () => {
  const { list, create, edit, show, clone, push, replace, goBack, listUrl, createUrl, editUrl, showUrl, cloneUrl } = useNavigation();

  const { formProps, saveButtonProps } = useForm({
    resource: `sessions`,
    redirect: false,
    successNotification: (data, values, resource) => {
      return {
        message: ``,
        description: 'Session Created Successfully',
        type: 'success',
      };
    },
    onMutationSuccess: () => {
      // Navigate back to the sessions list
      list('sessions');
    },
  });

  const { data: courtsData, isLoading: isCourtsLoading } = useList<Court>({
    resource: 'courts',
  });
  
  const { data: groupData, isLoading: isGroupLoading } = useList<Group>({
    resource: 'groups',
  });
  

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        size: 'large',
      }}
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
            <Select size="large" loading={isCourtsLoading}>
              {courtsData?.data?.map((court: any) => (
                <Select.Option key={court.id} value={court.id}>
                  {court.name}
                </Select.Option>
              ))}
            </Select>
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

          <Form.Item label="Date & Time" name="date_time" rules={[{ required: true, message: 'Please select a date and time' }]}>
            <DatePicker
              size="large"
              style={{
                width: '100%',
              }}
              showTime
              disabledDate={disabledDate}
              format="HH A DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item label="Group" name="group_id" rules={[{ required: false, message: 'Please select a group' }]}>
            <Select size="large" loading={isGroupLoading} placeholder="Select a group (optional)">
              {groupData?.data?.map((group: any) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
      </Form>
    </Create>
  );
};

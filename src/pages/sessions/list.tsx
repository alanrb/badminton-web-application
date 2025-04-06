import { UserOutlined } from '@ant-design/icons';
import { DateField, EditButton, List, useTable } from '@refinedev/antd';
import { CanAccess, useApiUrl, useCustom, useCustomMutation, useGetIdentity, useNavigation } from '@refinedev/core';
import { Avatar, Badge, Button, Flex, InputNumber, Modal, Popconfirm, Popover, Space, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { User } from '../../interfaces/user';

interface AttendedSessionsResponse {
  data: Session[];
}

export const SessionList: React.FC = () => {
  const apiUrl = useApiUrl();
  const { data: identity } = useGetIdentity<User>();
  const { edit } = useNavigation();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [slotCount, setSlotCount] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const { tableProps, tableQuery: sessionsQuery } = useTable<Session>({
    resource: 'sessions',
    pagination: { current: 1, pageSize: 10 },
  });

  // Fetch attended sessions for the user using useCustom
  const {
    data: attendedSessionsData,
    isLoading: isAttendedSessionsLoading,
    refetch: refetchAttendedSessions,
  } = useCustom<AttendedSessionsResponse>({
    url: `${apiUrl}/users/attended-sessions`,
    method: 'get',
  });

  const reloadTable = () => {
    refetchAttendedSessions();
    sessionsQuery.refetch();
  };

  // Handle attend button click using useUpdate
  const { mutate: attendSession, isLoading: isLoadingAttendSession } = useCustomMutation();

  // Handle cancel button click using useDelete
  const { mutate: cancelAttendance, isLoading: isLoadingCancelAttendance } = useCustomMutation();

  // Extract data from the responses
  const attendedSessions = attendedSessionsData?.data.data || [];

  // Check if the user has already attended a session
  const hasAttended = (sessionId: string) => {
    return attendedSessions.some((element, index, array) => element.id === sessionId);
  };

  // Handle attend button click
  const handleAttend = (session: Session) => {
    setSelectedSession(session);
    setIsModalVisible(true);
  };

  // Handle attend button click
  const confirmAttend = () => {
    if (!selectedSession) return;

    attendSession(
      {
        url: `sessions/${selectedSession.id}/attend`,
        method: 'post',
        values: { slot: slotCount },
        successNotification: () => ({
          message: 'Successfully attended the session!',
          type: 'success',
        }),
        errorNotification: () => ({
          message: 'Failed to attend the session.',
          type: 'error',
        }),
      },
      {
        onSuccess: (data, variables, context) => {
          reloadTable();
        },
      }
    );

    setIsModalVisible(false);
  };

  // Handle cancel button click
  const handleCancel = (sessionId: string) => {
    cancelAttendance(
      {
        url: `sessions/${sessionId}/attend`,
        method: 'delete',
        values: { slot: slotCount },
        successNotification: () => ({
          message: 'Successfully canceled attendance!',
          type: 'success',
        }),
        errorNotification: () => ({
          message: 'Failed to cancel attendance.',
          type: 'error',
        }),
      },
      {
        onSuccess: (data, variables, context) => {
          reloadTable();
        },
      }
    );
  };

  return (
    <CanAccess>
      <List resource="sessions">
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
        >
          <Table.Column<Session>
            title={'Description'}
            render={(_, record: Session) => (
              <>
                {record.group_name !== '' ? (
                  <Popover key={record.id} content={<Typography.Text>{record.group_name}</Typography.Text>}>
                    <Typography.Text strong>{record.description}</Typography.Text>
                  </Popover>
                ) : (
                  <Typography.Text strong>{record.description}</Typography.Text>
                )}
                <br />
                <Typography.Text>{record.location}</Typography.Text>
              </>
            )}
          />
          <Table.Column<Session>
            title={'Attendees'}
            dataIndex="attendees"
            render={(_, record: Session) => (
              <Flex gap={12}>
                {record.attendees?.map((member) => {
                  return (
                    <Popover key={member.id} content={<Typography.Text>{`${member.name} - ${member.slot} slot(s)`}</Typography.Text>}>
                      <Badge
                        style={{
                          color: '#fff',
                        }}
                        count={member.slot}
                      >
                        <Avatar shape="square" src={member.avatar_url} alt={member.name} icon={<UserOutlined />} />
                      </Badge>
                    </Popover>
                  );
                })}
              </Flex>
            )}
          />

          <Table.Column dataIndex={['max_members']} title={'Max Members'} />
          <Table.Column dataIndex={['date_time']} title={'Date'} render={(value) => <DateField format="hh A DD/MM/YYYY" value={value} />} />
          <Table.Column<Session>
            title={'Actions'}
            dataIndex="actions"
            render={(_, record: Session) => (
              <>
                <Space>
                  {hasAttended(record.id) ? (
                    <Popconfirm
                      title="Cancel Attendance"
                      description="Are you sure you want to cancel your attendance?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => handleCancel(record.id)}
                    >
                      <Button danger disabled={isLoadingCancelAttendance || isAttendedSessionsLoading}>
                        Cancel
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Button disabled={isLoadingAttendSession || isAttendedSessionsLoading} onClick={() => handleAttend(record)}>
                      Attend
                    </Button>
                  )}
                  {identity && identity.id == record.created_by ? (
                    <EditButton type="text" hideText={true} onClick={() => edit('sessions', record.id)} />
                  ) : (
                    <></>
                  )}
                </Space>
              </>
            )}
          />
        </Table>
        {/* Slot Input Modal */}
        <Modal title="Attend Session" open={isModalVisible} onOk={confirmAttend} onCancel={() => setIsModalVisible(false)}>
          <Typography.Paragraph>{selectedSession?.description}</Typography.Paragraph>
          <Typography.Paragraph>How many slots do you want to reserve?</Typography.Paragraph>
          <InputNumber
            min={1}
            max={selectedSession ? selectedSession.max_members - selectedSession.current_members : 1}
            value={slotCount}
            inputMode="numeric"
            stringMode={false}
            onChange={(value) => setSlotCount(value || 1)}
          />
        </Modal>
      </List>
    </CanAccess>
  );
};

import { GoogleOutlined } from '@ant-design/icons';
import { ThemedTitleV2 } from '@refinedev/antd';
import { Button, Layout, Space, Typography } from 'antd';
import { signInWithRedirect } from 'aws-amplify/auth';

export const Login: React.FC = () => {
  function handleSignInClick() {
    signInWithRedirect({
      provider: 'Google',
    });
  }

  return (
    <Layout
      style={{
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Space direction="vertical" align="center">
        <ThemedTitleV2
          collapsed={false}
          wrapperStyles={{
            fontSize: '22px',
            marginBottom: '36px',
          }}
        />
        <Button type="primary" icon={<GoogleOutlined />} onClick={handleSignInClick}>
          Sign in with Google
        </Button>
        <Typography.Text type="secondary">Powered by Alanrb</Typography.Text>
      </Space>
    </Layout>
  );
};

import { Authenticated, CanAccess, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import { ErrorComponent, ThemedLayoutV2, ThemedSiderV2, useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';

import routerBindings, { CatchAllNavigate, DocumentTitleHandler, NavigateToResource, UnsavedChangesNotifier } from '@refinedev/react-router';

import { ContactsOutlined, GithubOutlined, PushpinOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { fetchAuthSession, Hub } from '@aws-amplify/core';
import { App as AntdApp, Button, Layout, Space, Typography } from 'antd';
import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { AppIcon } from './components/app-icon';
import { Header } from './components/header';
import { ColorModeContextProvider } from './contexts/color-mode';
import { CourtEdit, CourtsList } from './pages/courts';
import { GroupCreate, GroupDetails, GroupEdit, GroupList } from './pages/groups';
import { Login } from './pages/login';
import { SessionCreate, SessionEdit, SessionList } from './pages/sessions';
import { UserEdit } from './pages/users';
import { UserList } from './pages/users/list';
import { accessControlProvider } from './providers/accessControlProvider';
import authProvider from './providers/authProvider';
import dataProvider from './providers/dataProvider';
import api from './utils/api';

function App() {
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: 'your_userPoolClientId',
        userPoolId: 'your_userPoolId',
        loginWith: {
          oauth: {
            domain: 'your_userPoolId.auth.ap-southeast-1.amazoncognito.com',
            scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
            redirectSignIn: ['http://localhost:5173'],
            redirectSignOut: ['http://localhost:5173'],
            responseType: 'code',
          },
        },
      },
    },
  });

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          getUser();
          break;
        case 'signInWithRedirect_failure':
          setError('An error has occurred during the OAuth flow.');
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          break;
        case 'customOAuthState':
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          break;
      }
    });

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      const session = await fetchAuthSession();
      authProvider.setToken(session.tokens);

      const userAttributes = await fetchUserAttributes();
      if (userAttributes) {
        const profileResponse = await api.put(`/auth/cognito`, {
          id: userAttributes.sub,
          email: userAttributes.email,
          name: userAttributes.name,
          picture: userAttributes.picture,
        });

        const { permissions } = profileResponse.data;
        localStorage.setItem('permissions', JSON.stringify(permissions));

        // Reload to apply access permission
        location.reload();
      }
    } catch (error) {
      console.error(error);
      console.log('Not signed in');
    }
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              routerProvider={routerBindings}
              accessControlProvider={accessControlProvider}
              resources={[
                {
                  name: 'sessions',
                  list: '/sessions',
                  create: '/sessions/create',
                  edit: '/sessions/edit/:id',
                  meta: {
                    canDelete: true,
                    icon: <ContactsOutlined />,
                  },
                },
                {
                  name: 'groups',
                  list: '/groups',
                  create: '/groups/create',
                  edit: '/groups/edit/:id',
                  show: '/groups/show/:id',
                  meta: {
                    canDelete: true,
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: 'courts',
                  list: '/courts',
                  edit: '/courts/edit/:id',
                  meta: {
                    label: 'Courts',
                    icon: <PushpinOutlined />,
                  },
                },
                {
                  name: 'users',
                  list: '/users',
                  edit: '/users/edit/:id',
                  meta: {
                    label: 'Users',
                    icon: <UserOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: 'F1qxOm-wsFmTI-rbKXxU',
                title: { text: 'Badminton', icon: <AppIcon /> },
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="authenticated-inner" fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2
                        Header={Header}
                        Footer={() => (
                          <Layout.Footer
                            style={{
                              textAlign: 'center',
                            }}
                          >
                            <Space>
                              <Typography.Text>
                                The project is open-source and licensed under the MIT License. You can find the source code on GitHub.
                              </Typography.Text>
                              <Button
                                type="text"
                                icon={<GithubOutlined />}
                                href="https://github.com/alanrb/badminton-backend"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on GitHub
                              </Button>
                            </Space>
                          </Layout.Footer>
                        )}
                        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                      >
                        <CanAccess>
                          <Outlet />
                        </CanAccess>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<NavigateToResource resource="sessions" />} />
                  <Route path="/sessions">
                    <Route index element={<SessionList />} />
                    <Route path="create" element={<SessionCreate />} />
                    <Route path="edit/:id" element={<SessionEdit />} />
                  </Route>
                  <Route path="/groups">
                    <Route index element={<GroupList />} />
                    <Route path="create" element={<GroupCreate />} />
                    <Route path="edit/:id" element={<GroupEdit />} />
                    <Route path="show/:id" element={<GroupDetails />} />
                  </Route>
                  <Route path="/courts">
                    <Route index element={<CourtsList />} />
                    <Route path="edit/:id" element={<CourtEdit />} />
                  </Route>
                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                  </Route>

                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

import { AuthTokens, fetchAuthSession, fetchUserAttributes, getCurrentUser, signInWithRedirect, signOut } from '@aws-amplify/auth';
import { AuthProvider } from '@refinedev/core';

interface CognitoAuthProvider extends AuthProvider {
  setToken: (token?: AuthTokens | undefined) => Promise<void>;
}

const authProvider: CognitoAuthProvider = {
  setToken: async (token) => {
    if (token) {
      localStorage.setItem('token', token?.accessToken.toString());
    } else {
      localStorage.removeItem('token');
    }
  },
  login: async () => {
    try {
      await signInWithRedirect({
        provider: 'Google',
      });

      const session = await fetchAuthSession();
      const accessToken = session.tokens?.accessToken;
      authProvider.setToken(session.tokens);

      if (accessToken) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
        };
      }
    } catch (error) {
      return {
        success: false,
      };
    }
  },
  logout: async () => {
    await signOut();

    const token = localStorage.getItem('token');

    if (token && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
    }

    return {
      success: true,
      redirectTo: '/login',
    };
  },
  onError: async (error) => {
    if (error && error.statusCode === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      return {
        authenticated: false,
        error: {
          message: 'Check failed',
          name: 'Token not found',
        },
        logout: true,
        redirectTo: '/login',
      };
    }
    return Promise.resolve({ error });
  },
  check: async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: 'Check failed',
          name: 'Token not found',
        },
        logout: true,
        redirectTo: '/login',
      };
    } catch (error) {
      return {
        authenticated: false,
        error: {
          message: 'Check failed',
          name: 'Token not found',
        },
        logout: true,
        redirectTo: '/login',
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      if (userAttributes) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return {
          id: userAttributes.sub,
          name: userAttributes.name,
          email: userAttributes.email,
          avatar: userAttributes.picture,
          roles: user.roles,
        };
      }
    } catch (error) {
      return null;
    }
    return null;
  },
};

export default authProvider;

import { AccessControlProvider } from '@refinedev/core';

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // Fetch roles and permissions from local storage
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

    // Check if the user has the required permission
    const requiredPermission = `${action}_${resource}`;

    console.log(`accessControlProvider requiredPermission: ${requiredPermission}`);

    if (permissions.includes(requiredPermission)) {
      return { can: true };
    }

    // Deny access by default
    return { can: false };
  },
};

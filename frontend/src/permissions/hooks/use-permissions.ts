/**
 * Permission hook
 */
'use client';

import { useMemo } from 'react';
import { getPermissionsForRole } from '../roles';
import { Permission } from '../permissions';

export function usePermissions(userRole?: string): {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
} {
  const permissions = useMemo(() => {
    if (!userRole) return [];
    return getPermissionsForRole(userRole);
  }, [userRole]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    return perms.some((perm) => permissions.includes(perm));
  };

  const hasAllPermissions = (perms: Permission[]): boolean => {
    return perms.every((perm) => permissions.includes(perm));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}


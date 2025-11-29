/**
 * Permission gate component
 */
'use client';

import { ReactNode } from 'react';
import { usePermissions } from '../hooks/use-permissions';
import { Permission } from '../permissions';

interface CanProps {
  permission: Permission | Permission[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
  userRole?: string;
}

export function Can({ permission, children, fallback = null, requireAll = false, userRole }: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions(userRole);

  const canAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission);

  return canAccess ? <>{children}</> : <>{fallback}</>;
}


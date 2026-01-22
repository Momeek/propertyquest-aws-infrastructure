import type { AdminAttr } from '@/interfaces/admin.interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import type {
//   AdminRolePermission,
//   RolePermissionAction,
// } from 'server/models/role.model';

export const adminPermissions = [
  {
    name: 'Admin',
    view: 'VIEW_ADMIN',
    manage: 'MANAGE_ADMIN',
  },
  {
    name: 'Role',
    view: 'VIEW_ROLE',
    manage: 'MANAGE_ROLE',
  },
  {
    name: 'Hospital',
    view: 'VIEW_HOSPITAL',
    manage: 'MANAGE_HOSPITAL',
  },
  {
    name: 'WithdrawalRequest',
    view: 'VIEW_WITHDRAWAL_REQUEST',
    manage: 'MANAGE_WITHDRAWAL_REQUEST',
  },
  {
    // fund patient wallet by cash
    name: 'Overdraft',
    view: 'VIEW_OVERDRAFT',
    manage: 'MANAGE_OVERDRAFT',
  },
  {
    name: 'Dashboard',
    view: 'VIEW_DASHBOARD',
    manage: 'MANAGE_DASHBOARD',
  },
  {
    name: 'Transactions',
    view: 'VIEW_TRANSACTION',
    manage: 'MANAGE_TRANSACTION',
  },
] as const;

interface CurrentAdminState {
  token: string | null;
  admin: AdminAttr;
  isAthenticated: boolean;
  // hasPermission: (
  //   permission: AdminRolePermission,
  //   action: RolePermissionAction,
  // ) => boolean;
  setAdmin: (admin: AdminAttr) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useCurrentAdminStore = create<
  CurrentAdminState,
  [['zustand/persist', CurrentAdminState], ['zustand/devtools', never]]
>(
  persist(
    (set) => ({
      token: null,
      admin: {},
      isAthenticated: false,
      // hasPermission: (
      //   permission: AdminRolePermission,
      //   action: RolePermissionAction,
      // ) => {
      //   const found = (adminPermissions.find((p) => p.name === permission))?.[action];
        
      //   if (!found) return false;

      //   return get().admin.permissions?.includes(found) || false;
      // },
      setAdmin: (admin: AdminAttr) => set({ admin }),
      setToken: (token: string) => set({ token, isAthenticated: true }),
      logout: () => set({ admin: {}, token: null, isAthenticated: false }),
    }),
    {
      name: 'current-user',
    },
  ),
);

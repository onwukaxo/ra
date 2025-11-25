// Role and permission map for RBAC
export const ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  KITCHEN: 'kitchen',
  STAFF: 'staff',
  CUSTOMER: 'customer',
} as const

// Permissions keyed by capability with allowed roles
export const PERMISSIONS = {
  MANAGE_USERS: [ROLE.OWNER, ROLE.ADMIN],
  VIEW_USERS: [ROLE.OWNER, ROLE.ADMIN, ROLE.MANAGER],
  MANAGE_MENU: [ROLE.OWNER, ROLE.ADMIN, ROLE.MANAGER],
  MANAGE_ORDERS: [ROLE.OWNER, ROLE.ADMIN, ROLE.MANAGER, ROLE.CASHIER],
  KITCHEN_ORDERS: [ROLE.OWNER, ROLE.ADMIN, ROLE.MANAGER, ROLE.KITCHEN],
  VIEW_REPORTS: [ROLE.OWNER, ROLE.ADMIN, ROLE.MANAGER],
  TENANT_SETTINGS: [ROLE.OWNER],
  BILLING: [ROLE.OWNER],
} as const


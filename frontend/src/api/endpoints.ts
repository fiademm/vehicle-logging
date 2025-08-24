export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  VERIFY: '/auth/verify',
};

export const VEHICLE_ENDPOINTS = {
  TYPES: '/vehicles/types',
  CURRENT: '/vehicles/current',
  LOGS: '/vehicles/logs',
  ENTRY: '/vehicles/entry',
  EXIT: (id: number) => `/vehicles/exit/${id}`,
  DELETE_LOG: (id: number) => `/vehicles/logs/${id}`,
  EXPORT: '/vehicles/export',
};
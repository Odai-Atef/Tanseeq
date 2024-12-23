// Define user roles as constants
export const ADMIN_ROLE = '5e81b539-8401-4106-9e8f-a076f881453b';
export const USER_ROLE = 'user';

// Helper function to check if a role is admin
export const isAdmin = (role: string): boolean => role === ADMIN_ROLE;

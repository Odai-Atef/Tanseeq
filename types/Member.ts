export interface Member {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string | null;
  email: string;
  avatar: string | null;
  status: 'active' | 'inactive';
}

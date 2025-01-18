import { Member } from './Member';

export interface Home {
  id: string;
  name: string;
  date_created: string;
  is_default: boolean;
  property_users: Member[];
  // Static values until we get the calculation API
  tasks: number;
  links: number;
  progress: number;
}

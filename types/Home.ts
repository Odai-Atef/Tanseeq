import { Member } from './Member';

export interface Home {
  name: string;
  date_created: string;
  tasks: number;
  links: number;
  progress: number;
  property_users: Member[];
}

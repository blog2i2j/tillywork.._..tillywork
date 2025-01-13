import { User } from '../users';

export interface Project {
  id: number;
  name: string;
  ownerId: string;
  users: ProjectUser[];
  inviteCode?: string;
}

export interface ProjectUser {
  id: number;
  role: string;
  user: User;
  project: Project;
  inviteCode?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'group_owner' | 'admin' | 'player';
  avatar_url: string;
}

export interface UserResponse {
  user: User;
  roles: string[];
}

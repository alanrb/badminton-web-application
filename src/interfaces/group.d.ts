export interface Group {
  id: string;
  name: string;
  owner_id: string;
  members?: User[];
  created_at: string;
}

export interface CreateGroupRequest {
  name: string;
  owner_id: string;
}

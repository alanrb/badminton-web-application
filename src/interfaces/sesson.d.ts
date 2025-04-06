interface Session {
  id: string;
  description: string;
  location: string;
  created_by: string;
  max_members: number;
  current_members: number;
  date_time: string;
  status: string;
  group_name?: string;
  attendees?: Attendee[];
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  slot: number;
  status: string;
  remark?: string;
}

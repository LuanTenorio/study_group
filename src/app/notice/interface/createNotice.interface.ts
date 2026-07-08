export interface CreateNotice {
  title: string;
  description: string;
  expiration_date: string;
  group_id: number;
  user_id: number;
}

export interface UpdateNotice {
  title: string;
  description: string;
  expiration_date: string;
  group_id: number;
}
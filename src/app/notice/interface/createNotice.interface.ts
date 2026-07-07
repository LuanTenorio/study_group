export interface CreateNotice {
  description: string;
  expiration_date: string;
  group_id: number;
  user_id: number;
}

export interface UpdateNotice {
  description: string;
  expiration_date: string;
  group_id: number;
}
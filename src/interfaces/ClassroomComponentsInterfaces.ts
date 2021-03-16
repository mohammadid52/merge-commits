export interface Quote {
  text?: string;
  author?: string;
}
export interface Widget {
  id?: string;
  teacherAuthID?: string;
  teacherEmail?: string;
  roomID?: string;
  type?: string;
  placement?: string;
  title?: string;
  description?: string;
  content?: {
    image?: string;
    text?: string;
  };
  quotes?: Quote[];
  active?: boolean;
  teacher?: any;
  createdAt?: string;
  updatedAt?: string;
}

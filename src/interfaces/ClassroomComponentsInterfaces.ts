export interface Quote {
  [key: string]: any;
  text: string;
  author?: string;
}
export interface Link {
  [key: string]: any;
  text?: string;
  url: string;
}
export interface Widget {
  [key: string]: any;
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
  links?: Link[];
  active?: boolean;
  teacher?: any;
  createdAt?: string;
  updatedAt?: string;
}

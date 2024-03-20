declare interface User {
  uuid: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
declare type NewUser = Partial<User>;

declare interface Post {
  uuid: string;
  title: string;
  content: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
declare type NewPost = Partial<Post>;

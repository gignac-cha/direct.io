declare interface User {
  uuid: string;
  name: string;
  nickname: string;
  email: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
declare interface NewUser {
  name: string;
  nickname: string;
  email: string;
  birthday: string;
}
declare interface Tag {
  uuid: string;
  value: string;
  count: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
declare interface NewTag {
  value: string;
  count: number;
}
declare interface Article {
  uuid: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdBy: number;
}
declare interface NewArticle {
  title: string;
  content: string;
  createdBy: number;
}
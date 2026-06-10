import { JSX } from "react";
import { CREATE_POST, EDIT_POST } from "@/constant/Constant";

export type INavLink = {
  icon: JSX.Element;
  name: string;
  cat: string;
};

export type TypeCreateAndUpdatePost = typeof CREATE_POST | typeof EDIT_POST;

export type IFormLog_In = {
  email: string;
  password: string;
};

export type IFormSign_up = {
  bio: string;
  name: string;
  email?: string;
  userName: string;
};

export type IUserInfCercle = {
  user: IUser | IPosts;
  col?: boolean;
  createdAt?: string;
  home?: boolean;
  time?: boolean;
  userId?: string;
  MyPage?: boolean;
};

export type IPosts = {
  id: string;
  user: IUser;
  createdAt: string;
  public_id: string;
  name: string;
  imageUrl: string;
  userId: string;
  caption: string;
  postId: string;
  isLiked: boolean;
  isSaved: boolean;
  userName: string;
  likeCounts: number;
};

export type IUser = {
  id: string;
  bio: string;
  name: string;
  createdAt: string;
  userName: string;
  userId: string;
  isFollow: boolean;
  postCounts: number;
  likeCounts: number;
  followerCounts: string[];
  followingCounts: string[];
};

export interface IForm_Create_Update_Post {
  imageUrl: File | string;
  caption: string;
  public_id?: string;
}

export interface IForm_Create_Update_Post_PublicId extends IForm_Create_Update_Post {
  public_id: string;
}
export type IEditProfileInput = {
  label: string;
  name: string;
  type?: string;
};

export type IUserBtnPostORLiked = {
  name: string;
  img: string;
};

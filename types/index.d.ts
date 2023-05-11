export interface Tokens {
  access_token: string;
  refresh_token: string;
}
export interface User {
  id: string;
  email: string;
  role: number;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    name: string | null;
    bio: string | null;
    avaImage: string | null;
    bgImage: string | null;
    userEmail: string;
  };
}

export interface LoginRes {
  token: Tokens;
  user: User;
}

export type Pagination<T = unknown> = T & {
  page: number;
  perpage: number;
  total: number;
  totalPage: number;
};

export interface Article {
  id: string;
  slug: string;
  title: string;
  body: string;
  coverImage: string;
  tags: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  Category: {
    id: string;
    name: string;
    image: string;
  };
}

export interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

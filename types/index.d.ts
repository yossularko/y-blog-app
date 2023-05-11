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

export interface Comment {
  id: string;
  body: string;
  images: string[];
  createdAt: string;
  User: {
    id: string;
    profile: {
      name: string;
      avaImage: string;
    };
  };
}

export interface ArticleDetails extends Article {
  Author: {
    id: string;
    profile: {
      id: string;
      name: string;
      bio: string;
      avaImage: string;
      bgImage: string;
      userEmail: string;
    };
  };
  comments: Comment[];
}

export interface Slug {
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

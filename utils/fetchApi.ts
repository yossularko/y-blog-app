import axios from "axios";
import { appUrl } from "./constant";

const fetchApi = axios.create({ baseURL: `${appUrl}/api` });

export const login = async (data: any) => {
  return await fetchApi.post("/auth/signin", data, { withCredentials: true });
};

export const register = async (data: any) => {
  return await fetchApi.post("/auth/signup", data);
};

export const refreshToken = async (data: any) => {
  return await fetchApi.post("/auth/refresh-token", data, {
    withCredentials: true,
  });
};

export const revokeToken = async (data: any) => {
  return await fetchApi.patch("/auth/revoke", data, {
    withCredentials: true,
  });
};

export const getProfile = async (id: string) => {
  return await fetchApi.get(`/users/${id}`, { withCredentials: true });
};

export const updateProfile = async (id: string, data: any) => {
  return fetchApi.patch(`/users/${id}`, data, {
    withCredentials: true,
  });
};

export const getArticle = async () => {
  return await fetchApi.get("/articles");
};

export const getMyArticle = async () => {
  return await fetchApi.get("/articles/my-article", { withCredentials: true });
};

export const getArticleDetails = async (slug: string) => {
  return await fetchApi.get(`/articles/${slug}`);
};

export const getCategory = async () => {
  return await fetchApi.get("/categories", { withCredentials: true });
};

export const postArticle = async (data: any) => {
  return fetchApi.post("/articles", data, {
    withCredentials: true,
  });
};

export const commentArticle = async (data: any) => {
  return fetchApi.post("/comments", data, {
    headers: {
      "Content-Type": "multipart/form-data", // tidak diperlukan untuk axios versi 1.4 keatas
    },
    withCredentials: true,
  });
};

export default fetchApi;

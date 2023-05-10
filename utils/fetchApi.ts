import axios from "axios";
import { appUrl } from "./constant";

const fetchApi = axios.create({ baseURL: `${appUrl}/api` });

export const login = async (data: any) => {
  return await fetchApi.post("/auth/signin", data, { withCredentials: true });
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
  return await fetchApi.get("/articles/my-article", { withCredentials: true });
};

export default fetchApi;

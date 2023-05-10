import axios from "axios";
import { appUrl } from "./constant";

const fetchApi = axios.create({ baseURL: `${appUrl}/api` });

export { fetchApi };

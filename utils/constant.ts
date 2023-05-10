import { Tokens, User } from "@/types";

const appUrl = process.env.app_url;

const initialToken: Tokens = { access_token: "", refresh_token: "" };
const initialUser: User = {
  id: "",
  email: "",
  role: 0,
  createdAt: "",
  updatedAt: "",
  profile: {
    id: "",
    name: "",
    bio: "",
    avaImage: "",
    bgImage: "",
    userEmail: "",
  },
};

export { appUrl, initialToken, initialUser };

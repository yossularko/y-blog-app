import { LoginRes, User } from "@/types";
import { ErrorResponse } from "@/types/error";
import errorRes from "@/utils/errorRes";
import { refreshToken } from "@/utils/fetchApi";
import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";

enum ActionKind {
  RETRIEVE_DATA = "RETRIEVE_DATA",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  UPDATE_PROFILE = "UPDATE_PROFILE",
}

enum StorageKind {
  userData = "userData",
}

type ACTIONTYPE =
  | {
      type: ActionKind.RETRIEVE_DATA;
      isLoading?: boolean;
      userData: LoginRes;
    }
  | {
      type: ActionKind.LOGIN;
      isLoading?: boolean;
      userData: LoginRes;
    }
  | {
      type: ActionKind.LOGOUT;
      isLoading?: boolean;
      userData?: LoginRes;
    }
  | {
      type: ActionKind.UPDATE_PROFILE;
      isLoading?: boolean;
      userData: LoginRes;
    };

interface State {
  isLoading: boolean;
  userData: LoginRes;
  signIn: (res: LoginRes) => void;
  signOut: () => void;
  setUpdateProfile: (data: User) => void;
  handleRefreshToken: () => Promise<void>;
}

interface Props {
  children: React.ReactNode;
}

const initialUserData: LoginRes = {
  token: {
    access_token: "",
    refresh_token: "",
  },
  user: {
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
  },
};

const initialState: State = {
  isLoading: true,
  userData: initialUserData,
  signIn: () => {},
  signOut: () => {},
  setUpdateProfile: () => {},
  handleRefreshToken: async () => {},
};

export const AuthContext = createContext<State>(initialState);

const loginReducer = (prevState: State, action: ACTIONTYPE) => {
  switch (action.type) {
    case ActionKind.RETRIEVE_DATA:
      return {
        ...prevState,
        userData: action.userData,
        isLoading: false,
      };
    case ActionKind.LOGIN:
      return {
        ...prevState,
        userData: action.userData,
        isLoading: false,
      };
    case ActionKind.LOGOUT:
      return {
        ...prevState,
        userData: initialUserData,
        isLoading: false,
      };
    case ActionKind.UPDATE_PROFILE:
      return {
        ...prevState,
        userData: action.userData,
        isLoading: false,
      };
    default:
      return {
        ...prevState,
        isLoading: false,
      };
  }
};

const AuthProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const toast = useToast();

  useEffect(() => {
    const getInitialData = () => {
      try {
        const userStorage = localStorage.getItem(StorageKind.userData);
        const userDataParse = userStorage
          ? (JSON.parse(userStorage) as LoginRes)
          : initialUserData;

        const userData = userDataParse.user ? userDataParse : initialUserData;

        return dispatch({
          type: ActionKind.RETRIEVE_DATA,
          userData,
        });
      } catch (error) {
        console.log(error);
        return dispatch({
          type: ActionKind.RETRIEVE_DATA,
          userData: initialUserData,
        });
      }
    };

    getInitialData();
  }, []);

  const signIn = useCallback((res: LoginRes) => {
    localStorage.setItem(StorageKind.userData, JSON.stringify(res));

    return dispatch({
      type: ActionKind.LOGIN,
      userData: res,
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(StorageKind.userData);

    return dispatch({
      type: ActionKind.LOGOUT,
    });
  }, []);

  const setUpdateProfile = useCallback(
    (data: User) => {
      const updateData: LoginRes = { ...state.userData, user: data };
      localStorage.setItem(StorageKind.userData, JSON.stringify(updateData));

      return dispatch({
        type: ActionKind.UPDATE_PROFILE,
        userData: updateData,
      });
    },
    [state.userData]
  );

  const handleRefreshToken = useCallback(async () => {
    try {
      const dataRefresh = {
        refresh_token: state.userData.token.refresh_token,
      };
      const response = await refreshToken(dataRefresh);

      if (response.status === 201) {
        toast({
          status: "info",
          title: "Refresh",
          description: "Please try again",
        });
      }
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast);
    }
  }, [toast, state.userData]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        setUpdateProfile,
        handleRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

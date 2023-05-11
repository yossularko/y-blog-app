import { LoginRes } from "@/types";
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
    };

interface State {
  isLoading: boolean;
  userData: LoginRes;
  signIn: (res: LoginRes) => void;
  signOut: () => void;
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
    default:
      return {
        ...prevState,
        isLoading: false,
      };
  }
};

const AuthProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

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

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

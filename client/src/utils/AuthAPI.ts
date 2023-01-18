import { createContext, Dispatch, SetStateAction } from "react";

export interface AuthAPIContextType {
  session: {
    cookie?: unknown;
    authenticated: boolean;
    currentUserId: string;
    currentUserName: string;
    role: string;
    msg: string;
  };
  setSession: Dispatch<
    SetStateAction<{
      cookie?: unknown;
      authenticated: boolean;
      currentUserId: string;
      currentUserName: string;
      role: string;
      msg: string;
    }>
  >;
}

const AuthAPI = createContext<AuthAPIContextType>({} as AuthAPIContextType);

export default AuthAPI;

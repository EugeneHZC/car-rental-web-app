import { createContext, Dispatch, ReactNode, useEffect, useState } from "react";
import { User } from "../types";

type AuthAction = {
  type: "LOGIN" | "LOGOUT";
  payload: User | null;
};

type AuthContextType = {
  user: User | null;
  dispatch: Dispatch<AuthAction>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  function dispatch(action: AuthAction) {
    switch (action.type) {
      case "LOGIN":
        setUser(action.payload);
        break;
      case "LOGOUT":
        setUser(null);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);

    if (userData) {
      const user = JSON.parse(userData);

      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return <AuthContext.Provider value={{ user, dispatch }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

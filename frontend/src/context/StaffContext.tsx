import { createContext, ReactNode, useEffect, useState } from "react";
import { Staff } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import { getStaffByUserId } from "../api/staff";

type Action = {
  payload: Staff | null;
};

type StaffContextType = {
  staff: Staff | null;
  dispatch: React.Dispatch<Action>;
};

export const StaffContext = createContext<StaffContextType | null>(null);

const StaffContextProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<Staff | null>(null);

  const { user } = useAuthContext();

  function dispatch(action: Action) {
    setStaff(action.payload);
  }

  async function getStaff() {
    if (!user) return;

    try {
      const { response, json } = await getStaffByUserId(user?.UserID);

      if (response.ok) {
        dispatch({ payload: json });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getStaff();
  }, [user]);

  return <StaffContext.Provider value={{ staff, dispatch }}>{children}</StaffContext.Provider>;
};

export default StaffContextProvider;

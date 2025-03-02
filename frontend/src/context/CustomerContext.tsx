import { createContext, Dispatch, ReactNode, useEffect, useState } from "react";
import { Customer } from "../types";
import { useAuthContext } from "../hooks/useAuthContext";
import { getCustomerByUserId } from "../api/customer";

type CustomerAction = {
  payload: Customer | null;
};

type CustomerContextType = {
  customer: Customer | null;
  dispatch: Dispatch<CustomerAction>;
};

export const CustomerContext = createContext<CustomerContextType | null>(null);

const CustomerContextProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const { user } = useAuthContext();

  function dispatch(action: CustomerAction) {
    setCustomer(action.payload);
  }

  async function getCustomer() {
    if (!user) return;

    try {
      const { response, json } = await getCustomerByUserId(user.id);

      if (response.ok) {
        setCustomer(json);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCustomer();
  }, [user]);

  return <CustomerContext.Provider value={{ customer, dispatch }}>{children}</CustomerContext.Provider>;
};

export default CustomerContextProvider;

import { useContext } from "react";
import { CustomerContext } from "../context/CustomerContext";

export function useCustomerContext() {
  const context = useContext(CustomerContext);

  if (!context) throw Error("useCustomerContext must be used in context provider.");

  return context;
}

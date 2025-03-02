import { useContext } from "react";
import { StaffContext } from "../context/StaffContext";

export function useStaffContext() {
  const context = useContext(StaffContext);

  if (!context) throw Error("useStaffContext must be used in a context provider.");

  return context;
}

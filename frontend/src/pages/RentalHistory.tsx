import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const RentalHistory = () => {
  const { user } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  return <div>RentalHistory</div>;
};

export default RentalHistory;

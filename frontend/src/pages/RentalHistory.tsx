import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Rental } from "../types";
import { getAllRentals } from "../api/rental";
import RentalDisplayCard from "../components/display-cards/RentalDisplayCard";

const RentalHistory = () => {
  const { user } = useAuthContext();

  const [rentals, setRentals] = useState<Rental[]>([]);

  const navigate = useNavigate();

  async function fetchData() {
    const { response, json } = await getAllRentals();

    if (response.ok) setRentals(json);
  }

  useEffect(() => {
    if (!user) navigate("/login");

    fetchData();
  }, []);

  return (
    <div className="cards">
      {rentals.map((rental) => (
        <RentalDisplayCard rental={rental} />
      ))}
    </div>
  );
};

export default RentalHistory;

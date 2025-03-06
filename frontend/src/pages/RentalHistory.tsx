import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Rental } from "../types";
import { getAllRentals } from "../api/rental";
import RentalDisplayCard from "../components/display-cards/RentalDisplayCard";
import { useStaffContext } from "../hooks/useStaffContext";

const RentalHistory = () => {
  const { user } = useAuthContext();
  const { staff } = useStaffContext();

  const [rentals, setRentals] = useState<Rental[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  async function fetchData() {
    const { response, json } = await getAllRentals();

    if (response.ok) {
      setRentals(json);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!user) navigate("/login");

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <p className="loading-message">Loading...</p>
      ) : rentals.length === 0 ? (
        <p className="loading-message">No rentals made yet...</p>
      ) : (
        <div className="cards">
          {rentals.map((rental) => (
            <RentalDisplayCard key={rental.RentalID} rental={rental} staffBranchNo={staff?.BranchNo ?? ""} />
          ))}
        </div>
      )}
    </>
  );
};

export default RentalHistory;

import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Car, Rental } from "../types";
import { getRentalsByBranchNo, getRentalsByNRIC } from "../api/rental";
import RentalDisplayCard from "../components/display-cards/RentalDisplayCard";
import { useStaffContext } from "../hooks/useStaffContext";
import { getAllCars } from "../api/car";
import { useCustomerContext } from "../hooks/useCustomerContext";

const RentalHistory = () => {
  const { user } = useAuthContext();
  const { staff } = useStaffContext();
  const { customer } = useCustomerContext();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  async function fetchRentalData() {
    setIsLoading(true);

    if (user?.Role === "Customer") {
      if (!customer) return setIsLoading(false);

      const { response, json } = await getRentalsByNRIC(customer.NRIC);

      if (response.ok && json.length) setRentals(json);
      else setRentals([]);
    } else {
      if (!staff) return;

      const { response, json } = await getRentalsByBranchNo(staff.BranchNo);

      if (response.ok && json.length) setRentals(json);
      else setRentals([]);
    }

    setIsLoading(false);
  }

  async function fetchCarData() {
    try {
      const { json: carData } = await getAllCars();

      if (carData) {
        setCars(carData);
      } else {
        setCars([]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!user) navigate("/login");

    fetchRentalData();
    fetchCarData();
  }, []);

  return (
    <>
      {isLoading ? (
        <p className="loading-message">Loading...</p>
      ) : rentals.length === 0 ? (
        <p className="loading-message">No rentals made yet...</p>
      ) : (
        <div className="cards">
          {rentals.map((rental) => {
            const car = cars.find((car) => car.CarPlateNo === rental.CarPlateNo);

            return (
              car && (
                <RentalDisplayCard
                  key={rental.RentalID}
                  rental={rental}
                  car={car}
                  staffBranchNo={car.BranchNo}
                  fetchCallback={fetchRentalData}
                />
              )
            );
          })}
        </div>
      )}
    </>
  );
};

export default RentalHistory;

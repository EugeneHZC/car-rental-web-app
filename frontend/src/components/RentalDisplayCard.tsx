import { useEffect, useState } from "react";
import { Branch, Car, Rental } from "../types";
import "../pages/profile/profile.css";
import { useNavigate } from "react-router-dom";
import { getCarByCarPlate } from "../api/car";
import { getBranchByBranchNo } from "../api/branch";
import { useAuthContext } from "../hooks/useAuthContext";

const RentalDisplayCard = ({ rental }: { rental: Rental }) => {
  const [car, setCar] = useState<Car>();
  const [branch, setBranch] = useState<Branch>();

  const { user } = useAuthContext();

  const formattedRentalDate = new Date(
    new Date(rental.RentalDate).getTime() - new Date(rental.RentalDate).getTimezoneOffset() * (60 * 1000)
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);

  const formattedPickUpTime = new Date(
    new Date(rental.PickUpTime).getTime() - new Date(rental.PickUpTime).getTimezoneOffset() * (60 * 1000)
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);

  const formattedDropOffTime = new Date(
    new Date(rental.DropOffTime).getTime() - new Date(rental.DropOffTime).getTimezoneOffset() * (60 * 1000)
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);

  const navigate = useNavigate();

  function handleClick() {
    navigate("/payment", {
      state: {
        car,
        branch,
        pickUpTime: formattedPickUpTime,
        dropOffTime: formattedDropOffTime,
        totalPrice: rental.TotalPrice,
        rentalId: rental.RentalID,
      },
    });
  }

  async function fetchCarData() {
    try {
      const { json: carData } = await getCarByCarPlate(rental.CarPlateNo);

      if (carData) {
        setCar(carData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchBranchData() {
    if (!car) return;

    try {
      const { json: branchData } = await getBranchByBranchNo(car.BranchNo);

      if (branchData) {
        setBranch(branchData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchCarData();
  }, []);

  useEffect(() => {
    fetchBranchData();
  }, [car]);

  return (
    <div className="card-container">
      <div className="car-infos">
        <h3 className="car-model">{car?.Model}</h3>
        <div className="car-info">
          <p className="car-info-title">Car Plate: </p>
          <p className="car-info-content">{car?.CarPlateNo}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Colour: </p>
          <p className="car-info-content">{car?.Colour}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Price Per Day:</p>
          <p className="car-info-content">RM {car?.PricePerDay}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Branch Address: </p>
          <p className="car-info-content">{branch?.Address}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Rental Date: </p>
          <p className="car-info-content">{formattedRentalDate}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Pick Up Time: </p>
          <p className="car-info-content">{formattedPickUpTime}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Drop Off Time: </p>
          <p className="car-info-content">{formattedDropOffTime}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Total Price:</p>
          <p className="car-info-content">RM {rental.TotalPrice}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Payment Status: </p>
          <p className="car-info-content">{rental.PaymentStatus}</p>
        </div>
      </div>

      {rental.PaymentStatus === "Not Paid" && user?.role === "Customer" && (
        <button className="btn-normal" type="button" onClick={handleClick}>
          Pay
        </button>
      )}
    </div>
  );
};

export default RentalDisplayCard;

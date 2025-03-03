import { useEffect, useState } from "react";
import { Branch, Car, Customer, Rental } from "../../types";
import { useNavigate } from "react-router-dom";
import { getCarByCarPlate } from "../../api/car";
import { getBranchByBranchNo } from "../../api/branch";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./display-card.css";
import { getCustomerByNRIC } from "../../api/customer";

const RentalDisplayCard = ({ rental }: { rental: Rental }) => {
  const [car, setCar] = useState<Car>();
  const [branch, setBranch] = useState<Branch>();
  const [rentalCustomer, setRentalCustomer] = useState<Customer | null>(null);

  const { user } = useAuthContext();

  const navigate = useNavigate();

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

  async function fetchCustomerData() {
    try {
      const { json: customerData } = await getCustomerByNRIC(rental.NRIC);

      if (customerData) {
        setRentalCustomer(customerData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchCarData();
    fetchCustomerData();
  }, []);

  useEffect(() => {
    fetchBranchData();
  }, [car]);

  return (
    <div className="card-container">
      <div className="rental-infos">
        <h3 className="car-model">{car?.Model}</h3>
        <div className="rental-info">
          <p className="rental-info-title">Car Plate: </p>
          <p className="rental-info-content">{car?.CarPlateNo}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Colour: </p>
          <p className="rental-info-content">{car?.Colour}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Price Per Day:</p>
          <p className="rental-info-content">RM {car?.PricePerDay}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Branch Address: </p>
          <p className="rental-info-content">{branch?.Address}</p>
        </div>
        {user?.role === "Staff" && (
          <>
            <div className="rental-info">
              <p className="rental-info-title">Customer's Name: </p>
              <p className="rental-info-content">{rentalCustomer?.Name}</p>
            </div>
            <div className="rental-info">
              <p className="rental-info-title">Customer's NRIC: </p>
              <p className="rental-info-content">{rentalCustomer?.NRIC}</p>
            </div>
          </>
        )}
        <div className="rental-info">
          <p className="rental-info-title">Rental Date: </p>
          <p className="rental-info-content">{formattedRentalDate}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Pick Up Time: </p>
          <p className="rental-info-content">{formattedPickUpTime}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Drop Off Time: </p>
          <p className="rental-info-content">{formattedDropOffTime}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Total Price:</p>
          <p className="rental-info-content">RM {rental.TotalPrice}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Payment Status: </p>
          <p className="rental-info-content">{rental.PaymentStatus}</p>
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

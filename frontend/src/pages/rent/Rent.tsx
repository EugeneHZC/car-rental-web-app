import { useLocation, useNavigate } from "react-router-dom";
import { Branch, Car, Rental } from "../../types";
import { useEffect, useState } from "react";
import "./rent.css";
import { getRentalsByCarPlate } from "../../api/rental";
import { useCustomerContext } from "../../hooks/useCustomerContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const Rent = () => {
  const [pickUpTime, setPickUpTime] = useState<Date>(new Date());
  const [dropOffTime, setDropOffTime] = useState<Date>(new Date());

  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { car, branch }: { car: Car; branch: Branch } = location.state;
  const { customer } = useCustomerContext();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // if user is not registered as customer, cannot make rent
    if (!customer)
      return alert("You must register as a customer first in order to rent a car. Go to profile page to do so.");

    // check if datetime is valid, meaning drop off time will always be later than pick up date
    if (pickUpTime.getTime() > dropOffTime.getTime()) return alert("Drop off date must be later than pick up date.");

    const { json } = await getRentalsByCarPlate(car.CarPlateNo);

    // check if pick up time and drop off time crashes with other rentals
    for (let i = 0; i < json.length; i++) {
      const currentCarRental: Rental = json[i];

      const currentRentalPickUpTime = new Date(currentCarRental.PickUpTime);
      const currentRentalDropOffTime = new Date(currentCarRental.DropOffTime);

      if (
        (currentRentalPickUpTime.getTime() <= pickUpTime.getTime() &&
          pickUpTime.getTime() <= currentRentalDropOffTime.getTime()) ||
        (currentRentalPickUpTime.getTime() <= dropOffTime.getTime() &&
          dropOffTime.getTime() <= currentRentalDropOffTime.getTime()) ||
        (pickUpTime.getTime() <= currentRentalPickUpTime.getTime() &&
          currentRentalPickUpTime.getTime() <= dropOffTime.getTime() &&
          pickUpTime.getTime() <= currentRentalDropOffTime.getTime() &&
          currentRentalDropOffTime.getTime() <= dropOffTime.getTime())
      ) {
        return alert("Oops! There is a crash in time for this car.");
      }
    }

    const differenceInDays = Math.round((dropOffTime.getTime() - pickUpTime.getTime()) / (1000 * 60 * 60 * 24));

    // check if their difference is at least one day for price calculation
    if (differenceInDays < 1) return alert("Drop off time must be at least one day difference from pick up time.");

    const totalPrice = car.PricePerDay * differenceInDays;

    navigate("/payment", {
      state: {
        car,
        branch,
        pickUpTime: new Date(pickUpTime.getTime() - pickUpTime.getTimezoneOffset() * (60 * 1000))
          .toISOString()
          .slice(0, 16)
          .replace("T", " "),
        dropOffTime: new Date(dropOffTime.getTime() - pickUpTime.getTimezoneOffset() * (60 * 1000))
          .toISOString()
          .slice(0, 16)
          .replace("T", " "),
        totalPrice,
      },
    });
  }

  useEffect(() => {
    if (!user) navigate("/login"); // check if user is logged in
  }, [user]);

  return (
    <form className="rent-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Rent</legend>
        <div className="car-details-container">
          <div className="car-infos">
            <h3 className="car-model">{car.Model}</h3>
            <div className="car-info">
              <p>Car Plate: </p>
              <p>{car.CarPlateNo}</p>
            </div>
            <div className="car-info">
              <p>Colour: </p>
              <p>{car.Colour}</p>
            </div>
            <div className="car-info">
              <p>Price Per Day:</p>
              <p>RM {car.PricePerDay}</p>
            </div>
            <div className="car-info">
              <p>Branch: </p>
              <p>{branch.Address}</p>
            </div>
          </div>

          <div className="form-container">
            <div className="input-section">
              <label htmlFor="start-date">Pick Up Time</label>
              <input
                type="datetime-local"
                name="start-date"
                required
                value={new Date(pickUpTime.getTime() - pickUpTime.getTimezoneOffset() * (60 * 1000))
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) => {
                  const dateValue = new Date(e.target.value);
                  if (!isNaN(dateValue.getTime())) setPickUpTime(new Date(e.target.value));
                }}
              />
            </div>
            <div className="input-section">
              <label htmlFor="end-date">Drop Off Time</label>
              <input
                type="datetime-local"
                name="end-date"
                required
                value={new Date(dropOffTime.getTime() - dropOffTime.getTimezoneOffset() * (60 * 1000))
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) => {
                  const dateValue = new Date(e.target.value);
                  if (!isNaN(dateValue.getTime())) setDropOffTime(new Date(e.target.value));
                }}
              />
            </div>
          </div>

          <button className="btn-normal" type="submit">
            Rent
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default Rent;

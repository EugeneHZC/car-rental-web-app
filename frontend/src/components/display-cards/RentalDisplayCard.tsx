import { useEffect, useState } from "react";
import { Branch, Car, Customer, Payment, Rental, User } from "../../types";
import { useNavigate } from "react-router-dom";
import { getCarByCarPlate } from "../../api/car";
import { getBranchByBranchNo } from "../../api/branch";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./display-card.css";
import { getCustomerByNRIC } from "../../api/customer";
import { getPaymentByRentalId } from "../../api/payment";
import ConfirmationModal from "../modal/ConfirmationModal";
import { deleteRentalById } from "../../api/rental";
import { getUserByUserId } from "../../api/auth";
import { sendEmail } from "../../api/email";

const RentalDisplayCard = ({
  rental,
  staffBranchNo,
  fetchCallback,
}: {
  rental: Rental;
  staffBranchNo: string | null;
  fetchCallback: () => {};
}) => {
  const [car, setCar] = useState<Car | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [rentalCustomer, setRentalCustomer] = useState<Customer | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [openedModal, setOpenedModal] = useState("");

  const { user } = useAuthContext();

  const navigate = useNavigate();

  if (staffBranchNo && car && car.BranchNo !== staffBranchNo) return null;

  const formattedRentalDate = new Date(
    new Date(rental.RentalDate).getTime() - new Date(rental.RentalDate).getTimezoneOffset() * 60000
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);

  const formattedPickUpTime = new Date(
    new Date(rental.PickUpTime).getTime() - new Date(rental.PickUpTime).getTimezoneOffset() * 60000
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);

  const formattedDropOffTime = new Date(
    new Date(rental.DropOffTime).getTime() - new Date(rental.DropOffTime).getTimezoneOffset() * 60000
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);

  const formattedPaymentDate =
    payment?.PaymentDate == null
      ? ""
      : new Date(new Date(payment.PaymentDate).getTime() - new Date(payment.PaymentDate).getTimezoneOffset() * 60000)
          .toISOString()
          .replace("T", " ")
          .slice(0, 19);

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

  async function fetchPaymentData() {
    try {
      const { response, json } = await getPaymentByRentalId(rental.RentalID);

      if (response.ok && json) {
        setPayment(json);
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

  async function fetchUserData() {
    const { response, json } = await getUserByUserId(rentalCustomer?.UserID ?? 0);

    if (response.ok) setCustomerUser(json);
  }

  async function removeRent() {
    try {
      // remove rental from database
      const { response: rentalResponse } = await deleteRentalById(rental.RentalID);

      if (!rentalResponse.ok) return alert("Oops! Something went wrong.");
      alert("Rental removed successfully!");

      if (user?.Role !== "Staff") return fetchCallback();

      await fetchUserData();
    } catch (e) {
      console.log(e);
    }
  }

  function handleCancelRentClicked() {
    setOpenedModal("cancel-rent");
  }

  useEffect(() => {
    fetchCarData();
    fetchCustomerData();
    fetchPaymentData();
  }, []);

  useEffect(() => {
    fetchBranchData();
  }, [car]);

  useEffect(() => {
    if (customerUser) {
      sendEmail(
        customerUser?.Name ?? "",
        customerUser?.Email ?? "",
        user?.Name ?? "",
        user?.Email ?? "",
        rental.RentalDate.replace("T", " ").slice(0, 19)
      );

      fetchCallback();
    }
  }, [customerUser]);

  return (
    <div className="card-container">
      {openedModal === "cancel-rent" && (
        <ConfirmationModal
          setOpenedModal={setOpenedModal}
          content="Are you sure you want to cancel this rent?"
          handleCallback={removeRent}
          dangerButtonText="Cancel"
        />
      )}

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

        <div className="break-line" />

        {user?.Role === "Staff" && (
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

        {user?.Role === "Staff" && <div className="break-line" />}

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

        <div className="break-line" />

        <div className="rental-info">
          <p className="rental-info-title">Total Price:</p>
          <p className="rental-info-content">RM {rental.TotalPrice}</p>
        </div>
        <div className="rental-info">
          <p className="rental-info-title">Payment Status: </p>
          <p className="rental-info-content">{rental.PaymentStatus}</p>
        </div>
        {formattedPaymentDate && (
          <div className="rental-info">
            <p className="rental-info-title">Payment Date: </p>
            <p className="rental-info-content">{formattedPaymentDate}</p>
          </div>
        )}
      </div>

      {rental.PaymentStatus === "Not Paid" && user?.Role === "Customer" ? (
        <div className="buttons">
          <button className="btn-normal" type="button" onClick={handleClick}>
            Pay
          </button>
          <button className="btn-danger" type="button" onClick={handleCancelRentClicked}>
            Cancel Rent
          </button>
        </div>
      ) : (
        <button className="btn-danger" type="button" onClick={handleCancelRentClicked}>
          Cancel Rent
        </button>
      )}
    </div>
  );
};

export default RentalDisplayCard;

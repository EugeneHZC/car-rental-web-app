import { useLocation, useNavigate } from "react-router-dom";
import { useCustomerContext } from "../hooks/useCustomerContext";
import { useEffect, useState } from "react";
import { createRental, getRentalByNRICAndCarPlate, updateRentalPaymentStatus } from "../api/rental";
import { createPayment, getPaymentByRentalId, updatePayment } from "../api/payment";
import { useAuthContext } from "../hooks/useAuthContext";

const Payment = () => {
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("default");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { car, branch, pickUpTime, dropOffTime, totalPrice, rentalId } = location.state;
  const { customer } = useCustomerContext();
  const { user } = useAuthContext();

  const currentTime = new Date();

  const currentTimeFormatted = new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  async function handleMakeRentAndPayment(
    paymentTime: string | null,
    paymentStatus: "Paid" | "Not Paid",
    paymentMethod: string,
    amountPaid: number
  ) {
    if (!customer) return;

    try {
      const { response: rentalResponse } = await createRental({
        RentalID: 0,
        RentalDate: currentTimeFormatted,
        PickUpTime: pickUpTime,
        DropOffTime: dropOffTime,
        TotalPrice: totalPrice,
        PaymentStatus: paymentStatus,
        CarPlateNo: car.CarPlateNo,
        NRIC: customer.NRIC,
      });

      const { json } = await getRentalByNRICAndCarPlate(customer.NRIC, car.CarPlateNo);

      const { response: paymentResponse } = await createPayment(
        paymentTime,
        paymentMethod,
        amountPaid,
        json[0].RentalID
      );

      if (rentalResponse.ok && paymentResponse.ok) {
        navigate("/");
      }

      setIsButtonClicked(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsButtonClicked(true);

    if (!customer) {
      return setIsButtonClicked(false);
    }

    if (amountPaid < totalPrice) {
      setIsButtonClicked(false);
      return alert(`Amount is not enough. Total price is RM ${totalPrice}`);
    }

    if (paymentMethod === "default") {
      setIsButtonClicked(false);
      return alert("Please choose a payment method.");
    }

    try {
      if (rentalId) {
        const { json: existingPayment } = await getPaymentByRentalId(rentalId);

        if (existingPayment) {
          const { response: paymentResponse } = await updatePayment(
            existingPayment.PaymentID,
            currentTimeFormatted,
            paymentMethod,
            amountPaid
          );

          const { response: rentalResponse } = await updateRentalPaymentStatus(rentalId, "Paid");

          if (paymentResponse.ok && rentalResponse.ok) {
            alert("Payment successful!");
            setIsButtonClicked(false);
            return navigate("/profile");
          }
        }
      }

      handleMakeRentAndPayment(currentTimeFormatted, "Paid", paymentMethod, amountPaid);
    } catch (e) {
      console.log(e);
    }
  }

  async function handlePayLaterClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    setIsButtonClicked(true);

    if (rentalId) {
      const { json: existingPayment } = await getPaymentByRentalId(rentalId);

      if (existingPayment.length !== 0) {
        setIsButtonClicked(false);
        return navigate("/profile");
      }
    }

    handleMakeRentAndPayment("", "Not Paid", "", 0);
    setIsButtonClicked(false);
  }

  useEffect(() => {
    if (!user) navigate("/login");
    if (!customer) navigate("/");
  }, [user, customer]);

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Payment</legend>

        <div className="payment-container">
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
                <p>Price Per Day: RM </p>
                <p>{car.PricePerDay}</p>
              </div>
              <div className="car-info">
                <p>Branch: </p>
                <p>{branch.Address}</p>
              </div>
              <div className="car-info">
                <p>Pick Up Time: </p>
                <p>{pickUpTime}</p>
              </div>
              <div className="car-info">
                <p>Drop Off Time: </p>
                <p>{dropOffTime}</p>
              </div>
              <div className="car-info">
                <p>Total Price: RM </p>
                <p>{totalPrice}</p>
              </div>
            </div>

            <div className="form-container">
              <div className="input-section">
                <label htmlFor="amount">Payment Amount</label>
                <input
                  type="number"
                  name="amount"
                  required
                  value={amountPaid}
                  onChange={(e) => {
                    const amountValue = parseFloat(e.target.value);

                    if (!isNaN(amountValue)) {
                      setAmountPaid(amountValue);
                    }
                  }}
                />
              </div>
              <div className="input-section">
                <label htmlFor="payment-method">Payment Method</label>
                <select
                  name="payment-method"
                  id="payment-method-dropdown"
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="default" disabled>
                    --Choose a payment method--
                  </option>
                  <option value="Visa Credit">Visa Credit</option>
                  <option value="Visa Debit">Visa Debit</option>
                </select>
              </div>

              <div className="buttons">
                <button
                  className={isButtonClicked ? "btn-disabled" : "btn-normal"}
                  disabled={isButtonClicked}
                  type="submit"
                >
                  {isButtonClicked ? "Processing..." : "Pay"}
                </button>
                <button
                  className={isButtonClicked ? "btn-disabled" : "btn-gray"}
                  disabled={isButtonClicked}
                  type="button"
                  onClick={handlePayLaterClicked}
                >
                  Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default Payment;

import { useState } from "react";
import { Branch, Car } from "../../types";
import { updateCar } from "../../api/car";
import "./modal.css";

const EditCarModal = ({
  setOpenedModal,
  car,
  currentCarBranch,
  fetchCarCallback,
  fetchBranchCallback,
  branches,
}: {
  setOpenedModal: React.Dispatch<string>;
  car: Car;
  currentCarBranch: string;
  fetchCarCallback: () => {};
  fetchBranchCallback: () => {};
  branches: Branch[];
}) => {
  const [colour, setColour] = useState(car.Colour);
  const [status, setStatus] = useState(car.Status);
  const [pricePerDay, setPricePerDay] = useState(car.PricePerDay);
  const [branchAddress, setBranchAddress] = useState(currentCarBranch);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function closeModal() {
    setOpenedModal("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsButtonClicked(true);

    const updatedCar: Car = {
      CarPlateNo: car.CarPlateNo,
      Model: car.Model,
      Colour: colour,
      PricePerDay: pricePerDay,
      Status: status,
      BranchNo: branches.find((branch) => branch.Address === branchAddress)?.BranchNo ?? "",
    };

    const { response } = await updateCar(updatedCar);

    if (response.ok) {
      alert("Car updated!");
      fetchCarCallback();
      fetchBranchCallback(); // to fetch the branch for the updated car so that the branch address will change
      closeModal();
    } else {
      alert("Oops! Something went wrong.");
    }

    setIsButtonClicked(false);
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-container">
            <h2>Edit Car's Rental Info</h2>

            <div className="input-section">
              <label htmlFor="car-plate">Car Plate</label>
              <input type="text" name="car-plate" disabled value={car.CarPlateNo} />
            </div>

            <div className="input-section">
              <label htmlFor="model">Model</label>
              <input type="text" name="model" disabled value={car.Model} />
            </div>

            <div className="input-section">
              <label htmlFor="colour">Colour</label>
              <input type="text" name="colour" value={colour} onChange={(e) => setColour(e.target.value)} />
            </div>

            <div className="input-section">
              <label htmlFor="status">Status</label>
              <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Good">Good</option>
                <option value="Under Service">Under Service</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>

            <div className="input-section">
              <label htmlFor="price-per-day">Price Per Day</label>
              <input
                type="number"
                name="price-per-day"
                value={pricePerDay}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);

                  if (!isNaN(value)) setPricePerDay(value);
                }}
              />
            </div>

            <div className="input-section">
              <label htmlFor="branch">Branch</label>
              <select name="branch" value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)}>
                {branches.map((branch) => (
                  <option key={branch.BranchNo} value={branch.Address}>
                    {branch.Address}
                  </option>
                ))}
              </select>
            </div>

            <div className="buttons">
              <button
                className={isButtonClicked ? "btn-disabled" : "btn-normal"}
                disabled={isButtonClicked}
                type="submit"
              >
                {isButtonClicked ? "Saving changes..." : "Save"}
              </button>
              <button
                className={isButtonClicked ? "btn-disabled" : "btn-gray"}
                disabled={isButtonClicked}
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarModal;

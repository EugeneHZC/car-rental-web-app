import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { addCar } from "../api/car";
import { Branch, Car } from "../types";
import { getAllBranches } from "../api/branch";

const AddCar = () => {
  const [carPlateNo, setCarPlateNo] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [status, setStatus] = useState("default");
  const [branchNo, setBranchNo] = useState("default");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([]);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (branchNo === "default") return alert("Please select a branch.");

    if (status === "default") return alert("Please select the status of the car.");

    setIsButtonClicked(true);

    const newCar: Car = {
      CarPlateNo: carPlateNo,
      Model: model,
      Colour: colour,
      Status: status,
      PricePerDay: pricePerDay,
      BranchNo: branchNo,
    };

    const { response } = await addCar(newCar);

    if (response.ok) {
      alert("Car added!");

      setCarPlateNo("");
      setModel("");
      setColour("");
      setPricePerDay(0);

      navigate("/");
    } else {
      alert("Oops! Something went wrong.");
    }

    setIsButtonClicked(false);
  }

  async function fetchData() {
    const { response, json } = await getAllBranches();

    if (response.ok && json.length) {
      setBranches(json);
    }
  }

  useEffect(() => {
    if (!user || user?.Role !== "Staff") navigate("/");

    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Add Car</legend>

        <div className="form-container">
          <div className="input-section">
            <label htmlFor="car-model">Car Model</label>
            <input type="text" required name="car-model" value={model} onChange={(e) => setModel(e.target.value)} />
          </div>

          <div className="input-section">
            <label htmlFor="car-plate">Car Plate</label>
            <input
              type="text"
              required
              name="car-plate"
              value={carPlateNo}
              onChange={(e) => setCarPlateNo(e.target.value)}
            />
          </div>

          <div className="input-section">
            <label htmlFor="car-colour">Car Colour</label>
            <input type="text" required name="car-colour" value={colour} onChange={(e) => setColour(e.target.value)} />
          </div>

          <div className="input-section">
            <label htmlFor="price-per-day">Price Per Day</label>
            <input
              type="number"
              required
              name="price-per-day"
              value={pricePerDay}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (!isNaN(value)) setPricePerDay(value);
              }}
            />
          </div>

          <div className="input-section">
            <label htmlFor="car-status">Car Status</label>
            <select name="car-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="default" disabled>
                --Select a status--
              </option>
              <option value="Good">Good</option>
              <option value="Under Service">Under Service</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="input-section">
            <label htmlFor="branch">Branch</label>
            <select name="branch" value={branchNo} onChange={(e) => setBranchNo(e.target.value)}>
              <option value="default" disabled>
                --Select a branch--
              </option>
              {branches.map((branch) => (
                <option key={branch.BranchNo} value={branch.BranchNo}>
                  {branch.Address}
                </option>
              ))}
            </select>
          </div>

          <button className={isButtonClicked ? "btn-disabled" : "btn-normal"} disabled={isButtonClicked} type="submit">
            {isButtonClicked ? "Adding..." : "Add"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default AddCar;

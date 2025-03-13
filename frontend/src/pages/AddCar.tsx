import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { addCar, uploadCarImage } from "../api/car";
import { Branch, Car } from "../types";
import { getAllBranches } from "../api/branch";

const AddCar = () => {
  const [carPlateNo, setCarPlateNo] = useState("");
  const [model, setModel] = useState("");
  const [colour, setColour] = useState("");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [status, setStatus] = useState("default");
  const [carImage, setCarImage] = useState<File | null>(null);
  const [branchNo, setBranchNo] = useState("default");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([]);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (branchNo === "default") return alert("Please select a branch.");

    if (status === "default") return alert("Please select the status of the car.");

    if (!carImage) return alert("Please upload an image of the car.");

    setIsButtonClicked(true);

    const formData = new FormData();
    formData.append("car-image", carImage);

    const newCar: Car = {
      CarPlateNo: carPlateNo,
      Model: model,
      Colour: colour,
      Status: status,
      PricePerDay: pricePerDay,
      Image: "",
      BranchNo: branchNo,
    };

    const { response: carResponse } = await addCar(newCar);
    const { response: imageResponse } = await uploadCarImage(carPlateNo, formData);

    if (carResponse.ok && imageResponse.ok) {
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

  function handleUploadImage(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    setCarImage(target.files[0]);
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
            <label htmlFor="car-image">Car Image</label>
            <input type="file" required name="car-image" onChange={handleUploadImage} />
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

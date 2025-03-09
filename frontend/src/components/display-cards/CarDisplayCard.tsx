import { useEffect, useState } from "react";
import { Branch, Car } from "../../types";
import { useNavigate } from "react-router-dom";
import { getBranchByBranchNo } from "../../api/branch";
import { useAuthContext } from "../../hooks/useAuthContext";
import ConfirmationModal from "../modal/ConfirmationModal";
import EditCarModal from "../modal/EditCarModal";
import "./display-card.css";
import { removeCar } from "../../api/car";

const CarDisplayCard = ({
  car,
  fetchCarCallback,
  branches,
}: {
  car: Car;
  fetchCarCallback: () => {};
  branches: Branch[];
}) => {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [openedModal, setOpenedModal] = useState<string>("");

  const { user } = useAuthContext();

  const navigate = useNavigate();

  function handleRemoveClicked() {
    setOpenedModal("confirmation-modal");
  }

  function handleEditClicked() {
    setOpenedModal("edit-car-modal");
  }

  async function handleRemoveCar() {
    const { response, json } = await removeCar(car.CarPlateNo);

    if (response.ok) {
      alert(json);
      fetchCarCallback();
    } else {
      alert("Oops! Something went wrong.");
    }
  }

  async function fetchData() {
    try {
      const { json } = await getBranchByBranchNo(car.BranchNo);

      if (json) {
        setBranch(json);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleClick() {
    navigate("/rent", { state: { car, branch } });
  }

  useEffect(() => {
    fetchData();
  }, [car]);

  return (
    <div className="card-container">
      {openedModal === "confirmation-modal" && (
        <ConfirmationModal
          setOpenedModal={setOpenedModal}
          handleCallback={handleRemoveCar}
          content="Are you sure you want to remove this car?"
          dangerButtonText="Remove"
        />
      )}
      {openedModal === "edit-car-modal" && (
        <EditCarModal
          setOpenedModal={setOpenedModal}
          car={car}
          currentCarBranch={branch?.Address ?? ""}
          fetchCarCallback={fetchCarCallback}
          fetchBranchCallback={fetchData}
          branches={branches}
        />
      )}

      <div className="car-infos">
        <h3 className="car-model">{car.Model}</h3>
        <div className="car-info">
          <p className="car-info-title">Colour: </p>
          <p className="car-info-content">{car.Colour}</p>
        </div>
        <div className="car-info">
          <p className="car-info-title">Price Per Day:</p>
          <p className="car-info-content">RM {car.PricePerDay}</p>
        </div>
        {user?.Role === "Staff" && (
          <div className="car-info">
            <p className="car-info-title">Car Status:</p>
            <p className="car-info-content">{car.Status}</p>
          </div>
        )}
        <div className="car-info">
          <p className="car-info-title">Branch Address: </p>
          <p className="car-info-content">{branch?.Address}</p>
        </div>
      </div>

      {user?.Role === "Customer" ? (
        <button className="btn-normal" type="button" onClick={handleClick}>
          Rent
        </button>
      ) : (
        <div className="buttons">
          <button className="btn-normal" type="button" onClick={handleEditClicked}>
            Edit
          </button>
          <button className="btn-danger" type="button" onClick={handleRemoveClicked}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default CarDisplayCard;

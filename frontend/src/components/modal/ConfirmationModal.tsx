import { removeCar } from "../../car";
import "./modal.css";

const ConfirmationModal = ({
  setOpenedModal,
  carPlateNo,
  fetchCarCallback,
}: {
  setOpenedModal: React.Dispatch<string>;
  carPlateNo: string;
  fetchCarCallback: () => {};
}) => {
  function closeModal() {
    setOpenedModal("");
  }

  async function handleRemoveClicked() {
    const { response, json } = await removeCar(carPlateNo);

    if (response.ok) {
      alert(json);

      fetchCarCallback();
      closeModal();
    } else {
      alert("Oops! Something went wrong.");
    }
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Are you sure?</h2>
        <p>Are you sure you want to remove this car?</p>

        <div className="buttons">
          <button className="btn-danger" type="button" onClick={handleRemoveClicked}>
            Remove
          </button>
          <button className="btn-gray" type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

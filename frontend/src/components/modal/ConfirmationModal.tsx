import { useState } from "react";
import "./modal.css";

const ConfirmationModal = ({
  setOpenedModal,
  handleCallback,
  content,
  dangerButtonText,
}: {
  setOpenedModal: React.Dispatch<React.SetStateAction<string>>;
  handleCallback: () => {};
  content: string;
  dangerButtonText: string;
}) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function closeModal() {
    setOpenedModal("");
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Are you sure?</h2>
        <p>{content}</p>

        <div className="buttons">
          <button
            className={isButtonClicked ? "btn-disabled" : "btn-danger"}
            disabled={isButtonClicked}
            type="button"
            onClick={() => {
              setIsButtonClicked(true);
              handleCallback();
              closeModal();
              setIsButtonClicked(false);
            }}
          >
            {dangerButtonText}
          </button>
          <button
            className={isButtonClicked ? "btn-disabled" : "btn-gray"}
            disabled={isButtonClicked}
            type="button"
            onClick={closeModal}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

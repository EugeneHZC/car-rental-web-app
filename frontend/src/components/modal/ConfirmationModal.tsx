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
            className="btn-danger"
            type="button"
            onClick={() => {
              closeModal();
              handleCallback();
            }}
          >
            {dangerButtonText}
          </button>
          <button className="btn-gray" type="button" onClick={closeModal}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

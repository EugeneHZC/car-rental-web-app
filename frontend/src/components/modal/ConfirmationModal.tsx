import "./modal.css";

const ConfirmationModal = ({
  setOpenedModal,
  handleCallback,
  content,
}: {
  setOpenedModal: React.Dispatch<React.SetStateAction<string>>;
  handleCallback: () => {};
  content: string;
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
          <button className="btn-danger" type="button" onClick={handleCallback}>
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

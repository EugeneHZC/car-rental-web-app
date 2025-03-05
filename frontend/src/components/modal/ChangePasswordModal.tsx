import { useState } from "react";
import { updateUserPassword } from "../../auth";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./modal.css";

const ChangePasswordModal = ({
  setOpenedModal,
}: {
  setOpenedModal: React.Dispatch<"edit-profile" | "change-password" | "">;
}) => {
  const { user } = useAuthContext();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function closeModal() {
    setOpenedModal("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) return;

    const { response, json } = await updateUserPassword(oldPassword, newPassword, user.id);

    if (response.ok) {
      alert(json);
      closeModal();
    }
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-container">
            <h2>Change Password</h2>
            <div className="input-section">
              <label htmlFor="old-password">Old Password</label>
              <input
                type="password"
                name="old-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="input-section">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                name="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="buttons">
              <button className="btn-normal" type="submit">
                Save
              </button>

              <button className="btn-gray" type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

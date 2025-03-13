import { useState } from "react";
import { updateUserForgottenPassword, updateUserPassword } from "../../api/auth";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./modal.css";

const ChangePasswordModal = ({
  setOpenedModal,
  isLoggedIn,
  email,
}: {
  setOpenedModal: React.Dispatch<"edit-profile" | "change-password" | "">;
  isLoggedIn: boolean;
  email?: string;
}) => {
  const { user } = useAuthContext();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function closeModal() {
    setOpenedModal("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoggedIn && !user) return;

    if (newPassword !== confirmPassword) return alert("New password and confirm password must be the same.");

    setIsButtonClicked(true);

    const { response, json } = isLoggedIn
      ? await updateUserPassword(oldPassword, newPassword, user?.UserID ?? 0)
      : await updateUserForgottenPassword(email ?? "", newPassword);

    if (response.ok) {
      alert("Password changed!");
      closeModal();
    } else {
      alert(json);
    }

    setIsButtonClicked(false);
  }

  return (
    <div className="modal-container">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-container">
            <h2>Change Password</h2>
            {isLoggedIn && (
              <div className="input-section">
                <label htmlFor="old-password">Old Password</label>
                <input
                  type="password"
                  name="old-password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
            )}

            <div className="input-section">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                name="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="input-section">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                name="confirm-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="buttons">
              <button
                className={isButtonClicked ? "btn-disabled" : "btn-normal"}
                disabled={isButtonClicked}
                type="submit"
              >
                {isButtonClicked ? "Saving..." : "Save"}
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

export default ChangePasswordModal;

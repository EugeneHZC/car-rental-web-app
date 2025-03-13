import { useEffect, useState } from "react";
import { updateUserInfo } from "../../api/auth";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCustomerContext } from "../../hooks/useCustomerContext";
import { useStaffContext } from "../../hooks/useStaffContext";
import { Branch, Customer, Staff } from "../../types";
import { getAllBranches } from "../../api/branch";
import { updateCustomerInfo } from "../../api/customer";
import { updateStaffInfo } from "../../api/staff";
import "./modal.css";

const EditProfileModal = ({
  setOpenedModal,
  currentStaffBranch,
}: {
  setOpenedModal: React.Dispatch<"edit-profile" | "change-password" | "">;
  currentStaffBranch: string;
}) => {
  const { user, dispatch } = useAuthContext();
  const { customer, dispatch: customerDispatch } = useCustomerContext();
  const { staff, dispatch: staffDispatch } = useStaffContext();

  const [name, setName] = useState(user?.Name ?? "");
  const [email, setEmail] = useState(user?.Email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.Role === "Customer" ? customer?.PhoneNumber ?? "" : staff?.PhoneNumber ?? ""
  );
  // includes customer's address or staff's branch address
  const [address, setAddress] = useState(user?.Role === "Customer" ? customer?.Address ?? "" : currentStaffBranch);

  const [branches, setBranches] = useState<Branch[]>([]);

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  function closeModal() {
    setOpenedModal("");
  }

  async function fetchBranchData() {
    try {
      const { response, json } = await getAllBranches();

      if (response.ok) setBranches(json);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsButtonClicked(true);

    if (!user) return;
    if (!customer && !staff) return;

    if (user.Role === "Customer") {
      // create new customer object
      const updatedCustomer: Customer = {
        NRIC: customer?.NRIC ?? "",
        Name: name,
        Gender: customer?.Gender ?? "",
        PhoneNumber: phoneNumber,
        LicenseNumber: customer?.LicenseNumber ?? 0,
        Address: address,
        UserID: user.UserID,
      };

      // update customer info in database
      const { response } = await updateCustomerInfo(updatedCustomer);

      // update customer in context
      if (response.ok) customerDispatch({ payload: updatedCustomer });
    } else {
      // create new staff object
      const updatedStaff: Staff = {
        StaffID: staff?.StaffID ?? "",
        Name: name,
        Gender: staff?.Gender ?? "",
        PhoneNumber: phoneNumber,
        UserID: user.UserID,
        BranchNo: branches.find((branch) => branch.Address === address)?.BranchNo ?? "",
      };

      // update staff info in database
      const { response } = await updateStaffInfo(updatedStaff);

      // update staff in context
      if (response.ok) staffDispatch({ payload: updatedStaff });
    }

    // update user info in database
    const { response, json } = await updateUserInfo(name, email, user.UserID);

    if (response.ok) {
      alert(json);
      const updatedUser = { UserID: user.UserID, Name: name, Email: email, Role: user.Role };

      dispatch({ type: "LOGIN", payload: updatedUser });

      localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
      localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
      closeModal();
    }

    setIsButtonClicked(false);
  }

  useEffect(() => {
    fetchBranchData();
  }, []);

  return (
    <div className="modal-container">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-container">
            <h2>Edit Profile</h2>
            <div className="input-section">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="input-section">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-section">
              <label htmlFor="phone-number">Phone Number</label>
              <input
                type="text"
                name="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {user?.Role === "Customer" ? (
              <div className="input-section">
                <label htmlFor="address">Address</label>
                <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            ) : (
              <div className="input-section">
                <label htmlFor="branch-address">Address</label>
                <select name="branch-address" value={address} onChange={(e) => setAddress(e.target.value)}>
                  {branches.map((branch) => (
                    <option value={branch.Address} key={branch.BranchNo}>
                      {branch.Address}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

export default EditProfileModal;

import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useState } from "react";
import "./profile.css";
import RentalDisplayCard from "../../components/display-cards/RentalDisplayCard";
import { useCustomerContext } from "../../hooks/useCustomerContext";
import { Branch, Rental } from "../../types";
import { getAllRentals, getRentalsByNRIC } from "../../rental";
import EditProfileModal from "../../components/modal/EditProfileModal";
import ChangePasswordModal from "../../components/modal/ChangePasswordModal";
import { useStaffContext } from "../../hooks/useStaffContext";
import { getBranchByBranchNo } from "../../branch";

const SMALL_SCREEN_SIZE = 700;

const Profile = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [openedModal, setOpenedModal] = useState<"edit-profile" | "change-password" | "">("");
  // for staff only
  const [branch, setBranch] = useState<Branch | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < SMALL_SCREEN_SIZE);

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthContext();
  const { customer } = useCustomerContext();
  const { staff } = useStaffContext();

  const navigate = useNavigate();

  function handleResize() {
    setIsScreenSmall(window.innerWidth < SMALL_SCREEN_SIZE);
  }

  function handleRegisterCustomerClicked() {
    navigate("/register-customer");
  }

  function handleChangePasswordClicked() {
    setOpenedModal("change-password");
  }

  function handleEditProfileClicked() {
    setOpenedModal("edit-profile");
  }

  async function fetchData() {
    try {
      if (user?.role === "Customer") {
        // get rentals for customer based on nric
        if (!customer) return;

        const { json } = await getRentalsByNRIC(customer?.NRIC);
        if (json.length) setRentals(json);
      } else {
        // get branch address and all rentals for staff
        if (!staff) return;

        const { response, json: branchData } = await getBranchByBranchNo(staff?.BranchNo);
        if (response.ok && branchData) setBranch(branchData);

        const { json } = await getAllRentals();
        if (json.length) setRentals(json);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!user) navigate("/login");
    if (rentals.length === 0) setIsLoading(true);

    setRentals([]);
    fetchData();

    // generates the current time to filter out past rents made
    setCurrentTime(new Date());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [user, customer]);

  useEffect(() => {
    if (rentals.length) setIsLoading(false);
  }, [rentals]);

  return (
    <div className="profile-container">
      {openedModal === "edit-profile" && (
        <EditProfileModal setOpenedModal={setOpenedModal} currentStaffBranch={branch?.Address ?? ""} />
      )}
      {openedModal === "change-password" && <ChangePasswordModal setOpenedModal={setOpenedModal} />}

      <div className="profile-details">
        <div className="profile-header">
          <p className="name">{user?.name}</p>
          <p className="account-type">{user?.role} Account</p>
        </div>
        <div className="profile-content">
          <div className="profile-detail">
            <h4>Email</h4>
            <p>{user?.email}</p>
          </div>
          <div className="profile-detail">
            <h4>Phone Number</h4>
            <p>{user?.role === "Customer" ? customer?.PhoneNumber : staff?.PhoneNumber}</p>
          </div>
          {user?.role === "Customer" ? (
            <>
              <div className="profile-detail">
                <h4>NRIC</h4>
                <p>{customer?.NRIC}</p>
              </div>
              <div className="profile-detail">
                <h4>Address</h4>
                <p>{customer?.Address}</p>
              </div>
            </>
          ) : (
            <>
              <div className="profile-detail">
                <h4>Staff ID</h4>
                <p>{staff?.StaffID}</p>
              </div>

              <div className="profile-detail">
                <h4>Branch Address</h4>
                <p>{branch?.Address}</p>
              </div>
            </>
          )}
        </div>

        <div className="profile-buttons">
          {user?.role === "Customer" && (
            <button
              className={customer ? "btn-disabled" : "btn-normal"}
              type="button"
              onClick={handleRegisterCustomerClicked}
              disabled={customer ? true : false}
            >
              Register as Customer
            </button>
          )}

          <button className="btn-normal" type="button" onClick={handleEditProfileClicked}>
            Edit Profile
          </button>

          <button className="btn-normal" type="button" onClick={handleChangePasswordClicked}>
            Change Password
          </button>
        </div>
      </div>

      {isScreenSmall && <div className="break-line" />}

      <div className="rents-made">
        <h3 className="title">Rents Made {user?.role === "Staff" && "By Customers"}</h3>

        {isLoading ? (
          <p className="loading-message">Loading...</p>
        ) : (
          <div className="cards">
            {rentals
              .filter((rental) => {
                // filter rents made where rental drop off time past the current time (meaning car is already returned)
                const rentalDropOffTime = new Date(rental.DropOffTime);

                return currentTime.getTime() <= rentalDropOffTime.getTime();
              })
              .map((rental) => (
                <RentalDisplayCard rental={rental} key={rental.RentalID} staffBranchNo={staff?.BranchNo ?? ""} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

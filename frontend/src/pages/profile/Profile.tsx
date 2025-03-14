import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect, useState } from "react";
import "./profile.css";
import RentalDisplayCard from "../../components/display-cards/RentalDisplayCard";
import { useCustomerContext } from "../../hooks/useCustomerContext";
import { Branch, Car, Rental } from "../../types";
import { getRentalsByBranchNo, getRentalsByNRIC } from "../../api/rental";
import EditProfileModal from "../../components/modal/EditProfileModal";
import ChangePasswordModal from "../../components/modal/ChangePasswordModal";
import { useStaffContext } from "../../hooks/useStaffContext";
import { getBranchByBranchNo } from "../../api/branch";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import { deleteUser } from "../../api/auth";
import { getAllCars } from "../../api/car";

const SMALL_SCREEN_SIZE = 700;

const Profile = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [openedModal, setOpenedModal] = useState<string>("");

  const [branch, setBranch] = useState<Branch | null>(null); // for staff only
  const [cars, setCars] = useState<Car[]>([]);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < SMALL_SCREEN_SIZE);

  const [isLoading, setIsLoading] = useState(true);

  const { user, dispatch: userDispatch } = useAuthContext();
  const { customer, dispatch: customerDispatch } = useCustomerContext();
  const { staff, dispatch: staffDispatch } = useStaffContext();

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

  function handleDeleteProfileClicked() {
    setOpenedModal("delete-profile");
  }

  async function fetchRentalData() {
    setIsLoading(true);

    try {
      if (user?.Role === "Customer") {
        // get rentals for customer based on nric
        if (!customer) return setIsLoading(false);

        const { response, json } = await getRentalsByNRIC(customer.NRIC);
        if (response.ok && json.length) setRentals(json);
        else setRentals([]);
      } else {
        // get rentals to be filtered through staff branch
        if (!staff) return;

        const { response, json } = await getRentalsByBranchNo(staff.BranchNo);
        if (response.ok && json.length) setRentals(json);
        else setRentals([]);
      }

      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchBranchData() {
    // get branch address and all rentals for staff
    if (!staff) return;

    const { response: branchResponse, json: branchData } = await getBranchByBranchNo(staff?.BranchNo);
    if (branchResponse.ok && branchData) setBranch(branchData);
  }

  async function handleDeleteProfile() {
    const { response: userResponse } = await deleteUser(user?.UserID ?? 0);

    if (!userResponse.ok) return alert("Oops! Something went wrong.");
    alert("Profile deleted successfully");
    userDispatch({ type: "LOGOUT", payload: null });
    customerDispatch({ payload: null });
    staffDispatch({ payload: null });
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
  }

  async function fetchCarData() {
    try {
      const { json: carData } = await getAllCars();

      if (carData) setCars(carData);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!user) navigate("/login");

    setRentals([]);
    fetchRentalData();
    fetchCarData();
    fetchBranchData();

    // generates the current time to filter out past rents made
    setCurrentTime(new Date());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [user, customer]);

  return (
    <div className="profile-container">
      {openedModal === "edit-profile" && (
        <EditProfileModal setOpenedModal={setOpenedModal} currentStaffBranch={branch?.Address ?? ""} />
      )}
      {openedModal === "change-password" && <ChangePasswordModal setOpenedModal={setOpenedModal} isLoggedIn={true} />}
      {openedModal === "delete-profile" && (
        <ConfirmationModal
          setOpenedModal={setOpenedModal}
          handleCallback={handleDeleteProfile}
          content="Are you sure you want to delete your profile?"
          dangerButtonText="Delete"
        />
      )}

      <div className="profile-details">
        <div className="profile-header">
          <p className="name">{user?.Name}</p>
          <p className="account-type">{user?.Role} Account</p>
        </div>
        <div className="profile-content">
          <div className="profile-detail">
            <h4>Email</h4>
            <p>{user?.Email}</p>
          </div>

          {(customer || staff) && (
            <>
              <div className="profile-detail">
                <h4>Phone Number</h4>
                <p>{user?.Role === "Customer" ? customer?.PhoneNumber : staff?.PhoneNumber}</p>
              </div>

              {user?.Role === "Customer" ? (
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
            </>
          )}
        </div>

        <div className="profile-buttons">
          {user?.Role === "Customer" && (
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

          <button className="btn-danger" type="button" onClick={handleDeleteProfileClicked}>
            Delete Profile
          </button>
        </div>
      </div>

      {isScreenSmall && <div className="break-line" />}

      <div className="rents-made">
        <h3 className="title">Rents Made {user?.Role === "Staff" && "By Customers"}</h3>

        {isLoading ? (
          <p className="loading-message">Loading...</p>
        ) : rentals.length === 0 ? (
          <p className="loading-message">No rentals made yet...</p>
        ) : (
          <div className="cards">
            {rentals
              .filter((rental) => {
                // filter rents made where rental drop off time past the current time (meaning car is already returned)
                const rentalDropOffTime = new Date(rental.DropOffTime);

                return currentTime.getTime() <= rentalDropOffTime.getTime();
              })
              .map((rental) => {
                const car = cars.find((car) => car.CarPlateNo === rental.CarPlateNo);

                return (
                  car && (
                    <RentalDisplayCard
                      rental={rental}
                      key={rental.RentalID}
                      car={car}
                      staffBranchNo={car.BranchNo}
                      branchAddress={branch?.Address}
                      fetchCallback={fetchRentalData}
                    />
                  )
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

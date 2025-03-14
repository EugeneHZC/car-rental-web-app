import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useCustomerContext } from "../hooks/useCustomerContext";
import { createCustomer } from "../api/customer";
import { Customer } from "../types";

const CustomerRegistration = () => {
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const name = user?.Name;
  const [gender, setGender] = useState("");
  const [nric, setNRIC] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState(0);
  const [address, setAddress] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const { dispatch } = useCustomerContext();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user || !name) return;

    setIsButtonClicked(true);

    const newCustomer: Customer = {
      Name: name,
      Gender: gender,
      NRIC: nric,
      PhoneNumber: phoneNumber,
      LicenseNumber: licenseNumber,
      Address: address,
      UserID: user.UserID,
    };

    try {
      const { response, json } = await createCustomer(newCustomer);

      if (response.ok) {
        alert(json);
        setGender("");
        setNRIC("");
        setPhoneNumber("");
        setLicenseNumber(0);
        setAddress("");

        dispatch({ payload: newCustomer });

        navigate("/profile");
      } else {
        alert("Oops! Something went wrong.");
      }
    } catch (e) {
      console.log(e);
    }

    setIsButtonClicked(false);
  }

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Customer Registration</legend>
        <div className="form-container">
          <div className="input-section">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" value={name} disabled />
          </div>

          <div className="input-section">
            <label htmlFor="gender">Gender</label>
            <div className="radio-option">
              <input type="radio" name="gender" value="Male" onChange={(e) => setGender(e.target.value)} required />
              <label htmlFor="gender" className="gender-label">
                Male
              </label>
            </div>
            <div className="radio-option">
              <input type="radio" name="gender" value="Female" onChange={(e) => setGender(e.target.value)} required />
              <label htmlFor="gender" className="gender-label">
                Female
              </label>
            </div>
          </div>

          <div className="input-section">
            <label htmlFor="nric">NRIC</label>
            <input type="text" name="nric" value={nric} onChange={(e) => setNRIC(e.target.value)} required />
          </div>

          <div className="input-section">
            <label htmlFor="phone-number">Phone Number</label>
            <input
              type="text"
              name="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="input-section">
            <label htmlFor="license-number">License Number</label>
            <input
              type="text"
              name="license-number"
              value={licenseNumber !== 0 ? licenseNumber : ""}
              onChange={(e) => {
                if (!isNaN(parseInt(e.target.value))) {
                  setLicenseNumber(parseInt(e.target.value));
                } else {
                  setLicenseNumber(0);
                }
              }}
              required
            />
          </div>

          <div className="input-section">
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              rows={5}
              cols={50}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={isButtonClicked} className={isButtonClicked ? "btn-disabled" : "btn-normal"}>
            {isButtonClicked ? "Registering..." : "Register"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default CustomerRegistration;

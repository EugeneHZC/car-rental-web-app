import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { login, register } from "../../api/auth";
import { Branch, Staff } from "../../types";
import { getAllBranches } from "../../api/branch";
import { createStaff } from "../../api/staff";

const Register = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [branchNo, setBranchNo] = useState("default");
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);

  const navigate = useNavigate();
  const { user } = useAuthContext();

  async function fetchBranchData() {
    const { response, json } = await getAllBranches();

    if (response.ok) setAvailableBranches(json);
  }

  async function handleCustomerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and confirm password must be the same!");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      // create a user
      const { response, json } = await register(name, email, password, role);

      alert(json);

      if (!response.ok) return;

      if (role === "Staff") {
        // get a user to assign its id to staff
        const { json: userData } = await login(name, email, password);

        // create new staff object and insert into database
        const newStaff: Staff = {
          StaffID: staffId,
          Name: name,
          Gender: gender,
          PhoneNumber: phoneNumber,
          UserID: userData.others.UserID,
          BranchNo: branchNo,
        };

        console.log(newStaff);

        const { response, json: message } = await createStaff(newStaff);

        console.log(message);

        if (!response.ok) return;
      }

      setName("");
      setGender("");
      setEmail("");
      setPhoneNumber("");
      setStaffId("");
      setBranchNo("default");
      setPassword("");
      setConfirmPassword("");
      setRole("Customer");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (user) navigate("/");

    fetchBranchData();
  }, [user]);

  return (
    <form className="register-form" onSubmit={handleCustomerSubmit}>
      <fieldset>
        <legend>Register</legend>

        <div className="form-container">
          <div className="input-section">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {role === "Staff" && (
            <div className="input-section">
              <label htmlFor="gender">Gender</label>
              <div className="radio-option">
                <input type="radio" name="gender" value="Male" onChange={(e) => setGender(e.target.value)} />
                <label htmlFor="gender" className="gender-label">
                  Male
                </label>
              </div>
              <div className="radio-option">
                <input type="radio" name="gender" value="Female" onChange={(e) => setGender(e.target.value)} />
                <label htmlFor="gender" className="gender-label">
                  Female
                </label>
              </div>
            </div>
          )}

          <div className="input-section">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {role === "Staff" && (
            <>
              <div className="input-section">
                <label htmlFor="phone-number">Phone Number</label>
                <input
                  type="text"
                  id="phone-number"
                  name="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="input-section">
                <label htmlFor="staff-id">Staff ID</label>
                <input
                  type="text"
                  id="staff-id"
                  name="staff-id"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                />
              </div>

              <div className="input-section">
                <label htmlFor="branch-number">Branch</label>
                <select name="branch-number" value={branchNo} onChange={(e) => setBranchNo(e.target.value)}>
                  <option value="default" disabled className="option-disabled">
                    --Select your branch number--
                  </option>
                  {availableBranches.map((branch) => (
                    <option value={branch.BranchNo} key={branch.BranchNo}>
                      {branch.BranchNo}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="input-section">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-section">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-section">
            <label htmlFor="account-type">Account Type</label>
            <select name="account-type" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Customer">Customer</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="btn-normal">
            Register
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default Register;

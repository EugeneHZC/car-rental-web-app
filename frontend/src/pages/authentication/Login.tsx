import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { login } from "../../api/auth";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const navigate = useNavigate();

  const { user, dispatch } = useAuthContext();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsButtonClicked(true);

    try {
      const { response, json } = await login(name, email, password);

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        navigate("/");
        alert("User logged in successfully!");

        const user = {
          UserID: json.others.UserID,
          Name: json.others.Name,
          Email: json.others.Email,
          Role: json.others.Role,
        };

        dispatch({
          type: "LOGIN",
          payload: user,
        });

        localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_KEY, JSON.stringify(user));
      } else {
        alert(json);
      }

      setIsButtonClicked(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Login</legend>

        <div className="form-container">
          <div className="input-section">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

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

          <button type="submit" className={isButtonClicked ? "btn-disabled" : "btn-normal"} disabled={isButtonClicked}>
            {isButtonClicked ? "Logging in..." : "Login"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default Login;

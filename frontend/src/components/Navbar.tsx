import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCustomerContext } from "../hooks/useCustomerContext";
import Dropdown from "./dropdown/Dropdown";
import { links } from "../constantLinks";
import { useEffect, useState } from "react";

const SMALL_SCREEN_SIZE = 700;

const Navbar = () => {
  const { user, dispatch: userDispatch } = useAuthContext();
  const { dispatch: customerDispatch } = useCustomerContext();

  const [isSmallerScreen, setIsSmallerScreen] = useState(window.innerWidth < SMALL_SCREEN_SIZE);

  function handleResize() {
    setIsSmallerScreen(window.innerWidth < SMALL_SCREEN_SIZE);
  }

  function handleLogout() {
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_KEY);
    userDispatch({ type: "LOGOUT", payload: null });
    customerDispatch({ payload: null });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="nav-container">
      <Link to="/" className="nav-app-name">
        CarPool
      </Link>

      {user ? (
        <>
          {!isSmallerScreen ? (
            <div className="nav-links">
              {links.map((link) => {
                if (link.linkText === "Logout")
                  return (
                    <Link key={link.linkTo} to={link.linkTo} className="nav-link" onClick={handleLogout}>
                      {link.linkText}
                    </Link>
                  );

                if (link.linkText === "Add Car")
                  return (
                    user.role === "Staff" && (
                      <Link key={link.linkTo} to={link.linkTo} className="nav-link" onClick={handleLogout}>
                        {link.linkText}
                      </Link>
                    )
                  );

                return (
                  <Link key={link.linkTo} to={link.linkTo} className="nav-link">
                    {link.linkText}
                  </Link>
                );
              })}
            </div>
          ) : (
            <Dropdown />
          )}
        </>
      ) : (
        <>
          <div className="nav-links">
            <Link to="/register" className="nav-link">
              Register
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;

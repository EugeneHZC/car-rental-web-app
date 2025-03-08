import { Link } from "react-router-dom";

const DropdownItem = ({
  linkTo,
  className,
  linkText,
  setIsDropdownOpen,
  logoutCallback,
}: {
  linkTo: string;
  className?: string;
  linkText: string;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logoutCallback: () => void;
}) => {
  return (
    <div className={`dropdown-item ${className}`}>
      <Link
        to={linkTo}
        className="nav-link"
        onClick={() => {
          if (linkText === "Logout") logoutCallback();
          else setIsDropdownOpen(false);
        }}
      >
        {linkText}
      </Link>
    </div>
  );
};

export default DropdownItem;

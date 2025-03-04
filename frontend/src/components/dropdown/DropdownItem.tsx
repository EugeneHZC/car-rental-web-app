import { Link } from "react-router-dom";

const DropdownItem = ({
  linkTo,
  className,
  linkText,
  setIsDropdownOpen,
}: {
  linkTo: string;
  className?: string;
  linkText: string;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className={`dropdown-item ${className}`}>
      <Link to={linkTo} className="nav-link" onClick={() => setIsDropdownOpen(false)}>
        {linkText}
      </Link>
    </div>
  );
};

export default DropdownItem;

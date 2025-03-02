import { Link } from "react-router-dom";

const DropdownItem = ({ linkTo, className, linkText }: { linkTo: string; className?: string; linkText: string }) => {
  return (
    <div className={`dropdown-item ${className}`}>
      <Link to={linkTo} className="nav-link">
        {linkText}
      </Link>
    </div>
  );
};

export default DropdownItem;

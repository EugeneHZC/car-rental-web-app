import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./dropdown.css";

const DropdownButton = ({
  isDropdownOpen,
  setIsDropdownOpen,
}: {
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  function toggleDropdown() {
    setIsDropdownOpen((isOpen: boolean) => !isOpen);
  }

  return (
    <div className={`dropdown-button ${isDropdownOpen ? "dropdown-button-open" : ""}`} onClick={toggleDropdown}>
      {/* Button */}
      <span className="toggle-icon">{isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
    </div>
  );
};

export default DropdownButton;

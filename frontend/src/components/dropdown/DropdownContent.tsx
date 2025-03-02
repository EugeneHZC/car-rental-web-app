import { links } from "../../constantLinks";
import DropdownItem from "./DropdownItem";
import "./dropdown.css";

const DropdownContent = ({ isDropdownOpen }: { isDropdownOpen: boolean }) => {
  return (
    <div className={`dropdown-content ${isDropdownOpen ? "dropdown-content-open" : ""}`}>
      {links.map((link) => {
        return (
          <DropdownItem
            key={link.linkTo}
            linkTo={link.linkTo}
            className={links.indexOf(link) === links.length - 1 ? "bottom-item" : ""}
            linkText={link.linkText}
          />
        );
      })}
    </div>
  );
};

export default DropdownContent;

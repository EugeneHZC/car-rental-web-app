import { links } from "../../constantLinks";
import { useAuthContext } from "../../hooks/useAuthContext";
import DropdownItem from "./DropdownItem";
import "./dropdown.css";

const DropdownContent = ({
  isDropdownOpen,
  setIsDropdownOpen,
  logoutCallback,
}: {
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logoutCallback: () => void;
}) => {
  const { user } = useAuthContext();

  return (
    <div className={`dropdown-content ${isDropdownOpen ? "dropdown-content-open" : ""}`}>
      {links.map((link) => {
        if (link.linkText === "Add Car")
          return (
            user?.role === "Staff" && (
              <DropdownItem
                key={link.linkTo}
                linkTo={link.linkTo}
                className={links.indexOf(link) === links.length - 1 ? "bottom-item" : ""}
                linkText={link.linkText}
                setIsDropdownOpen={setIsDropdownOpen}
                logoutCallback={logoutCallback}
              />
            )
          );

        return (
          <DropdownItem
            key={link.linkTo}
            linkTo={link.linkTo}
            className={links.indexOf(link) === links.length - 1 ? "bottom-item" : ""}
            linkText={link.linkText}
            setIsDropdownOpen={setIsDropdownOpen}
            logoutCallback={logoutCallback}
          />
        );
      })}
    </div>
  );
};

export default DropdownContent;

import { useEffect, useRef, useState } from "react";
import DropdownButton from "./DropdownButton";
import DropdownContent from "./DropdownContent";

const Dropdown = ({ logoutCallback }: { logoutCallback: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutsideDropdown(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [dropdownRef]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <DropdownButton isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      <DropdownContent
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        logoutCallback={logoutCallback}
      />
    </div>
  );
};

export default Dropdown;

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Dropdown = ({ menuItem, stickyMenu }) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const pathUrl = usePathname();

  return (
    <li
      onClick={() => setDropdownToggler(!dropdownToggler)}
      className="group relative before:absolute before:left-0 before:top-0 before:h-[2px] before:w-0 before:rounded-b before:bg-blue before:duration-200 before:ease-out hover:before:w-full"
    >
      <Link
        href={menuItem.path ?? "/"}
        className={`flex items-center gap-1.5 text-custom-xs font-medium uppercase tracking-[0.16em] text-dark transition-colors hover:text-blue ${
          stickyMenu ? "py-3.5" : "py-4"
        }`}
      >
        {menuItem.title}
        <svg className="fill-current" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
            fill=""
          />
        </svg>
      </Link>

      {/* Dropdown */}
      <ul className={`dropdown ${dropdownToggler ? "flex" : ""}`}>
        {menuItem.submenu.map((item, i) => (
          <li key={i}>
            <Link
              href={item.path}
              className={`flex px-4.5 py-[7px] text-custom-sm text-dark-3 transition-colors hover:bg-cream hover:text-blue ${
                pathUrl === item.path ? "bg-cream text-blue" : ""
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Dropdown;

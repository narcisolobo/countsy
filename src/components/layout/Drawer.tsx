import { ReactNode } from "react";
import { X as XIcon } from "lucide-react";
import { DrawerItem } from "../../types/types";
import { Link } from "react-router";

interface DrawerProps {
  children: ReactNode;
  items: DrawerItem[];
}

function Drawer({ children, items }: DrawerProps) {
  return (
    <div className="drawer drawer-end">
      <input type="checkbox" className="drawer-toggle" id="user-menu" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label
          htmlFor="user-menu"
          aria-label="Close user menu"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li className="ml-auto">
            <label
              htmlFor="user-menu"
              aria-label="Close user menu"
              className="btn btn-ghost btn-sm rounded-full"
            >
              <XIcon />
            </label>
          </li>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <button onClick={item.onClick}>{item.label}</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Drawer;

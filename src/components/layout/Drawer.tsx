import { ReactNode } from "react";
import { X as XIcon } from "lucide-react";

interface DrawerProps {
  children: ReactNode;
}

function Drawer({ children }: DrawerProps) {
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
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Drawer;

import { CircleUserRound, Tally5 } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-base-200 shadow-sm">
      <div className="navbar mx-auto max-w-5xl">
        <div className="flex flex-1 items-center">
          <Tally5 />
          <a className="btn btn-ghost text-xl tracking-wide uppercase">
            Countsy
          </a>
        </div>
        <div className="mr-4 flex-none">
          <label
            htmlFor="user-menu"
            aria-label="Open user menu"
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <CircleUserRound size={36} />
          </label>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

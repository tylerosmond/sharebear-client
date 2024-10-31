import { NavLink, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center pt-5">
      <ul className="flex space-x-5 pl-10">
        <li>
          <NavLink
            className="flex items-center underline text-blue-600 hover:text-purple-700"
            to={"/"}
          >
            <img
              src="./public/ShareBear.png"
              alt="ShareBear Logo"
              className="w-8 h-8 mr-2"
            />{" "}
            {/* Adjust size as needed */}
          </NavLink>
        </li>
        <li>
          <NavLink
            className="underline text-blue-600 hover:text-purple-700"
            to={"/allProducts"}
          >
            All Products
          </NavLink>
        </li>
        <li>
          <NavLink
            className="underline text-blue-600 hover:text-purple-700"
            to={"/wishlist"}
          >
            Wishlist
          </NavLink>
        </li>
        <li>
          <NavLink
            className="underline text-blue-600 hover:text-purple-700"
            to={"/profile"}
          >
            Profile
          </NavLink>
        </li>
      </ul>
      <div>
        {localStorage.getItem("sharebear_token") !== null ? (
          <button
            className="underline text-blue-600 hover:text-purple-700 pr-10"
            onClick={() => {
              localStorage.removeItem("sharebear_token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              className="underline text-blue-600 hover:text-purple-700"
              to={"/login"}
            >
              Login
            </NavLink>
            <NavLink
              className="underline text-blue-600 hover:text-purple-700 ml-4"
              to={"/register"}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

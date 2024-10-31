import { NavLink, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center py-2 bg-blue-500">
      {" "}
      {/* Adjusted padding for vertical centering */}
      <ul className="flex space-x-5 pl-10">
        <li>
          <NavLink
            className="flex items-center underline text-white hover:text-purple-300"
            to={"/"}
          >
            <img
              src="./public/ShareBear.png"
              alt="ShareBear Logo"
              className="w-8 h-8 mr-2"
            />
          </NavLink>
        </li>
        <li>
          <NavLink
            className="underline text-white hover:text-purple-300"
            to={"/allProducts"}
          >
            All Products
          </NavLink>
        </li>
        <li>
          <NavLink
            className="underline text-white hover:text-purple-300"
            to={"/wishlist"}
          >
            Wishlist
          </NavLink>
        </li>
        <li>
          <NavLink
            className="underline text-white hover:text-purple-300"
            to={"/profile"}
          >
            Profile
          </NavLink>
        </li>
      </ul>
      <div className="pr-10">
        {" "}
        {/* Added padding to the right for spacing */}
        {localStorage.getItem("sharebear_token") !== null ? (
          <button
            className="underline text-white hover:text-purple-300"
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
              className="underline text-white hover:text-purple-300"
              to={"/login"}
            >
              Login
            </NavLink>
            <NavLink
              className="underline text-white hover:text-purple-300 ml-4"
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

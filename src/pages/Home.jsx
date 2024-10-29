import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Welcome Section */}
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        Welcome To ShareBear
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Share and exchange items with your community!
      </p>

      {/* Logo Section */}
      <img
        src="./public/ShareBear.png" // replace with actual logo path
        alt="ShareBear Logo"
        className="w-[450px] h-[450px] mb-2" // Adjust size as needed
      />

      {/* About Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl text-center">
        <h2 className="text-2xl font-semibold mb-4">About ShareBear</h2>
        <p className="text-gray-600">
          {/* Replace this text with your actual "About" content */}
          ShareBear is a platform designed for families to easily share
          gently-used items like toys, clothing, and accessories with their
          community. Many of these items are quickly outgrown, taking up space
          and often going unused. ShareBear provides a simple, community-driven
          solution by allowing parents to exchange these items directly with
          other families. Whether you're looking to pass on outgrown clothes or
          find a new home for toys, ShareBear helps foster connections,
          encourage sustainability, and build a spirit of sharing—all without
          the hassle of selling, donating to centers with limitations, or
          complex recycling processes.
        </p>
        <h2 className="text-2xl font-semibold mb-2 mt-4">Explore Products</h2>
        <Link to={"/allProducts"}>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            View All Products
          </button>
        </Link>
      </div>
    </div>
  );
};

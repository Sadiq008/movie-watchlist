import { Link, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import Icon from "../../assets/images.png"
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const searchTerms = useSelector(
    (state) => state.watchlist.searchTerms[currentUser?.id] || {}
  );

  const getProfileDisplay = () => {
    if (currentUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#f23f3f] text-white flex items-center justify-center">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return <CgProfile className="text-2xl text-gray-600" />;
    }
  };

  const renderWatchlistBySearchTerm = () => {
  return Object.entries(searchTerms).map(([term]) => (
    <div
      key={term}
      className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={() => navigate(`/mylists?term=${encodeURIComponent(term)}`)}
    >
      <div className="bg-[#f1f5f9] rounded-lg p-3">
        <h3 className="font-medium text-gray-700 text-sm flex items-center">
          <img
            src={Icon}
            alt="film icon"
            className="w-5 h-5 object-contain mr-2"
          />
          Movies by {term}
        </h3>
      </div>
    </div>
  ));
};

const handleOptionClick = (type) => {
    localStorage.clear();
    localStorage.setItem("authType", type);
    navigate("/account", { state: { authType: type } });
    setShowOptions(false);
};

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions && !event.target.closest('.guest-dropdown')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  return (
    <div className="fixed top-0 left-0 flex flex-col border-r border-r-gray-400 p-6 min-w-[320px] h-screen bg-white overflow-hidden">
      <div>
        <h1 className="text-[#f23f3f] font-bold text-3xl mb-14">Watchlists</h1>
      </div>

      <div className="flex items-center">
        <Link
          to={"/"}
          className="flex items-center bg-[#f23f3f] text-white py-2 pl-2 pr-32 rounded-md transition duration-300 ease-linear transform hover:scale-105 shadow-md mb-10"
        >
          <IoHomeOutline className="mr-2" />
          Home
        </Link>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <Link
          to={"/mylists"}
          className="flex items-center py-2 pl-2 pr-32 rounded-md transition duration-300 ease-linear transform hover:scale-105 shadow-md mb-4"
        >
          My Lists
        </Link>

        <div className="ml-4 space-y-2 overflow-y-auto">
          {renderWatchlistBySearchTerm()}
        </div>
      </div>

       <div className="mt-auto pt-4 relative">
        {currentUser ? (
          <Link
            to={"/account"}
            className="flex items-center gap-2 shadow-md py-2 px-4 rounded-md w-full"
          >
            {getProfileDisplay()}
            <span className="mr-2 text-gray-600 truncate">{currentUser.name}</span>
            <span className="ml-auto text-gray-600">
              <BsThreeDots />
            </span>
          </Link>
        ) : (
          <div className="relative guest-dropdown">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 shadow-md py-2 px-4 rounded-md w-full bg-white"
            >
              <CgProfile className="text-2xl text-gray-600" />
              <span className="mr-2 text-gray-600">GUEST</span>
              <span className="ml-auto text-gray-600">
                <BsThreeDots />
              </span>
            </button>

            {showOptions && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => handleOptionClick("login")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Login
                </button>
                <button
                  onClick={() => handleOptionClick("register")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
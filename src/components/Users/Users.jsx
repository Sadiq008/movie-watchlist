import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, logout } from "../../store/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const Users = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const location = useLocation();

  const users = useSelector(state => state.user.users);

  useEffect(() => {
    const authType = localStorage.getItem("authType") || location.state?.authType;
    if (authType) {
      setIsRegistering(authType === "register");
      localStorage.removeItem("authType");
    }
  }, [location.state]);


  const handleLogin = (e) => {
    e.preventDefault();
  
  // Check if email is empty
  if (!email.trim()) {
    toast.error("Please enter an email address", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "#f23f3f",
        color: "white"
      }
    });
    return;
  }

  // Basic email validation
  if (!email.includes('@') || !email.includes('.')) {
    toast.error("Invalid email format", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "#f23f3f",
        color: "white"
      }
    });
    return;
  }

  const userExists = users.find(user => user.email === email);

  if (!userExists) {
    toast.error("Login failed / User not found", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "#f23f3f",
        color: "white"
      }
    });
    return;
  }

  // Dispatch login action
  dispatch(login(email));

  // Handle success/error after dispatch
  if (error) {
    toast.error("Login failed / User not found", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "#f23f3f",
        color: "white"
      }
    });
  } else {
     toast.success("Login successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "#4BB543", // Green background for success
        color: "white"
      }
    });
  }
  
  setEmail("");
};

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#f23f3f",
          color: "white"
        }
      });
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter an email address", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#f23f3f",
          color: "white"
        }
      });
      return;
    }

  if (!email.includes('@') || !email.includes('.')) {
      toast.error("Invalid email format", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#f23f3f",
          color: "white"
        }
      });
      return;
    }

   const existingUser = users.find(user => user.email === email);

  if (existingUser) {
      toast.error("Registration failed. Email already exists.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#f23f3f",
          color: "white"
        }
      });
      return;
    }

  dispatch(register({ name, email }));

    if (!error) {
      toast.success("Registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
      setEmail("");
      setName("");
    }
  };

  const handleSwitchAuthMode = () => {
    setIsRegistering(!isRegistering);
    setEmail("");
    setName("");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  if (currentUser) {
    return (
      <div className="p-10 ml-[320px] mt-36">
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center w-96">
          <h2 className="text-2xl font-bold mb-6">Welcome, {currentUser.name}</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
     <div className="p-10 ml-[600px] mt-24">
      <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center w-96">
        <h2 className="text-2xl font-bold mb-6">
          {isRegistering ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="space-y-4 w-full">
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex space-x-4">
            {isRegistering ? (
              <>
                <button
                  onClick={handleRegister}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 flex-1"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={handleSwitchAuthMode}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex-1"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 flex-1"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleSwitchAuthMode}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex-1"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Users;
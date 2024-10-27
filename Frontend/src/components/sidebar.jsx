import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate from React Router
import { FiGrid, FiDollarSign, FiCreditCard, FiShield, FiLogOut } from "react-icons/fi";
import { getAuth } from "firebase/auth"; // Import Firebase auth methods

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const auth = getAuth(); // Get Firebase authentication instance

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.error("Error signing out: ", error); // Handle any errors
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full p-4">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 mb-10">
        <div className="flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoSbpWz8SUrRq7EZL-tE73XEN-oSUPFgA3KQ&s"
            alt="Logo"
            className="mr-2 rounded-full w-9 h-9"
          />
          <span>PennyTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul>
          <li className="mb-6">
            <Link to="/dashboard" className="flex items-center font-semibold">
              <FiGrid className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-6">
            <Link to="/budgets" className="flex items-center">
              <FiDollarSign className="mr-3" />
              Budgets
            </Link>
          </li>
          <li className="mb-6">
            <Link to="/expenses" className="flex items-center">
              <FiCreditCard className="mr-3" />
              Expenses
            </Link>
          </li>
          <li>
            <Link to="/generate" className="flex items-center">
              <FiShield className="mr-3" />
              Download Report
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="absolute bottom-24 left-4 flex items-center space-x-3">
        <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center text-white">
          G
        </div>
        <span>Profile</span>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="absolute bottom-6 left-4 flex items-center text-red-500 hover:text-red-700"
      >
        <FiLogOut className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

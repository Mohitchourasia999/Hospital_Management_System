import React from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaHouse,
  FaUserDoctor,
  FaUser,
  FaCalendarCheck,
  FaBoxesStacked,
  FaMessage,
} from "react-icons/fa6";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(
        "http://localhost:4000/api/v1/user/admin/logout",
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem(
        "admin"
      );

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Hospital Admin</h2>
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/">
            <FaHouse />
            <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/appointments">
            <FaCalendarCheck />
            <span>
              Appointments
            </span>
          </Link>
        </li>

        <li>
          <Link to="/doctors">
            <FaUserDoctor />
            <span>Doctors</span>
          </Link>
        </li>

        <li>
          <Link to="/patients">
            <FaUser />
            <span>Patients</span>
          </Link>
        </li>

        <li>
          <Link to="/inventory">
            <FaBoxesStacked />
            <span>Inventory</span>
          </Link>
        </li>

        <li>
          <Link to="/messages">
            <FaMessage />
            <span>Messages</span>
          </Link>
        </li>
      </ul>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
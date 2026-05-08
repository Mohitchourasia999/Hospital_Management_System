import axios from "axios";

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Admin");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          email,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      localStorage.setItem(
        "admin",
        "true"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response.data.message
      );
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-form"
        onSubmit={handleLogin}
      >
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="Admin">
            Admin
          </option>
        </select>

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
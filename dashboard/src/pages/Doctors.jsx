import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] =
    useState([]);

  const [avatar, setAvatar] =
    useState("");

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      gender: "",
      dob: "",
      nic: "",
      doctorDepartment: "",
    });

  // ================= FETCH =================

  const fetchDoctors =
    async () => {
      try {
        const { data } =
          await axios.get(
            "http://localhost:4000/api/v1/user/doctors",
            {
              withCredentials: true,
            }
          );

        setDoctors(data.doctors);
      } catch (error) {
        toast.error(
          "Failed to fetch doctors"
        );
      }
    };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================= INPUT =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= IMAGE =================

  const handleAvatar = (e) => {
    const file = e.target.files[0];

    setAvatar(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setAvatarPreview(
        reader.result
      );
    };
  };

  // ================= ADD DOCTOR =================

  const handleAddDoctor =
    async (e) => {
      e.preventDefault();

      const data =
        new FormData();

      Object.keys(formData).forEach(
        (key) => {
          data.append(
            key,
            formData[key]
          );
        }
      );

      data.append(
        "docAvatar",
        avatar
      );

      try {
        const response =
          await axios.post(
            "http://localhost:4000/api/v1/user/doctor/addnew",
            data,
            {
              withCredentials: true,

              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        toast.success(
          response.data.message
        );

        fetchDoctors();

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          gender: "",
          dob: "",
          nic: "",
          doctorDepartment:
            "",
        });

        setAvatar("");

        setAvatarPreview("");
      } catch (error) {
        toast.error(
          error.response.data.message
        );
      }
    };

  // ================= DELETE =================

  const handleDelete =
    async (id) => {
      try {
        const { data } =
          await axios.delete(
            `http://localhost:4000/api/v1/user/doctor/delete/${id}`,
            {
              withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchDoctors();
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Doctors</h1>

        <p>
          Manage hospital doctors
        </p>
      </div>

      {/* FORM */}

      <form
        className="doctor-form"
        onSubmit={
          handleAddDoctor
        }
      >
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={
            formData.firstName
          }
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={
            formData.lastName
          }
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={
            formData.password
          }
          onChange={handleChange}
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <input
          type="text"
          name="nic"
          placeholder="NIC"
          value={formData.nic}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={
            formData.gender
          }
          onChange={handleChange}
        >
          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>
        </select>

        <input
          type="text"
          name="doctorDepartment"
          placeholder="Department"
          value={
            formData.doctorDepartment
          }
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={
            handleAvatar
          }
        />

        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Preview"
            className="doctor-preview"
          />
        )}

        <button type="submit">
          Add Doctor
        </button>
      </form>

      {/* DOCTORS GRID */}

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div
            className="doctor-card"
            key={doctor._id}
          >
            <img
              src={
                doctor.docAvatar
                  ?.url
              }
              alt="Doctor"
            />

            <h3>
              Dr.{" "}
              {
                doctor.firstName
              }{" "}
              {
                doctor.lastName
              }
            </h3>

            <p>
              {
                doctor.doctorDepartment
              }
            </p>

            <span>
              {doctor.email}
            </span>

            <button
              className="delete-btn"
              onClick={() =>
                handleDelete(
                  doctor._id
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
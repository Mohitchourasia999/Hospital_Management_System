import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // ================= FETCH =================

  const fetchPatients =
    async () => {
      try {
        const { data } =
          await axios.get(
            "http://localhost:4000/api/v1/user/patients",
            {
              withCredentials: true,
            }
          );

        setPatients(
          data.patients
        );
      } catch (error) {
        toast.error(
          "Failed to fetch patients"
        );
      }
    };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ================= DELETE =================

  const handleDelete =
    async (id) => {
      try {
        const { data } =
          await axios.delete(
            `http://localhost:4000/api/v1/user/patient/delete/${id}`,
            {
              withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchPatients();
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  // ================= FILTER =================

  const filteredPatients =
    patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Patients</h1>

        <p>
          Manage hospital patients
        </p>
      </div>

      {/* SEARCH */}

      <div className="patient-search">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* TABLE */}

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Gender</th>

              <th>DOB</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map(
              (patient) => (
                <tr
                  key={patient._id}
                >
                  <td>
                    {
                      patient.firstName
                    }{" "}
                    {
                      patient.lastName
                    }
                  </td>

                  <td>
                    {patient.email}
                  </td>

                  <td>
                    {patient.phone}
                  </td>

                  <td>
                    {patient.gender}
                  </td>

                  <td>
                    {new Date(
                      patient.dob
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          patient._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
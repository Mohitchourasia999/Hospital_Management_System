import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] =
    useState([]);

  // ================= FETCH =================

  const fetchAppointments =
    async () => {
      try {
        const { data } =
          await axios.get(
            "http://localhost:4000/api/v1/appointment/getall",
            {
                withCredentials: true,
            }
          );

        setAppointments(
          data.appointments
        );
      } catch (error) {
        toast.error(
          "Failed to fetch appointments"
        );
      }
    };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= DELETE =================

  const handleDelete =
    async (id) => {
      try {
        const { data } =
          await axios.delete(
            `http://localhost:4000/api/v1/appointment/delete/${id}`,
            {
                withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchAppointments();
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  // ================= UPDATE STATUS =================

  const handleStatusUpdate =
    async (id, status) => {
      try {
        const { data } =
          await axios.put(
            `http://localhost:4000/api/v1/appointment/update/${id}`,
            {
              status,
            },
            {
                withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchAppointments();
      } catch (error) {
        toast.error(
          "Status update failed"
        );
      }
    };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Appointments</h1>

        <p>
          Manage patient appointments
        </p>
      </div>

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Patient</th>

              <th>Doctor</th>

              <th>Date</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map(
              (appointment) => (
                <tr
                  key={
                    appointment._id
                  }
                >
                  <td>
                    {
                      appointment.firstName
                    }{" "}
                    {
                      appointment.lastName
                    }
                  </td>

                  <td>
                    Dr.{" "}
                    {
                      appointment.doctor?.firstName
                    }{" "}
                    {
                      appointment.doctor?.lastName
                    }
                  </td>

                  <td>
                    {new Date(
                      appointment.appointment_date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <select
                      value={
                        appointment.status
                      }
                      onChange={(e) =>
                        handleStatusUpdate(
                          appointment._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          appointment._id
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

export default Appointments;
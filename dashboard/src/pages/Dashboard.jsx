import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import {
  FaCalendarCheck,
  FaUserDoctor,
  FaBoxesStacked,
  FaTriangleExclamation,
} from "react-icons/fa6";

const Dashboard = () => {
  const [appointments, setAppointments] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [inventory, setInventory] =
    useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        const appointmentsData =
          await axios.get(
            "http://localhost:4000/api/v1/appointment/getall",
            {
              withCredentials: true,
            }
          );

        const doctorsData =
          await axios.get(
            "http://localhost:4000/api/v1/user/doctors",
            {
              withCredentials: true,
            }
          );

        const inventoryData =
          await axios.get(
            "http://localhost:4000/api/v1/inventory/all",
            {
              withCredentials: true,
            }
          );

        setAppointments(
          appointmentsData.data
            .appointments
        );

        setDoctors(
          doctorsData.data.doctors
        );

        setInventory(
          inventoryData.data.items
        );
      } catch (error) {
        console.log(error);
      }
    };

  const lowStockItems =
    inventory.filter(
      (item) => item.quantity <= 10
    );

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>

        <p>
          Hospital management
          statistics and quick
          insights
        </p>
      </div>

      {/* STATS */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaCalendarCheck />
          </div>

          <div>
            <h2>
              {appointments.length}
            </h2>

            <p>Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaUserDoctor />
          </div>

          <div>
            <h2>{doctors.length}</h2>

            <p>Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FaBoxesStacked />
          </div>

          <div>
            <h2>
              {inventory.length}
            </h2>

            <p>Inventory Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaTriangleExclamation />
          </div>

          <div>
            <h2>
              {lowStockItems.length}
            </h2>

            <p>Low Stock</p>
          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT */}

      <div className="dashboard-grid">
        {/* RECENT APPOINTMENTS */}

        <div className="dashboard-card">
          <div className="card-header">
            <h3>
              Recent Appointments
            </h3>
          </div>

          <div className="appointment-list">
            {appointments
              .slice(0, 5)
              .map((appointment) => (
                <div
                  className="appointment-item"
                  key={
                    appointment._id
                  }
                >
                  <div>
                    <h4>
                      {
                        appointment.firstName
                      }{" "}
                      {
                        appointment.lastName
                      }
                    </h4>

                    <p>
                      {
                        appointment.department
                      }
                    </p>
                  </div>

                  <span
                    className={`status-badge ${appointment.status?.toLowerCase()}`}
                  >
                    {
                      appointment.status
                    }
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* LOW STOCK */}

        <div className="dashboard-card">
          <div className="card-header">
            <h3>
              Low Stock Medicines
            </h3>
          </div>

          <div className="inventory-alerts">
            {lowStockItems.length ===
            0 ? (
              <p>
                No low stock items
              </p>
            ) : (
              lowStockItems.map(
                (item) => (
                  <div
                    className="inventory-item"
                    key={item._id}
                  >
                    <div>
                      <h4>
                        {
                          item.itemName
                        }
                      </h4>

                      <p>
                        {
                          item.category
                        }
                      </p>
                    </div>

                    <span>
                      Qty:{" "}
                      {
                        item.quantity
                      }
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
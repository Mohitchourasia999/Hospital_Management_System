import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const Messages = () => {
  const [messages, setMessages] =
    useState([]);

  // ================= FETCH =================

  const fetchMessages =
    async () => {
      try {
        const { data } =
          await axios.get(
            "http://localhost:4000/api/v1/message/all",
            {
              withCredentials: true,
            }
          );

        setMessages(
          data.messages
        );
      } catch (error) {
        toast.error(
          "Failed to fetch messages"
        );
      }
    };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= DELETE =================

  const handleDelete =
    async (id) => {
      try {
        const { data } =
          await axios.delete(
            `http://localhost:4000/api/v1/message/delete/${id}`,
            {
              withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchMessages();
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Messages</h1>

        <p>
          Manage patient inquiries
          and contact messages
        </p>
      </div>

      {/* TABLE */}

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Message</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {messages.map(
              (message) => (
                <tr
                  key={message._id}
                >
                  <td>
                    {
                      message.firstName
                    }{" "}
                    {
                      message.lastName
                    }
                  </td>

                  <td>
                    {message.email}
                  </td>

                  <td>
                    {message.phone}
                  </td>

                  <td>
                    {message.message}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          message._id
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

export default Messages;
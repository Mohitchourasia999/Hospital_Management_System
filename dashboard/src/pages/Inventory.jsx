import axios from "axios";

import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const Inventory = () => {
  const [items, setItems] =
    useState([]);

  const [formData, setFormData] =
    useState({
      itemName: "",
      category: "",
      quantity: "",
      unitPrice: "",
      supplier: "",
      expiryDate: "",
    });

  // ================= FETCH =================

  const fetchInventory =
    async () => {
      try {
        const { data } =
          await axios.get(
            "http://localhost:4000/api/v1/inventory/all",
            {
              withCredentials: true,
            }
          );

        setItems(data.items);
      } catch (error) {
        toast.error(
          "Failed to fetch inventory"
        );
      }
    };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ================= INPUT =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= ADD =================

  const handleAddItem =
    async (e) => {
      e.preventDefault();

      try {
        const { data } =
          await axios.post(
            "http://localhost:4000/api/v1/inventory/add",
            formData,
            {
              withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchInventory();

        setFormData({
          itemName: "",
          category: "",
          quantity: "",
          unitPrice: "",
          supplier: "",
          expiryDate: "",
        });
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
            `http://localhost:4000/api/v1/inventory/delete/${id}`,
            {
              withCredentials: true,
            }
          );

        toast.success(data.message);

        fetchInventory();
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
        <h1>Inventory</h1>

        <p>
          Manage medicines and stock
        </p>
      </div>

      {/* FORM */}

      <form
        className="inventory-form"
        onSubmit={handleAddItem}
      >
        <input
          type="text"
          name="itemName"
          placeholder="Medicine Name"
          value={
            formData.itemName
          }
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={
            formData.category
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={
            formData.quantity
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="unitPrice"
          placeholder="Unit Price"
          value={
            formData.unitPrice
          }
          onChange={handleChange}
        />

        <input
          type="text"
          name="supplier"
          placeholder="Supplier"
          value={
            formData.supplier
          }
          onChange={handleChange}
        />

        <input
          type="date"
          name="expiryDate"
          value={
            formData.expiryDate
          }
          onChange={handleChange}
        />

        <button type="submit">
          Add Medicine
        </button>
      </form>

      {/* TABLE */}

      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Category</th>

              <th>Quantity</th>

              <th>Price</th>

              <th>Supplier</th>

              <th>Expiry</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.itemName}
                </td>

                <td>
                  {item.category}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td>
                  ₹{item.unitPrice}
                </td>

                <td>
                  {item.supplier}
                </td>

                <td>
                  {new Date(
                    item.expiryDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(
                        item._id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
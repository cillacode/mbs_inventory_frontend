import React, { useState, useEffect } from "react";
import axios from "axios";

const DepositTable = () => {
  const [deposits, setDeposits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", supplyDate: "" });

  const fetchDeposits = async () => {
    const response = await axios.get("/api/deposits");
    setDeposits(response.data);
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleEditClick = (deposit) => {
    setEditingId(deposit.id);
    setEditForm({
      status: deposit.status,
      supplyDate: deposit.supply_date !== "Not Supplied" ? deposit.supply_date : "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (id) => {
    await axios.put(`/api/deposits/${id}`, {
      status: editForm.status,
      supplyDate: editForm.supplyDate || "Not Supplied",
    });
    setEditingId(null);
    fetchDeposits(); // Refresh the table
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h2>💰 Deposit Records</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount Paid</th>
            <th>Balance Left</th>
            <th>Status</th>
            <th>Sales Person</th>
            <th>Customer Name</th>
            <th>Date of Deposit</th>
            <th>Supply Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
              <td>{deposit.product_name}</td>
              <td>{deposit.quantity}</td>
              <td>{deposit.amount_paid}</td>
              <td>{deposit.balance_left}</td>
              <td>
                {editingId === deposit.id ? (
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <option value="Not Supplied">Not Supplied</option>
                    <option value="Supplied">Supplied</option>
                  </select>
                ) : (
                  deposit.status
                )}
              </td>
              <td>{deposit.sales_person}</td>
              <td>{deposit.customer_name}</td>
              <td>{deposit.date_of_deposit}</td>
              <td>
                {editingId === deposit.id ? (
                  <input
                    type="date"
                    name="supplyDate"
                    value={editForm.supplyDate}
                    onChange={handleEditChange}
                  />
                ) : (
                  deposit.supply_date
                )}
              </td>
              <td>
                {editingId === deposit.id ? (
                  <>
                    <button onClick={() => handleEditSubmit(deposit.id)}>
                      Save
                    </button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(deposit)}>
                    Edit Status
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositTable;

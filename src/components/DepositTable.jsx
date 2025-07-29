// src/components/DepositTable.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./ProductTable.css";

const DepositTable = ({ deposits, onUpdateDepositStatus }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", supplyDate: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (deposit) => {
    setEditingId(deposit.id);
    setEditForm({
      status: deposit.status,
      supplyDate:
        deposit.supply_date && deposit.supply_date !== "Not Supplied"
          ? deposit.supply_date
          : "",
    });
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = () => {
    onUpdateDepositStatus(
      editingId,
      editForm.status,
      editForm.status === "Supplied" ? editForm.supplyDate : ""
    );
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="product-table-container">
      <h2>💰 Deposit Records</h2>

      {/* Desktop Table */}
      <div className="desktop-view">
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
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
            {deposits.length > 0 ? (
              deposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>{deposit.product_name}</td>
                  <td>{deposit.category}</td>
                  <td>{deposit.quantity}</td>
                  <td>{deposit.amount_paid}</td>
                  <td>{deposit.balance_left}</td>
                  <td>{deposit.status}</td>
                  <td>{deposit.sales_person}</td>
                  <td>{deposit.customer_name}</td>
                   <td>{new Date(deposit.deposit_date).toLocaleDateString("en-GB")}</td>
                        <td>
                          {deposit.delivery_date
                            ? new Date(deposit.delivery_date).toLocaleDateString("en-GB")
                            : "Not Supplied"}
                        </td>
                        <td>
                          <button onClick={() => handleEditStatus(deposit.id)}>Edit Status</button>
                        </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No deposits available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-view">
        {deposits.map((deposit) => (
          <div className="product-card" key={deposit.id}>
            <p>
              <strong>Product:</strong> {deposit.product_name}
            </p>
            <p>
              <strong>Category:</strong> {deposit.category}
            </p>
            <p>
              <strong>Quantity:</strong> {deposit.quantity}
            </p>
            <p>
              <strong>Amount Paid:</strong> {deposit.amount_paid}
            </p>
            <p>
              <strong>Balance Left:</strong> {deposit.balance_left}
            </p>
            <p>
              <strong>Status:</strong> {deposit.status}
            </p>
            <p>
              <strong>Sales Person:</strong> {deposit.sales_person}
            </p>
            <p>
              <strong>Customer:</strong> {deposit.customer_name}
            </p>
            <p>
              <strong>Date of Deposit:</strong> {deposit.date_of_deposit}
            </p>
            <p>
              <strong>Supply Date:</strong> {deposit.supply_date}
            </p>
            <div className="actions">
              <button onClick={() => handleEditClick(deposit)}>
                Edit Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Deposit Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                <option value="Not Supplied">Not Supplied</option>
                <option value="Supplied">Supplied</option>
              </Form.Control>
            </Form.Group>

            {editForm.status === "Supplied" && (
              <Form.Group className="mt-3">
                <Form.Label>Supply Date</Form.Label>
                <Form.Control
                  type="date"
                  name="supplyDate"
                  value={editForm.supplyDate}
                  onChange={handleEditChange}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepositTable;

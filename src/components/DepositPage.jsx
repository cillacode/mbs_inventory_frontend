import React from "react";
import DepositProduct from "./DepositProduct";
import DepositTable from "./DepositTable";
import "./DepositPage.css"; // <- create this file for styling

const DepositPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <DepositProduct />
      <hr style={{ margin: "2rem 0" }} />
      <DepositTable />
    </div>
  );
};

export default DepositPage;

// src/features/advanceSettlement/pages/EmployeeAdvanceSettlementPage.jsx

// import { useState } from "react";
import ExpenseUploadForm from "../Components/ExpenseUploadForm";
import MySettlements from "../Components/MySettlements";
import { useNavigate } from "react-router-dom";


const EmployeeAdvanceSettlementPage = () => {
    const navigate = useNavigate();
//   const [showMySettlements, setShowMySettlements] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
        <div className="mb-6 text-right">
          <button
            onClick={() => navigate("/dashboard/employee/my-settelment-requests")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            My Settlements
          </button>
        </div>
        <ExpenseUploadForm />

      </div>
    </div>
  );
};

export default EmployeeAdvanceSettlementPage;

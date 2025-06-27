/* eslint-disable no-unused-vars */
// VendorGenerateDCPage.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DCForm from "../../Components/DCForm"

export default function VendorGenerateDCPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const poDetailsArray = state?.poDetails || [];
  console.log(poDetailsArray);

  // Generate combined items
  const combinedItems = poDetailsArray.map((po) => ({
    description: po.material || "",
    hsn: "",
    qty: po.quantity || 1,
    price: po.cost || 0,
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 0,
  }));

  const handleSubmit = async (formData) => {
    try {
      console.log("DC Submitted with multiple POs:", formData);
      toast.success("Delivery Challan generated successfully!");
      navigate("/dashboard/vendor/dc-preview-page", { state: { formData } });
    } catch (error) {
      toast.error("Failed to generate Delivery Challan.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Generate Delivery Challan</h1>
        <button
          onClick={() => navigate("/dashboard/vendor/procurement-my-dc")}
          className="mt-2 md:mt-0 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          My DC
        </button>
      </div>

      <DCForm
          initialData={{
            orderDate: new Date().toISOString().slice(0, 10),
            dispatchDate: new Date().toISOString().slice(0, 10),
            billTo: {
              name: poDetailsArray[0]?.site || "",
            },
            poList: poDetailsArray.map(po => po.poNumber),
            items: poDetailsArray.map((po) => ({
              description: po.material || "",
              hsn: "",
              qty: po.quantity || 1,
              price: po.cost || 0,
              cgstRate: 0,
              sgstRate: 0,
              igstRate: 0,
            })),
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
        />

    </div>
  );
}

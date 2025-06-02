
import { useRef, useState } from "react";
import {NavLink } from "react-router-dom";

const GenerateDCForm = () => {
  const [dcDetails, setDcDetails] = useState({
    poNumber: "",
    dcDate: "",
    fromLocation: "",
    toLocation: "",
    remarks: "",
  });

  const [items, setItems] = useState([
    { description: "", quantity: "", unit: "Nos", batchNumber: "" },
  ]);

  const formRef = useRef();
  const printRef = useRef();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const handleDcChange = (e) => {
    const { name, value } = e.target;
    setDcDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: "", unit: "Nos", batchNumber: "" }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDownloadOptions(true);
    console.log("Generated DC Payload:", { ...dcDetails, items });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to rehydrate React
  };



  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md">
      <div className="text-right">
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold">
        <NavLink to={"/dashboard/vendor/my-dc"} >
           My DC
        </NavLink>
       
      </button>
</div>

      <h2 className="text-2xl text-green-600 font-semibold mb-6">Generate Delivery Challan (DC)</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div ref={formRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "PO Reference Number", name: "poNumber", type: "text", placeholder: "PO Reference Number" },
            { label: "DC Date", name: "dcDate", type: "date" },
            { label: "From Location", name: "fromLocation", type: "text", placeholder: "Dispatch From Location" },
            { label: "To Location", name: "toLocation", type: "text", placeholder: "Dispatch To Location" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={dcDetails[name]}
                onChange={handleDcChange}
                placeholder={placeholder}
                className="input input-bordered w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-2">Items</label>
          {items.map((item, index) => (
            <div key={index} className="grid sm:grid-cols-5 gap-2 mb-4 items-center">
              {["description", "quantity", "batchNumber"].map((field) => (
                <input
                  key={field}
                  type={field === "quantity" ? "number" : "text"}
                  name={field}
                  value={item[field]}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder={field === "description" ? "Description" : field === "batchNumber" ? "Batch No." : "Qty"}
                  className="input input-bordered p-2 border border-gray-300 rounded w-full"
                  required={field !== "batchNumber"}
                />
              ))}
              <select
                name="unit"
                value={item.unit}
                onChange={(e) => handleItemChange(index, e)}
                className="input input-bordered p-2 border border-gray-300 rounded w-full"
              >
                <option value="Nos">Nos</option>
                <option value="Kg">Kg</option>
                <option value="Ltr">Ltr</option>
                <option value="Box">Box</option>
              </select>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
          >
            + Add Item
          </button>
        </div>

        <div>
          <label className="block font-medium mb-2">Remarks</label>
          <textarea
            name="remarks"
            value={dcDetails.remarks}
            onChange={handleDcChange}
            placeholder="Remarks"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full sm:w-auto">
          Generate DC
        </button>
      </form>

      {showDownloadOptions && (
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            🖨️ Print DC
          </button>
          
        </div>
      )}

      {/* ✅ Hidden Print Section */}
      <div ref={printRef} className="hidden print:block p-6 text-black font-sans">
        <h2 className="text-xl font-bold mb-4 text-center">Delivery Challan</h2>
        <p><strong>PO Number:</strong> {dcDetails.poNumber}</p>
        <p><strong>DC Date:</strong> {dcDetails.dcDate}</p>
        <p><strong>From:</strong> {dcDetails.fromLocation}</p>
        <p><strong>To:</strong> {dcDetails.toLocation}</p>
        <hr className="my-4" />
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Batch No.</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">{item.unit}</td>
                <td className="border px-2 py-1">{item.batchNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <strong>Remarks:</strong> {dcDetails.remarks}
        </div>
        <div className="mt-8 flex justify-between text-sm">
          <p>__________________________<br />Issued By</p>
          <p>__________________________<br />Received By</p>
        </div>
      </div>
    </div>
  );
};

export default GenerateDCForm;

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function DCForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    challanNumber: `DC-${Date.now()}`,
    orderDate: initialData.orderDate || "",
    dispatchDate: initialData.dispatchDate || "",
    challanDate: initialData.challanDate || "",
    referenceNo: "",
    challanType: "Job Work",
    challanGSTIN: "",
    placeOfSupply: "",
    billTo: {
      name: initialData.site || "",
      address: "",
      phone: "",
      gstin: ""
    },
    poList: [], // 🆕 array of PO numbers included
    items: initialData.items || [
        {
          description: "",
          hsn: "",
          qty: 1,
          price: 0,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0
        }
],
 // merged items from all selected POs
    notes: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillToChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      billTo: { ...prev.billTo, [name]: value }
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name.includes("Rate") ? parseFloat(value) : value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          hsn: "",
          qty: 1,
          price: 0,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0
        }
      ]
    });
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  const calculateTotals = () => {
    let subTotal = 0,
      totalTax = 0;

    formData.items.forEach((item) => {
      const taxable = item.qty * item.price;
      const tax =
        (taxable * (item.cgstRate + item.sgstRate + item.igstRate)) / 100;
      subTotal += taxable;
      totalTax += tax;
    });

    return {
      subTotal,
      totalTax,
      rounded: Math.round(subTotal + totalTax),
      grandTotal: (subTotal + totalTax).toFixed(2)
    };
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  try {
    const totals = calculateTotals();
    onSubmit({ ...formData, ...totals });

    // ✅ Clear the form after successful submission
    setFormData({
      challanNumber: `DC-${Date.now()}`,
      orderDate: "",
      dispatchDate: "",
      challanDate: "",
      referenceNo: "",
      challanType: "Job Work",
      challanGSTIN: "",
      placeOfSupply: "",
      billTo: {
        name: "",
        address: "",
        phone: "",
        gstin: ""
      },
      items: [
        {
          description: "",
          hsn: "",
          qty: 1,
          price: 0,
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0
        }
      ],
      notes: ""
    });
  } catch (err) {
    toast.error("Failed to submit");
  }
};


  const totals = calculateTotals();

  return (
  <form
    onSubmit={handleSubmit}
    className="max-w-6xl mx-auto  space-y-6"
  >

    {/* General Info */}
    <div className="grid md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Challan Number</label>
        <input
          type="text"
          name="challanNumber"
          value={formData.challanNumber}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          readOnly
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Order Date</label>
        <input
          type="date"
          name="orderDate"
          value={formData.orderDate}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Dispatch Date</label>
        <input
          type="date"
          name="dispatchDate"
          value={formData.dispatchDate}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Challan Date</label>
        <input
          type="date"
          name="challanDate"
          value={formData.challanDate}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Reference No</label>
        <input
          type="text"
          name="referenceNo"
          value={formData.referenceNo}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Reference No"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Challan Type</label>
        <select
          name="challanType"
          value={formData.challanType}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option>Job Work</option>
          <option>Supply</option>
          <option>Return</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Challan GSTIN</label>
        <input
          type="text"
          name="challanGSTIN"
          value={formData.challanGSTIN}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Challan GSTIN"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Place of Supply</label>
        <input
          type="text"
          name="placeOfSupply"
          value={formData.placeOfSupply}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Place of Supply"
        />
      </div>
    </div>

    {/* Bill To */}
    <h3 className="font-semibold text-lg mt-6">Bill To</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Name</label>
        <textarea
          name="name"
          value={formData.billTo.name}
          onChange={handleBillToChange}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Address</label>
        <textarea
          name="address"
          value={formData.billTo.address}
          onChange={handleBillToChange}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Phone</label>
        <input
          name="phone"
          value={formData.billTo.phone}
          onChange={handleBillToChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="Phone"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">GSTIN</label>
        <input
          name="gstin"
          value={formData.billTo.gstin}
          onChange={handleBillToChange}
          className="border px-3 py-2 rounded w-full"
          placeholder="GSTIN"
        />
      </div>
    </div>

    {/* Items */}
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Items</h3>
      {formData.items.map((item, index) => (
        <div key={index} className="grid md:grid-cols-8 gap-2 items-end">
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <input
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="Description"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">HSN</label>
            <input
              name="hsn"
              value={item.hsn}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="HSN"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Qty</label>
            <input
              name="qty"
              type="number"
              value={item.qty}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="Qty"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={item.price}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="Price"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">CGST %</label>
            <input
              name="cgstRate"
              type="number"
              value={item.cgstRate}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="CGST"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">SGST %</label>
            <input
              name="sgstRate"
              type="number"
              value={item.sgstRate}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="SGST"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">IGST %</label>
            <input
              name="igstRate"
              type="number"
              value={item.igstRate}
              onChange={(e) => handleItemChange(index, e)}
              className="border px-3 py-2 rounded w-full"
              placeholder="IGST"
            />
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Item
      </button>
    </div>

    {/* Totals */}
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>Subtotal: ₹{totals.subTotal.toFixed(2)}</div>
      <div>Total Tax: ₹{totals.totalTax.toFixed(2)}</div>
      <div className="font-semibold text-green-700">
        Grand Total: ₹{totals.grandTotal}
      </div>
    </div>

    {/* Notes */}
    <div>
      <label className="text-sm font-medium block mb-1">Notes (optional)</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        className="border px-3 py-2 rounded w-full"
        placeholder="Additional Notes"
      />
    </div>

    {/* Submit Buttons */}
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit DC
      </button>
    </div>
  </form>
);
}

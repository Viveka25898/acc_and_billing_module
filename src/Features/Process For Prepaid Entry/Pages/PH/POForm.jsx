/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import POSummary from "./PoSummery";


export default function POForm({ onSubmit, onCancel, initialItems = [], initialRequestData = {},isSubmitted }) {
  const generatePONumber = () => {
    return `PO-${Date.now()}`;
  };

  const [formData, setFormData] = useState({
    supplierName: "",
    supplierAddress: "",
    supplierGST: "",
    supplierContact: "",
    supplierEmail: "",
    supplierCode: "",
    poNumber: generatePONumber(),
    poDate: new Date().toISOString().slice(0, 10),
    expiryDays: 7,
    billTo: initialRequestData.site || "",
    shipTo: initialRequestData.site || "",
    paymentDateTerm: "7 days from date of delivery",
    paymentTerm: "100% against invoice",
    discount: 0,
    items: initialItems.length > 0 ? initialItems : [
      {
        productCode: initialRequestData.productCode || "",
        productName: initialRequestData.uniformType || "",
        hsnCode: initialRequestData.hsnCode || "",
        quantity: initialRequestData.quantity || 1,
        units: "nos",
        rate: initialRequestData.rate || initialRequestData.cost || 0,
        tax: 5,
      },
    ],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name === "quantity" || name === "rate" || name === "tax" ? Number(value) : value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          productCode: "",
          productName: "",
          hsnCode: "",
          quantity: 1,
          units: "",
          rate: 0,
          tax: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const filtered = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: filtered });
  };

  const calculateTotal = () => {
    let total = 0;
    formData.items.forEach((item) => {
      const itemTotal = item.quantity * item.rate;
      const taxAmount = (itemTotal * item.tax) / 100;
      total += itemTotal + taxAmount;
    });
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!formData.poNumber || formData.items.length === 0) {
        toast.error("Fill all required fields");
        return;
      }
      const total = calculateTotal();
      const grandTotal = total - Number(formData.discount);
      onSubmit({ ...formData, total, grandTotal });
      toast.success("PO submitted");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const { items, discount } = formData;
  const total = calculateTotal();
  const grandTotal = total - Number(discount);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold">Purchase Order Form</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Supplier Name</label>
          <input name="supplierName" value={formData.supplierName} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier Code</label>
          <input name="supplierCode" value={formData.supplierCode} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier Address</label>
          <input name="supplierAddress" value={formData.supplierAddress} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GSTIN</label>
          <input name="supplierGST" value={formData.supplierGST} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input name="supplierContact" value={formData.supplierContact} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="supplierEmail" value={formData.supplierEmail} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PO Number</label>
          <input name="poNumber" value={formData.poNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PO Date</label>
          <input type="date" name="poDate" value={formData.poDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PO Expiry Days</label>
          <input name="expiryDays" type="number" value={formData.expiryDays} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bill To</label>
          <textarea name="billTo" value={formData.billTo} onChange={handleChange} className="w-full border px-3 py-2 rounded"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ship To</label>
          <textarea name="shipTo" value={formData.shipTo} onChange={handleChange} className="w-full border px-3 py-2 rounded"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Date Term</label>
          <input name="paymentDateTerm" value={formData.paymentDateTerm} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment Term</label>
          <input name="paymentTerm" value={formData.paymentTerm} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-medium">Items</h3>
        {items.map((item, index) => (
          <div key={index} className="grid md:grid-cols-8 gap-2 items-end">
            <div><label className="text-xs">Product Code</label><input name="productCode" value={item.productCode} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-xs">Product Name</label><input name="productName" value={item.productName} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-xs">HSN Code</label><input name="hsnCode" value={item.hsnCode} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-xs">Qty</label><input name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-xs">Units</label><input name="units" value={item.units} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-xs">Rate</label><input name="rate" type="number" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <div><label className="text-xs">Tax %</label><input name="tax" type="number" value={item.tax} onChange={(e) => handleItemChange(index, e)} className="w-full border px-2 py-1 rounded" /></div>
            <button type="button" onClick={() => removeItem(index)} className="text-red-500">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="bg-blue-500 text-white px-3 py-1 rounded">Add Item</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <input name="discount" type="number" value={discount} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="text-sm font-medium">Total: ₹{total}</div>
        <div className="text-sm font-semibold text-green-600">Grand Total: ₹{grandTotal}</div>
      </div>

      <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    Cancel
                </button>

                {!isSubmitted && (
                    <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                    Submit
                    </button>
                )}
                </div>

    </form>
  );
}

/* eslint-disable no-unused-vars */
// File: src/features/vendor/components/VendorInvoiceForm.jsx

import React, { useState,useRef } from "react";
import { toast } from "react-toastify";

// Dummy POs assigned to the vendor
const dummyPOs = [
  {
    poNumber: "PO001",
    items: [
      { itemName: "Shirt", qty: 10, price: 200 },
      { itemName: "Pant", qty: 5, price: 300 },
    ],
  },
  {
    poNumber: "PO002",
    items: [
      { itemName: "Cap", qty: 20, price: 50 },
    ],
  },
];

export default function VendorInvoiceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    invoiceDate: "",
    invoiceNumber: "",
    requesterName: "",
    companyName: "Dummy Supplier Pvt Ltd",
    address: "123 Dummy Street",
    cityStateZip: "Mumbai, MH 400001",
    phone: "9876543210",
    email: "dummy@supplier.com",
    dcFile: null,
    billTo: { contactName: "", clientCompany: "", address: "", phone: "", email: "" },
    shipTo: { nameOrDept: "", clientCompany: "", address: "", phone: "" },
    fromDate: "",
    toDate: "",
    items: [],
    remarks: "",
    discount: "",
    taxRate: "",
    shipping: "",
  });
  const dcFileInputRef = useRef(null);
  const poSelectRef = useRef(null); // for resetting the PO dropdown


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "dcFile") {
      setFormData((prev) => ({ ...prev, dcFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
  const items = [...formData.items];

  items[index][field] = value;

  const qty = parseFloat(items[index].qty) || 0;
  const price = parseFloat(items[index].price) || 0;

  items[index].total = (qty * price).toFixed(2);

  setFormData({ ...formData, items });
};



  // const addItem = () => {
  //   setFormData({
  //     ...formData,
  //     items: [...formData.items, { po: "", itemName: "", qty: 1, price: 0, total: 0 }],
  //   });
  // };

  // const removeItem = (index) => {
  //   const items = formData.items.filter((_, i) => i !== index);
  //   setFormData({ ...formData, items });
  // };

  const handlePOSelection = (poNumber) => {
    const selectedPO = dummyPOs.find((po) => po.poNumber === poNumber);
    if (!selectedPO) return;

    const newItems = selectedPO.items.map((item) => ({
      po: poNumber,
      itemName: item.itemName,
      qty: item.qty,
      price: item.price,
      total: (item.qty * item.price).toFixed(2),
    }));

    setFormData((prev) => ({ ...prev, items: [...prev.items, ...newItems] }));
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalTax = ((subtotal - formData.discount) * formData.taxRate) / 100;
  const grandTotal = subtotal - formData.discount + totalTax + parseFloat(formData.shipping);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (onSubmit) onSubmit(formData);

  // Clear file input manually
  if (dcFileInputRef.current) {
    dcFileInputRef.current.value = "";
  }

  if (poSelectRef.current) {
  poSelectRef.current.value = ""; // Clear PO dropdown manually
}

  // Reset form data
  setFormData({
    invoiceDate: "",
    invoiceNumber: "",
    requesterName: "",
    companyName: "Dummy Supplier Pvt Ltd",
    address: "123 Dummy Street",
    cityStateZip: "Mumbai, MH 400001",
    phone: "9876543210",
    email: "dummy@supplier.com",
    dcFile: null,
    billTo: {
      contactName: "",
      clientCompany: "",
      address: "",
      phone: "",
      email: "",
    },
    shipTo: {
      nameOrDept: "",
      clientCompany: "",
      address: "",
      phone: "",
    },
    items: [],
    remarks: "",
    discount: 0,
    taxRate: 0,
    shipping: 0,
  });
};


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Requester <span className="text-red-500">*</span></label>
          <input type="text" name="requesterName" value={formData.requesterName} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Date <span className="text-red-500">*</span></label>
          <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Number <span className="text-red-500">*</span></label>
          <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier Details</label>
          <div className="border px-3 py-2 rounded bg-gray-50">
            <p className="text-sm font-medium">{formData.companyName}</p>
            <p className="text-sm">{formData.address}</p>
            <p className="text-sm">{formData.cityStateZip}</p>
            <p className="text-sm">{formData.phone}</p>
            <p className="text-sm">{formData.email}</p>
          </div>
        </div>
      </div>

     

      {/* Bill To */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Bill To</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Contact Name" value={formData.billTo.contactName} onChange={(e) => handleNestedChange("billTo", "contactName", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Client Company Name" value={formData.billTo.clientCompany} onChange={(e) => handleNestedChange("billTo", "clientCompany", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Address" value={formData.billTo.address} onChange={(e) => handleNestedChange("billTo", "address", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Phone" value={formData.billTo.phone} onChange={(e) => handleNestedChange("billTo", "phone", e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
      </div>

      {/* Ship To */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Ship To</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name / Dept" value={formData.shipTo.nameOrDept} onChange={(e) => handleNestedChange("shipTo", "nameOrDept", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Client Company Name" value={formData.shipTo.clientCompany} onChange={(e) => handleNestedChange("shipTo", "clientCompany", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Address" value={formData.shipTo.address} onChange={(e) => handleNestedChange("shipTo", "address", e.target.value)} className="border px-3 py-2 rounded w-full" />
          <input type="text" placeholder="Phone" value={formData.shipTo.phone} onChange={(e) => handleNestedChange("shipTo", "phone", e.target.value)} className="border px-3 py-2 rounded w-full" />
        </div>
      </div>


      {/* From Date To Date  */}

       <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>
      </div>


      {/* PO & Items */}
     <div>
        <h2 className="text-lg font-semibold mb-2">Add Items by PO</h2>
        <select onChange={(e) => handlePOSelection(e.target.value)}  ref={poSelectRef} className="border px-3 py-2 rounded w-full mb-4">
          <option value="">Select PO</option>
          {dummyPOs.map((po) => (
            <option key={po.poNumber} value={po.poNumber}>{po.poNumber}</option>
          ))}
        </select>

        {formData.items.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-1 text-sm font-medium">
            <span>Sr No</span>
            <span>PO</span>
            <span>Item Name</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>
        )}

        {formData.items.map((item, index) => (
          <div key={index} className="grid md:grid-cols-5 gap-2 items-end mb-2">
            <input type="text" value={index + 1} className="border px-3 py-2 rounded text-center bg-gray-100" disabled />
            <input type="text" value={item.po} className="border px-3 py-2 rounded bg-gray-100" disabled />
            <input type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => handleItemChange(index, "itemName", e.target.value)} className="border px-3 py-2 rounded" />
            <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} className="border px-3 py-2 rounded" />
            <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} className="border px-3 py-2 rounded" />
          </div>
        ))}
      </div>

       {/* DC Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Upload Delivery Challan (DC) <span className="text-red-500">*</span></label>
        <input type="file" 
            name="dcFile" 
            accept=".pdf,.jpg,.png" 
            onChange={handleChange} 
             ref={dcFileInputRef}
            className="w-full border px-3 py-2 rounded" required />
      </div>

      {/* Remarks & Totals */}
      <div className="grid md:grid-cols-2 gap-4">
        <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks / Payment Instructions" className="border px-3 py-2 rounded w-full" />
        <div className="space-y-2">
          <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount" className="border px-3 py-2 rounded w-full" />
          <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} placeholder="Tax Rate (%)" className="border px-3 py-2 rounded w-full" />
          <input type="number" name="shipping" value={formData.shipping} onChange={handleChange} placeholder="Shipping / Handling" className="border px-3 py-2 rounded w-full" />
        </div>
      </div>

      <div className="text-sm mt-4 space-y-1">
        <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
        <p><strong>Subtotal Less Discount:</strong> ₹{(subtotal - formData.discount).toFixed(2)}</p>
        <p><strong>Tax Amount:</strong> ₹{totalTax.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₹{parseFloat(formData.shipping).toFixed(2)}</p>
        <p className="text-green-700 font-semibold text-lg"><strong>Balance Due:</strong> ₹{grandTotal.toFixed(2)}</p>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Submit Invoice</button>
      </div>
    </form>
  );
}

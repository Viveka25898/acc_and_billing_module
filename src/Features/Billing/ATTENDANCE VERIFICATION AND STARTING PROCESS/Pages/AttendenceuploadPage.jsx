
import React, { useState,useMemo } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AttendanceUpload from "../Components/AttendenceUpload";

export default function AttendanceUploadPage() {
  const [form, setForm] = useState({
    client: "",
    site: "",
    month: "",
    file: null,
  });

  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [resetKey, setResetKey] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trim() }));
  };

 const handleFileUpload = (data) => {
  if (!Array.isArray(data)) {
    setParsedData([]);
    return;
  }
  setForm((prev) => ({ ...prev, file: data }));
  setParsedData(data);
  console.log("Parsed Rows:", data.length, data);

  setPage(1);
};

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(parsedData.length / ITEMS_PER_PAGE));
  }, [parsedData,ITEMS_PER_PAGE]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return parsedData.slice(start, end);
  }, [parsedData, page]);

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!form.client || !form.site || !form.month || !form.file || !Array.isArray(form.file) || form.file.length === 0) {
    setError("All fields are required including valid PDF upload with data.");
    return;
  }
  setError("");

  console.log("Submitting Attendance Upload:", form);

  // Reset form and data
  setForm({ client: "", site: "", month: "", file: null });
  setParsedData([]);
  setResetKey((prev) => !prev);
  toast.success("Attendance uploaded successfully!");
};

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Attendance Upload Form</h2>
        <button
          className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
          onClick={() => navigate("/dashboard/operation-executive/my-uploaded-attendence")}
          aria-label="View uploaded attendance"
        >
          My Uploaded Attendance
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="client">
              Client Name
            </label>
            <input
              type="text"
              name="client"
              id="client"
              value={form.client}
              onChange={handleChange}
              placeholder="Enter client name"
              maxLength={100}
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="site">
              Site Name
            </label>
            <input
              type="text"
              name="site"
              id="site"
              value={form.site}
              onChange={handleChange}
              placeholder="Enter site name"
              maxLength={100}
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="month">
              Month
            </label>
            <input
              type="month"
              name="month"
              id="month"
              value={form.month}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <AttendanceUpload onUpload={handleFileUpload} resetTrigger={resetKey} />

        {error && <p className="text-red-600 text-sm">{error}</p>}

                {parsedData.length > 0 && (
  <div className="overflow-x-auto border rounded-md mt-4">
    <table className="min-w-full text-sm text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2">Employee Name</th>
          <th className="px-4 py-2">Designation</th>
          <th className="px-4 py-2">Present Days</th>
          <th className="px-4 py-2">Week Offs</th>
          <th className="px-4 py-2">Holidays</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((row, index) => (
          <tr key={index} className="border-t">
            <td className="px-4 py-2">{row["Employee Name"] || "N/A"}</td>
            <td className="px-4 py-2">{row["Designation"] || "N/A"}</td>
            <td className="px-4 py-2">{row["Present Days"] || "N/A"}</td>
            <td className="px-4 py-2">{row["Week Offs"] || "N/A"}</td>
            <td className="px-4 py-2">{row["Holidays"] || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {totalPages > 1 && (
      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
         <button
  type="button"
  onClick={() => setPage((p) => Math.max(p - 1, 1))}
  disabled={page === 1}
  className="px-3 py-1 border rounded disabled:opacity-50"
>
  Prev
</button>

<button
  type="button"
  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
  disabled={page === totalPages}
  className="px-3 py-1 border rounded disabled:opacity-50"
>
  Next
</button>

        </div>
      </div>
    )}
  </div>
)}


        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition"
          aria-label="Submit attendance form"
        >
          <FaCloudUploadAlt /> Submit Attendance
        </button>
      </form>
    </div>
  );
}
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { FaCloudUploadAlt, FaFilePdf, FaTrashAlt } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function AttendanceUpload({ onUpload, resetTrigger }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef();

  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    if (file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
      setIsParsing(true);

      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          const text = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            text.push(pageText);
          }

          const parsedData = parseTableFromText(text.join(" "));
          onUpload(parsedData);
        };
        reader.onerror = () => setError("File reading failed.");
        reader.readAsArrayBuffer(file);
      } catch (err) {
        setError("Failed to parse PDF.");
      } finally {
        setIsParsing(false);
      }
    } else {
      setPdfFile(null);
      setError("Only PDF files are allowed.");
    }
  };

  const handleRemove = () => {
    setPdfFile(null);
    onUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (resetTrigger) {
      handleRemove();
    }
  }, [resetTrigger]);

  const parseTableFromText = (text) => {
  const data = [];

  const lines = text
    .replace(/\s+/g, " ")
    .replace(/Attendance Report/gi, "")
    .split(/(?= [A-Z][a-z]+\s[A-Z][a-z]+)/); // splits at names

  for (const line of lines) {
    const match = line.trim().match(
      /^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+([A-Za-z ]+?)\s+(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})$/
    );
    if (match) {
      const [, name, designation, present, weekOffs, holidays] = match;
      data.push({
        "Employee Name": name.trim(),
        Designation: designation.trim(),
        "Present Days": present.trim(),
        "Week Offs": weekOffs.trim(),
        Holidays: holidays.trim(),
      });
    }
  }

  return data;
};



  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        htmlFor="pdf-upload"
      >
        Upload Certified Attendance (PDF Only)
      </label>
      <div className="border border-dashed border-gray-400 p-3 rounded-md">
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handlePdfChange}
          ref={fileInputRef}
          className="text-sm w-full"
          aria-label="Upload certified attendance PDF"
        />
      </div>
      {isParsing && (
        <p className="text-blue-600 text-sm">Parsing PDF... Please wait.</p>
      )}
      {pdfFile && !isParsing && (
        <div className="flex items-center space-x-2 mt-2">
          <FaFilePdf className="text-red-600 text-xl" aria-hidden="true" />
          <span className="text-sm text-gray-700 truncate max-w-xs">
            {pdfFile.name}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
            title="Remove file"
            aria-label="Remove uploaded file"
          >
            <FaTrashAlt />
          </button>
        </div>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

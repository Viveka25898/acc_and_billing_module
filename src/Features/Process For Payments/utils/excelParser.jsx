// src/features/processPayments/utils/excelParser.js
import * as XLSX from "xlsx";

export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Optional: Validate required columns
        const requiredColumns = ["Vendor Name", "Invoice No", "Paid Amount"];
        const missingColumns = requiredColumns.filter(
          (col) => !Object.keys(jsonData[0] || {}).includes(col)
        );

        if (missingColumns.length > 0) {
          alert(`Missing required columns: ${missingColumns.join(", ")}`);
          reject([]);
        } else {
          resolve(jsonData);
        }
      } catch (error) {
        alert("Failed to parse the Excel file. Please check the format.");
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import * as XLSX from 'xlsx';

export const parseExcelCSV = async (file) => {
  try {
    console.log("Parsing Excel/CSV file...");

    if (!file) throw new Error("No file provided");

    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("File is empty");
    }

    const workbook = XLSX.read(arrayBuffer, { 
      type: 'array',
      cellDates: true,
      cellText: false,
      cellNF: false,
      sheetStubs: true
    });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("No worksheets found in the file");
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    if (!worksheet || !worksheet['!ref']) {
      throw new Error("Worksheet is empty");
    }

    let data;
    try {
      data = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: "",
        blankrows: false
      });
    } catch (e) {
      data = [];
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        let row = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          const cell = worksheet[cell_ref];
          row.push(cell ? cell.v : "");
        }
        data.push(row);
      }
    }

    if (!data || data.length === 0) throw new Error("No data found in worksheet");

    const nonEmptyRows = data.filter(row => 
      row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== "")
    );

    if (nonEmptyRows.length <= 1) throw new Error("No data rows found");

    // Get headers and normalize them
    const rawHeaders = nonEmptyRows[0];
    const headers = rawHeaders.map(header => {
      if (!header) return '';
      
      // More aggressive normalization to handle special characters like ■
      return header.toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\(\)■\[\]]/g, '_') // Replace spaces, parentheses, and special chars with underscore
        .replace(/[^\w]/g, '') // Remove any remaining non-alphanumeric characters
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    });

    console.log("Raw headers:", rawHeaders);
    console.log("Normalized headers:", headers);

    // Create column mapping
    const columnMapping = {};
    headers.forEach((header, index) => {
      // Date column mapping
      if (['date', 'transaction_date', 'value_date', 'txn_date', 'posting_date', 'dt'].includes(header)) {
        columnMapping.date = index;
      }
      // Description column mapping
      if (['description', 'particulars', 'transaction_description', 'narration', 'details', 'desc'].includes(header)) {
        columnMapping.description = index;
      }
      // Reference column mapping
      if (['reference', 'ref_no', 'ref_number', 'transaction_id', 'chq_no', 'cheque_no', 'ref'].includes(header)) {
        columnMapping.reference = index;
      }
      // Debit column mapping
      if (['debit', 'debit_amount', 'withdrawal', 'dr', 'debit_', 'withdrawl'].includes(header)) {
        columnMapping.debit = index;
      }
      // Credit column mapping
      if (['credit', 'credit_amount', 'deposit', 'cr', 'credit_', 'deposits'].includes(header)) {
        columnMapping.credit = index;
      }
      // Balance column mapping
      if (['balance', 'running_balance', 'account_balance', 'bal', 'balance_'].includes(header)) {
        columnMapping.balance = index;
      }
    });

    console.log("Column mapping:", columnMapping);

    const rows = nonEmptyRows.slice(1); // Skip header row

    // Helper function to clean and parse numbers
    const cleanNumber = (val) => {
      if (!val && val !== 0) return 0;
      
      if (typeof val === "number") return val;
      
      if (typeof val === "string") {
        // Remove currency symbols, commas, and other non-numeric characters except decimal point and negative sign
        const cleaned = val.replace(/[₹$£€,\s()]/g, "").trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      }
      
      return 0;
    };

    // Helper function to parse dates
    const parseDate = (dateValue) => {
      if (!dateValue) return null;
      
      // If it's already a Date object from Excel
      if (dateValue instanceof Date) {
        return isNaN(dateValue.getTime()) ? null : dateValue;
      }
      
      // If it's an Excel serial date number
      if (typeof dateValue === 'number' && dateValue > 25569) {
        const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
        return isNaN(excelDate.getTime()) ? null : excelDate;
      }
      
      // If it's a string, try to parse it
      if (typeof dateValue === 'string') {
        const trimmedDate = dateValue.trim();
        
        // Try direct parsing first
        let parsedDate = new Date(trimmedDate);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
        
        // Try DD/MM/YYYY format (common in Indian banking)
        const ddmmyyyyMatch = trimmedDate.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (ddmmyyyyMatch) {
          const [, day, month, year] = ddmmyyyyMatch;
          parsedDate = new Date(year, month - 1, day);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
          }
        }
      }
      
      return null;
    };

    // Process each row
    const processedRows = rows.map((row, rowIndex) => {
      const processedRow = {};
      
      // Process date
      if (columnMapping.date !== undefined) {
        processedRow.date = parseDate(row[columnMapping.date]);
      }
      
      // Process description
      if (columnMapping.description !== undefined) {
        processedRow.description = row[columnMapping.description]?.toString()?.trim() || '';
      }
      
      // Process reference
      if (columnMapping.reference !== undefined) {
        processedRow.ref_no = row[columnMapping.reference]?.toString()?.trim() || '';
      }
      
      // Process debit
      if (columnMapping.debit !== undefined) {
        const debitValue = cleanNumber(row[columnMapping.debit]);
        processedRow.debit_ = debitValue;
        processedRow.debit = debitValue; // Also set without underscore for compatibility
      }
      
      // Process credit
      if (columnMapping.credit !== undefined) {
        const creditValue = cleanNumber(row[columnMapping.credit]);
        processedRow.credit_ = creditValue;
        processedRow.credit = creditValue; // Also set without underscore for compatibility
      }
      
      // Process balance
      if (columnMapping.balance !== undefined) {
        const balanceValue = cleanNumber(row[columnMapping.balance]);
        processedRow.balance_ = balanceValue;
        processedRow.balance = balanceValue; // Also set without underscore for compatibility
      }

      return processedRow;
    }).filter(row => {
      // Filter out rows that don't have a valid date or any amount
      return row.date && ((row.debit && row.debit > 0) || (row.credit && row.credit > 0));
    });

    console.log("Sample processed data:", processedRows.slice(0, 3));
    console.log(`Total processed rows: ${processedRows.length}`);

    if (processedRows.length === 0) {
      throw new Error("No valid transaction rows found. Please check if the file has proper Date, Debit, and Credit columns.");
    }

    return processedRows;

  } catch (error) {
    console.error("Excel/CSV parsing error details:", error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};
/* eslint-disable no-unused-vars */
// src/utils/accountingHelpers.js

/**
 * Complete Accounting Helper Functions
 * For Employee Advance Module
 */

// ========================================
// 1. SITE MAPPING FUNCTIONS
// ========================================

/**
 * Get site code by employee ID (hardcoded mapping)
 */
export const getSiteByEmpId = (empId) => {
  const siteMap = {
    "1": "MH01",   // emp1 - Mumbai
    "2": "DL01",   // emp2 - Delhi
    "3": "BLR01",  // emp3 - Bangalore
    "4": "MH01",   // emp4 - Mumbai
    "5": "MH01",   // lm1 - Mumbai
    "6": "DL01",   // lm2 - Delhi
    "7": "BLR01",  // lm3 - Bangalore
    "8": "MH01",   // lm4 - Mumbai
    "9": "MH01",   // vp1 - Mumbai
    "10": "DL01",  // vp2 - Delhi
    "11": "MH01",  // ae1 - Mumbai
    "12": "MH01",  // oe1 - Mumbai
    "13": "DL01",  // oe2 - Delhi
    "14": "BLR01", // oe3 - Bangalore
    "15": "MH01"   // oe4 - Mumbai
  };
  return siteMap[empId] || "MH01"; // Default to Mumbai
};

// ========================================
// 2. VOUCHER NUMBER GENERATION
// ========================================

/**
 * Generate voucher number in format: PAY/SITE/YEAR/0001
 */
export const generateVoucherNumber = (site, year = new Date().getFullYear()) => {
  try {
    const counters = JSON.parse(localStorage.getItem('voucherCounters')) || {};
    const key = `PAY/${site}/${year}`;
    
    // Initialize counter if doesn't exist
    if (!counters[key]) {
      counters[key] = 0;
    }
    
    // Increment counter
    counters[key] += 1;
    
    // Generate voucher number with leading zeros (4 digits)
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
    
    // Save updated counter
    localStorage.setItem('voucherCounters', JSON.stringify(counters));
    
    return voucherNo;
  } catch (error) {
    console.error('Error generating voucher number:', error);
    return `PAY/${site}/${year}/ERROR`;
  }
};

// ========================================
// 3. EMPLOYEE LEDGER FUNCTIONS
// ========================================

/**
 * Check if employee ledger exists in Chart of Accounts
 */
export const checkEmployeeLedgerExists = (employeeId) => {
  try {
    const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
    const glCode = generateEmployeeGLCode(employeeId);
    
    console.log(`🔍 Checking if employee ledger exists: ${glCode}`);
    console.log('Available accounts:', chartOfAccounts.map(acc => acc.code));
    
    const exists = chartOfAccounts.some(acc => acc.code === glCode);
    console.log(`✅ Employee ledger ${glCode} exists: ${exists}`);
    
    return exists;
  } catch (error) {
    console.error('Error checking employee ledger:', error);
    return false;
  }
};


/**
 * Create employee ledger in Chart of Accounts
 */
//  Generate employee GL code that matches your COA structure
 
export const generateEmployeeGLCode = (employeeId, department) => {
  // Convert employeeId from "emp1" to "1" if needed
  let empId = employeeId;
  if (empId.startsWith('emp')) {
    empId = empId.replace('emp', '');
  }
  
  // Pad with zeros to 3 digits
  const paddedId = empId.padStart(3, '0');
  
  // Return in format: A3002-EMP-001 (matches your COA structure)
  return `A3002-EMP-${paddedId}`;
};
export const createEmployeeLedger = (empId, employeeName) => {
  try {
    const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
    const glCode = generateEmployeeGLCode(empId);
    
    console.log(`🔄 Creating employee ledger: ${glCode} for ${employeeName}`);
    
    // Check if already exists
    if (chartOfAccounts.some(acc => acc.code === glCode)) {
      console.log(`⚠️ Employee ledger ${glCode} already exists`);
      return glCode;
    }
    
    // Create new employee ledger that matches your COA structure
    const newLedger = {
      id: `EMP_${Date.now()}`,
      code: glCode,
      name: `EMP-${empId.padStart(3, '0')}`,
      type: "ACCOUNT",
      parentAccount: "LOANS & ADVANCES (ASSETS)",
      parentCode: "A3002"
    };
    
    chartOfAccounts.push(newLedger);
    localStorage.setItem('chartOfAccounts', JSON.stringify(chartOfAccounts));
    
    console.log(`✅ Created employee ledger: ${glCode} for ${employeeName}`);
    console.log('Updated COA:', chartOfAccounts);
    
    return glCode;
  } catch (error) {
    console.error('❌ Error creating employee ledger:', error);
    throw new Error(`Failed to create employee ledger for ${employeeName}`);
  }
};


/**
 * Get employee details from users localStorage
 */
export const getEmployeeDetails = (employeeId) => {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Handle both "emp1" and "1" formats
    let searchId = employeeId;
    if (employeeId.startsWith('emp')) {
      searchId = employeeId.replace('emp', '');
    }
    
    console.log(`🔍 Looking for employee: ${employeeId} (converted to: ${searchId})`);
    console.log('Available users:', users.map(u => ({ empId: u.empId, username: u.username })));
    
    // Try exact empId match first
    const employee = users.find(u => u.empId === searchId);
    
    if (employee) {
      console.log(`✅ Found employee:`, employee);
      return employee;
    }
    
    // Try username match (emp1, emp2, etc.)
    const employeeByUsername = users.find(u => u.username === employeeId);
    if (employeeByUsername) {
      console.log(`✅ Found employee by username:`, employeeByUsername);
      return employeeByUsername;
    }
    
    console.log(`❌ Employee not found for ID: ${employeeId}`);
    return null;
  } catch (error) {
    console.error('Error getting employee details:', error);
    return null;
  }
};

// ========================================
// 4. BANK FUNCTIONS
// ========================================

/**
 * Get bank details by bank code
 */
export const getBankDetails = (bankCode) => {
  try {
    const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
    return chartOfAccounts.find(acc => acc.code === bankCode) || null;
  } catch (error) {
    console.error('Error getting bank details:', error);
    return null;
  }
};

// ========================================
// 5. TRANSACTION POSTING FUNCTIONS
// ========================================

/**
 * Post transaction to localStorage
 */
export const postTransaction = (transactionData) => {
  try {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Add transaction ID and timestamp if not provided
    const transaction = {
      id: transactionData.id || `TXN_${Date.now()}`,
      ...transactionData,
      postedDate: new Date().toISOString(),
      status: 'Posted'
    };
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    console.log(`✅ Transaction posted: ${transaction.voucherNo}`);
    return transaction;
  } catch (error) {
    console.error('Error posting transaction:', error);
    throw new Error('Failed to post transaction');
  }
};

/**
 * Create transaction object for advance payment
 */
export const createAdvancePaymentTransaction = (advanceRequest, bankData, voucherNo) => {
  try {
    // Convert employeeId from "emp1" to "1" format if needed
    let employeeId = advanceRequest.employeeId;
    if (employeeId.startsWith('emp')) {
      employeeId = employeeId.replace('emp', '');
    }
    
    const employee = getEmployeeDetails(employeeId);
    const bank = getBankDetails(bankData.bankCode);
    const amount = parseFloat(advanceRequest.amount);
    
    const employeeGLCode = employee?.glCode || `A3002-EMP-${employeeId.padStart(3, '0')}`;
    const employeeName = employee?.fullName || advanceRequest.employeeName;
    const bankGLCode = bankData.bankCode;
    const bankName = bank?.name || bankData.bankName;
    
    const transaction = {
      id: `TXN_${Date.now()}`,
      voucherNo: voucherNo,
      voucherType: "Payment Voucher",
      date: advanceRequest.requestDate || new Date().toISOString().split('T')[0],
      advanceRequestId: advanceRequest.requestId,
      
      entries: [
        {
          lineNo: 1,
          glCode: employeeGLCode,
          glName: `Employee Advance - ${employeeName}`,
          debit: amount,
          credit: 0,
          narration: `Advance paid to ${employeeName} - ${Array.isArray(advanceRequest.reason) ? advanceRequest.reason.join(', ') : advanceRequest.reason}`,
          employeeId: employeeId, // Use converted employeeId
          costCenter: employee?.site || 'General'
        },
        {
          lineNo: 2,
          glCode: bankGLCode,
          glName: bankName,
          debit: 0,
          credit: amount,
          narration: `Payment from ${bankName}`,
          costCenter: 'HEAD OFFICE'
        }
      ],
      
      totalDebit: amount,
      totalCredit: amount,
      narration: `Advance payment to ${employeeName}`,
      approvedBy: advanceRequest.aeApprovedBy || 'ae1',
      approvedDate: advanceRequest.approvedAt || new Date().toISOString()
    };
    
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction object');
  }
};

/**
 * Create transaction object for MULTIPLE advance payments (BATCH)
 */
export const createBatchAdvancePaymentTransaction = (advanceRequests, bankData, voucherNo) => {
  try {
    const bank = getBankDetails(bankData.bankCode);
    const bankGLCode = bankData.bankCode;
    const bankName = bank?.name || bankData.bankName;
    
    let totalAmount = 0;
    const entries = [];
    let lineNo = 1;
    
    // Create debit entries for each employee
    advanceRequests.forEach((request) => {
      const employee = getEmployeeDetails(request.employeeId);
      const amount = parseFloat(request.amount);
      totalAmount += amount;
      
      const employeeGLCode = employee?.glCode || `A3002-EMP-${request.employeeId.padStart(3, '0')}`;
      const employeeName = employee?.fullName || request.employeeName;
      
      entries.push({
        lineNo: lineNo++,
        glCode: employeeGLCode,
        glName: `Employee Advance - ${employeeName}`,
        debit: amount,
        credit: 0,
        narration: `Advance paid to ${employeeName} - ${Array.isArray(request.reason) ? request.reason.join(', ') : request.reason}`,
        employeeId: request.employeeId,
        costCenter: employee?.site || 'General'
      });
    });
    
    // Single credit entry for bank (total amount)
    entries.push({
      lineNo: lineNo,
      glCode: bankGLCode,
      glName: bankName,
      debit: 0,
      credit: totalAmount,
      narration: `Batch payment to ${advanceRequests.length} employees via ${bankName}`,
      costCenter: 'HEAD OFFICE'
    });
    
    const transaction = {
      id: `TXN_${Date.now()}`,
      voucherNo: voucherNo,
      voucherType: "Payment Voucher - Batch",
      date: new Date().toISOString().split('T')[0],
      advanceRequestIds: advanceRequests.map(req => req.requestId),
      batchSize: advanceRequests.length,
      
      entries: entries,
      
      totalDebit: totalAmount,
      totalCredit: totalAmount,
      narration: `Batch advance payment to ${advanceRequests.length} employees`,
      approvedBy: advanceRequests[0].aeApprovedBy || 'ae1',
      approvedDate: advanceRequests[0].approvedAt || new Date().toISOString()
    };
    
    return transaction;
  } catch (error) {
    console.error('Error creating batch transaction:', error);
    throw new Error('Failed to create batch transaction object');
  }
};

// ========================================
// 6. LEDGER BALANCE FUNCTIONS
// ========================================

/**
 * Update ledger balances after posting transaction
 */
export const updateLedgerBalances = (entries) => {
  try {
    const balances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
    
    entries.forEach(entry => {
      if (!balances[entry.glCode]) {
        balances[entry.glCode] = {
          debit: 0,
          credit: 0,
          balance: 0
        };
      }
      
      balances[entry.glCode].debit += entry.debit;
      balances[entry.glCode].credit += entry.credit;
      balances[entry.glCode].balance = balances[entry.glCode].debit - balances[entry.glCode].credit;
    });
    
    localStorage.setItem('ledgerBalances', JSON.stringify(balances));
    console.log('✅ Ledger balances updated');
    return balances;
  } catch (error) {
    console.error('Error updating ledger balances:', error);
    throw new Error('Failed to update ledger balances');
  }
};

/**
 * Get balance for a specific GL code
 */
export const getLedgerBalance = (glCode) => {
  try {
    const balances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
    return balances[glCode] || { debit: 0, credit: 0, balance: 0 };
  } catch (error) {
    console.error('Error getting ledger balance:', error);
    return { debit: 0, credit: 0, balance: 0 };
  }
};

// ========================================
// 7. EMPLOYEE BALANCE UPDATE
// ========================================

/**
 * Update employee outstanding balance in users localStorage
 */
export const updateEmployeeOSBalance = (employeeId, newBalance) => {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.empId === employeeId);
    
    if (userIndex !== -1) {
      users[userIndex].osBalance = newBalance;
      localStorage.setItem('users', JSON.stringify(users));
      console.log(`✅ Updated osBalance for employee ${employeeId}: ₹${newBalance}`);
      return true;
    }
    
    console.warn(`⚠️ Employee ${employeeId} not found in users`);
    return false;
  } catch (error) {
    console.error('Error updating employee balance:', error);
    return false;
  }
};

// ========================================
// 8. VALIDATION FUNCTIONS
// ========================================

/**
 * Validate advance request before processing
 */
export const validateAdvanceRequest = (advanceRequest) => {
  const errors = [];
  
  if (!advanceRequest.employeeId) {
    errors.push('Employee ID is missing');
  }
  
  if (!advanceRequest.amount || parseFloat(advanceRequest.amount) <= 0) {
    errors.push('Invalid amount');
  }
  
  if (!advanceRequest.status || advanceRequest.status !== 'Approved') {
    errors.push('Request is not approved');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validate bank data
 */
export const validateBankData = (bankData) => {
  const errors = [];
  
  if (!bankData.bankCode) {
    errors.push('Bank code is missing');
  }
  
  if (!bankData.bankName) {
    errors.push('Bank name is missing');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// ========================================
// 9. COMPLETE ADVANCE APPROVAL PROCESS (SINGLE)
// ========================================

/**
 * Complete process for SINGLE advance approval
 * Creates ledger, generates voucher, posts transaction, updates balances
 */
export const processAdvanceApproval = (advanceRequest, bankData) => {
  try {
    console.log('🚀 STARTING SINGLE ADVANCE APPROVAL PROCESS...');
    console.log('📦 Request data:', advanceRequest);
    console.log('🏦 Bank data:', bankData);
    
    // 0. Validate inputs
    const requestValidation = validateAdvanceRequest(advanceRequest);
    if (!requestValidation.isValid) {
      throw new Error(`Invalid request: ${requestValidation.errors.join(', ')}`);
    }
    
    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }
    
    // 1. Get employee details
    const employee = getEmployeeDetails(advanceRequest.employeeId);
    if (!employee) {
      throw new Error(`Employee ${advanceRequest.employeeId} not found`);
    }
    
    console.log("✅ Found employee:", employee);
    
    // 2. Check and create employee ledger if needed
    const ledgerExists = checkEmployeeLedgerExists(employee.empId);
    if (!ledgerExists) {
      console.log(`📝 Creating employee ledger for ${employee.fullName}...`);
      createEmployeeLedger(employee.empId, employee.fullName);
    } else {
      console.log(`✅ Employee ledger already exists for ${employee.fullName}`);
    }
    
    // 3. Get employee GL code
    const employeeGLCode = generateEmployeeGLCode(employee.empId);
    
    // 4. Get employee site
    const site = employee.site || getSiteByEmpId(employee.empId);
    
    // 5. Generate voucher number
    const voucherNo = generateVoucherNumber(site);
    console.log(`🎫 Generated voucher: ${voucherNo}`);
    
    // 6. Create transaction object
    const transaction = createAdvancePaymentTransaction(advanceRequest, bankData, voucherNo);
    console.log('📋 Transaction created:', transaction);
    
    // 7. Post transaction
    const postedTransaction = postTransaction(transaction);
    
    // 8. Update ledger balances
    updateLedgerBalances(transaction.entries);
    
    // 9. Update employee OS balance
    const ledgerBalance = getLedgerBalance(employeeGLCode);
    updateEmployeeOSBalance(employee.empId, ledgerBalance.balance);
    
    console.log('✅ SINGLE ADVANCE APPROVAL PROCESS COMPLETED SUCCESSFULLY!');
    
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postedTransaction.id,
      employeeGLCode: employeeGLCode,
      bankGLCode: bankData.bankCode,
      amount: parseFloat(advanceRequest.amount),
      newBalance: ledgerBalance.balance,
      employeeName: employee.fullName,
      message: `Advance of ₹${parseFloat(advanceRequest.amount).toLocaleString()} processed successfully for ${employee.fullName}`
    };
    
  } catch (error) {
    console.error('❌ ERROR in processAdvanceApproval:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process advance: ${error.message}`
    };
  }
};

// ========================================
// 10. COMPLETE ADVANCE APPROVAL PROCESS (MULTIPLE/BATCH)
// ========================================

/**
 * Complete process for MULTIPLE advance approvals (BATCH)
 * Processes all requests in a single transaction
 */
export const processMultipleAdvanceApprovals = (advanceRequests, bankData) => {
  try {
    console.log(`🚀 Starting batch advance approval for ${advanceRequests.length} requests...`);
    
    // 0. Validate bank data
    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }
    
    // 1. Validate all requests
    const invalidRequests = [];
    advanceRequests.forEach((request, index) => {
      const validation = validateAdvanceRequest(request);
      if (!validation.isValid) {
        invalidRequests.push({ index, errors: validation.errors });
      }
    });
    
    if (invalidRequests.length > 0) {
      throw new Error(`${invalidRequests.length} invalid requests found`);
    }
    
    // 2. Create/check employee ledgers for all employees
    const employeeDetails = [];
    let totalAmount = 0;
    
    for (const request of advanceRequests) {
      const employee = getEmployeeDetails(request.employeeId);
      if (!employee) {
        throw new Error(`Employee ${request.employeeId} not found`);
      }
      
      employeeDetails.push(employee);
      totalAmount += parseFloat(request.amount);
      
      // Check and create ledger if needed
      const ledgerExists = checkEmployeeLedgerExists(request.employeeId);
      if (!ledgerExists) {
        console.log(`Creating employee ledger for ${employee.fullName}...`);
        createEmployeeLedger(request.employeeId, employee.fullName);
      }
    }
    
    // 3. Get site from first employee (batch is processed at site level)
    const firstEmployee = employeeDetails[0];
    const site = firstEmployee.site || getSiteByEmpId(advanceRequests[0].employeeId);
    
    // 4. Generate voucher number
    const voucherNo = generateVoucherNumber(site);
    console.log(`Generated batch voucher: ${voucherNo}`);
    
    // 5. Create batch transaction object
    const transaction = createBatchAdvancePaymentTransaction(advanceRequests, bankData, voucherNo);
    
    // 6. Post transaction
    const postedTransaction = postTransaction(transaction);
    
    // 7. Update ledger balances
    updateLedgerBalances(transaction.entries);
    
    // 8. Update OS balance for each employee
    const updatedEmployees = [];
    employeeDetails.forEach((employee, index) => {
      const employeeGLCode = employee.glCode || `A3002-EMP-${advanceRequests[index].employeeId.padStart(3, '0')}`;
      const ledgerBalance = getLedgerBalance(employeeGLCode);
      updateEmployeeOSBalance(advanceRequests[index].employeeId, ledgerBalance.balance);
      
      updatedEmployees.push({
        employeeId: advanceRequests[index].employeeId,
        employeeName: employee.fullName,
        amount: parseFloat(advanceRequests[index].amount),
        newBalance: ledgerBalance.balance
      });
    });
    
    console.log(`✅ Batch advance approval process completed for ${advanceRequests.length} requests!`);
    
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postedTransaction.id,
      batchSize: advanceRequests.length,
      totalAmount: totalAmount,
      bankGLCode: bankData.bankCode,
      employees: updatedEmployees,
      message: `Batch advance of ₹${totalAmount.toLocaleString()} processed successfully for ${advanceRequests.length} employees`
    };
    
  } catch (error) {
    console.error('❌ Error processing batch advance approval:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process batch advance: ${error.message}`
    };
  }
};

// ========================================
// 11. UTILITY FUNCTIONS
// ========================================

/**
 * Get all transactions from localStorage
 */
export const getAllTransactions = () => {
  try {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

/**
 * Get transactions by employee ID
 */
export const getTransactionsByEmployee = (employeeId) => {
  try {
    const transactions = getAllTransactions();
    return transactions.filter(txn => 
      txn.entries.some(entry => entry.employeeId === employeeId)
    );
  } catch (error) {
    console.error('Error getting employee transactions:', error);
    return [];
  }
};

/**
 * Get transactions by GL code
 */
export const getTransactionsByGLCode = (glCode) => {
  try {
    const transactions = getAllTransactions();
    return transactions.filter(txn => 
      txn.entries.some(entry => entry.glCode === glCode)
    );
  } catch (error) {
    console.error('Error getting GL transactions:', error);
    return [];
  }
};

/**
 * Get transactions by date range
 */
export const getTransactionsByDateRange = (fromDate, toDate) => {
  try {
    const transactions = getAllTransactions();
    return transactions.filter(txn => {
      const txnDate = new Date(txn.date);
      return txnDate >= new Date(fromDate) && txnDate <= new Date(toDate);
    });
  } catch (error) {
    console.error('Error getting transactions by date range:', error);
    return [];
  }
};

/**
 * Format amount for display
 */
export const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

// ========================================
// EXPORT ALL FUNCTIONS
// ========================================

export default {
  // Site functions
  getSiteByEmpId,
  
  // Voucher functions
  generateVoucherNumber,
  
  // Employee ledger functions
  checkEmployeeLedgerExists,
  createEmployeeLedger,
  getEmployeeDetails,
  
  // Bank functions
  getBankDetails,
  
  // Transaction functions
  postTransaction,
  createAdvancePaymentTransaction,
  createBatchAdvancePaymentTransaction,
  
  // Balance functions
  updateLedgerBalances,
  getLedgerBalance,
  updateEmployeeOSBalance,
  
  // Validation functions
  validateAdvanceRequest,
  validateBankData,
  
  // Main processing functions
  processAdvanceApproval,
  processMultipleAdvanceApprovals,
  
  // Utility functions
  getAllTransactions,
  getTransactionsByEmployee,
  getTransactionsByGLCode,
  getTransactionsByDateRange,
  formatAmount,
  formatDate
};
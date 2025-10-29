/* eslint-disable no-unused-vars */
// src/utils/accountingHelpers.js - PRODUCTION READY WITH BATCH FIX

/**
 * Complete Accounting Helper Functions
 * FIXED: Batch processing now creates individual transactions per employee
 */

const DEBUG = import.meta.env.MODE === 'development';

// ========================================
// 0. UTILITY FUNCTIONS
// ========================================

export const normalizeEmployeeId = (employeeId) => {
  if (!employeeId) return null;
  const id = String(employeeId);
  return id.startsWith('emp') ? id.replace('emp', '') : id;
};

export const generateEmployeeGLCode = (employeeId) => {
  const normalizedId = normalizeEmployeeId(employeeId);
  if (!normalizedId) return null;
  return `A3002-EMP-${normalizedId.padStart(3, '0')}`;
};

const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    return false;
  }
};

// ========================================
// 1. SITE MAPPING
// ========================================

export const getSiteByEmpId = (empId) => {
  const normalizedId = normalizeEmployeeId(empId);
  const siteMap = {
    "1": "MH01", "2": "DL01", "3": "BLR01", "4": "MH01",
    "5": "MH01", "6": "DL01", "7": "BLR01", "8": "MH01",
    "9": "MH01", "10": "DL01", "11": "MH01", "12": "MH01",
    "13": "DL01", "14": "BLR01", "15": "MH01"
  };
  return siteMap[normalizedId] || "MH01";
};

// ========================================
// 2. VOUCHER NUMBER GENERATION
// ========================================

export const generateVoucherNumber = (site, year = new Date().getFullYear()) => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const key = `PAY/${site}/${year}`;
    
    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
    
    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }
    
    if (DEBUG) console.log(`🎫 Generated voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating voucher:', error);
    throw new Error(`Failed to generate voucher: ${error.message}`);
  }
};

// ========================================
// 3. EMPLOYEE LEDGER FUNCTIONS
// ========================================

export const checkEmployeeLedgerExists = (employeeId) => {
  try {
    const normalizedId = normalizeEmployeeId(employeeId);
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    const glCode = generateEmployeeGLCode(normalizedId);
    return chartOfAccounts.some(acc => acc.code === glCode);
  } catch (error) {
    console.error('Error checking ledger:', error);
    return false;
  }
};

export const createEmployeeLedger = (empId, employeeName) => {
  try {
    const normalizedId = normalizeEmployeeId(empId);
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    const glCode = generateEmployeeGLCode(normalizedId);
    
    if (chartOfAccounts.some(acc => acc.code === glCode)) {
      if (DEBUG) console.log(`⚠️ Ledger ${glCode} already exists`);
      return glCode;
    }
    
    const newLedger = {
      id: `EMP_${Date.now()}_${normalizedId}`,
      code: glCode,
      name: `EMP-${normalizedId.padStart(3, '0')}`,
      type: "ACCOUNT",
      parentAccount: "LOANS & ADVANCES (ASSETS)",
      parentCode: "A3002"
    };
    
    chartOfAccounts.push(newLedger);
    
    if (!safeSetItem('chartOfAccounts', chartOfAccounts)) {
      throw new Error('Failed to save chart of accounts');
    }
    
    console.log(`✅ Created employee ledger: ${glCode} for ${employeeName}`);
    return glCode;
  } catch (error) {
    console.error('❌ Error creating employee ledger:', error);
    throw new Error(`Failed to create employee ledger: ${error.message}`);
  }
};

export const getEmployeeDetails = (employeeId) => {
  try {
    const normalizedId = normalizeEmployeeId(employeeId);
    const users = safeGetItem('users', []);
    
    const employee = users.find(u => u.empId === normalizedId);
    if (employee) return employee;
    
    const employeeByUsername = users.find(u => u.username === employeeId);
    if (employeeByUsername) return employeeByUsername;
    
    console.warn(`⚠️ Employee not found: ${employeeId}`);
    return null;
  } catch (error) {
    console.error('Error getting employee details:', error);
    return null;
  }
};

// ========================================
// 4. BANK FUNCTIONS
// ========================================

export const getBankDetails = (bankCode) => {
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    return chartOfAccounts.find(acc => acc.code === bankCode) || null;
  } catch (error) {
    console.error('Error getting bank details:', error);
    return null;
  }
};

// ========================================
// 5. VALIDATION FUNCTIONS
// ========================================

export const validateAdvanceRequest = (advanceRequest) => {
  const errors = [];
  
  if (!advanceRequest.employeeId) errors.push('Employee ID is missing');
  if (!advanceRequest.amount || parseFloat(advanceRequest.amount) <= 0) errors.push('Invalid amount');
  if (!advanceRequest.status || advanceRequest.status !== 'Approved') errors.push('Request is not approved');
  
  return { isValid: errors.length === 0, errors };
};

export const validateBankData = (bankData) => {
  const errors = [];
  
  if (!bankData.bankCode) errors.push('Bank code is missing');
  if (!bankData.bankName) errors.push('Bank name is missing');
  
  return { isValid: errors.length === 0, errors };
};

export const validateTransaction = (transaction) => {
  const errors = [];
  
  const totalDebit = transaction.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = transaction.entries.reduce((sum, e) => sum + (e.credit || 0), 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    errors.push(`Unbalanced: Dr ₹${totalDebit.toFixed(2)} ≠ Cr ₹${totalCredit.toFixed(2)}`);
  }
  
  const chartOfAccounts = safeGetItem('chartOfAccounts', []);
  transaction.entries.forEach(entry => {
    const glExists = chartOfAccounts.some(acc => acc.code === entry.glCode);
    if (!glExists) errors.push(`GL Code ${entry.glCode} not found`);
  });
  
  transaction.entries.forEach(entry => {
    if (entry.debit < 0 || entry.credit < 0) {
      errors.push(`Negative amounts not allowed: ${entry.glCode}`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
};

// ========================================
// 6. TRANSACTION POSTING
// ========================================

export const postTransaction = (transactionData) => {
  try {
    const validation = validateTransaction(transactionData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    const transactions = safeGetItem('transactions', []);
    
    const transaction = {
      id: transactionData.id || `TXN_${Date.now()}`,
      ...transactionData,
      postedDate: new Date().toISOString(),
      status: 'Posted'
    };
    
    transactions.push(transaction);
    
    if (!safeSetItem('transactions', transactions)) {
      throw new Error('Failed to save transaction');
    }
    
    console.log(`✅ Transaction posted: ${transaction.voucherNo}`);
    return { success: true, transaction };
  } catch (error) {
    console.error('❌ Error posting transaction:', error);
    return { success: false, error: error.message };
  }
};

export const createAdvancePaymentTransaction = (advanceRequest, bankData, voucherNo) => {
  try {
    const normalizedId = normalizeEmployeeId(advanceRequest.employeeId);
    const employee = getEmployeeDetails(normalizedId);
    const bank = getBankDetails(bankData.bankCode);
    const amount = parseFloat(advanceRequest.amount);
    
    if (!employee) throw new Error(`Employee ${advanceRequest.employeeId} not found`);
    
    const employeeGLCode = generateEmployeeGLCode(normalizedId);
    const employeeName = employee.fullName || advanceRequest.employeeName;
    const bankGLCode = bankData.bankCode;
    const bankName = bank?.name || bankData.bankName;
    
    return {
      id: `TXN_${Date.now()}_${normalizedId}`,
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
          employeeId: normalizedId,
          costCenter: employee.site || 'General'
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
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

// ========================================
// 7. LEDGER BALANCE FUNCTIONS
// ========================================

export const updateLedgerBalances = (entries) => {
  try {
    const balances = safeGetItem('ledgerBalances', {});
    
    entries.forEach(entry => {
      if (!balances[entry.glCode]) {
        balances[entry.glCode] = { debit: 0, credit: 0, balance: 0 };
      }
      
      balances[entry.glCode].debit += entry.debit;
      balances[entry.glCode].credit += entry.credit;
      balances[entry.glCode].balance = balances[entry.glCode].debit - balances[entry.glCode].credit;
    });
    
    if (!safeSetItem('ledgerBalances', balances)) {
      throw new Error('Failed to save ledger balances');
    }
    
    console.log('✅ Ledger balances updated');
    return balances;
  } catch (error) {
    console.error('❌ Error updating ledger balances:', error);
    throw new Error(`Failed to update ledger balances: ${error.message}`);
  }
};

export const getLedgerBalance = (glCode) => {
  try {
    const balances = safeGetItem('ledgerBalances', {});
    return balances[glCode] || { debit: 0, credit: 0, balance: 0 };
  } catch (error) {
    console.error('Error getting ledger balance:', error);
    return { debit: 0, credit: 0, balance: 0 };
  }
};

export const updateEmployeeOSBalance = (employeeId, newBalance) => {
  try {
    const normalizedId = normalizeEmployeeId(employeeId);
    const users = safeGetItem('users', []);
    const userIndex = users.findIndex(u => u.empId === normalizedId);
    
    if (userIndex !== -1) {
      users[userIndex].osBalance = newBalance;
      
      if (!safeSetItem('users', users)) {
        throw new Error('Failed to save user data');
      }
      
      console.log(`✅ Updated osBalance for employee ${normalizedId}: ₹${newBalance}`);
      return true;
    }
    
    console.warn(`⚠️ Employee ${normalizedId} not found in users`);
    return false;
  } catch (error) {
    console.error('Error updating employee balance:', error);
    return false;
  }
};

// ========================================
// 8. MAIN PROCESSING - SINGLE APPROVAL
// ========================================

export const processAdvanceApproval = (advanceRequest, bankData) => {
  try {
    if (DEBUG) console.log('🚀 Starting advance approval...');
    
    // Validate inputs
    const requestValidation = validateAdvanceRequest(advanceRequest);
    if (!requestValidation.isValid) {
      throw new Error(`Invalid request: ${requestValidation.errors.join(', ')}`);
    }
    
    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }
    
    // Get employee details
    const normalizedId = normalizeEmployeeId(advanceRequest.employeeId);
    const employee = getEmployeeDetails(normalizedId);
    if (!employee) throw new Error(`Employee ${advanceRequest.employeeId} not found`);
    
    if (DEBUG) console.log("✅ Found employee:", employee.fullName);
    
    // Check/create employee ledger
    const ledgerExists = checkEmployeeLedgerExists(normalizedId);
    if (!ledgerExists) {
      if (DEBUG) console.log(`📝 Creating ledger for ${employee.fullName}...`);
      createEmployeeLedger(normalizedId, employee.fullName);
    }
    
    const employeeGLCode = generateEmployeeGLCode(normalizedId);
    const site = employee.site || getSiteByEmpId(normalizedId);
    const voucherNo = generateVoucherNumber(site);
    
    // Create and post transaction
    const transaction = createAdvancePaymentTransaction(advanceRequest, bankData, voucherNo);
    const postResult = postTransaction(transaction);
    
    if (!postResult.success) {
      throw new Error(postResult.error);
    }
    
    // Update balances
    updateLedgerBalances(transaction.entries);
    const ledgerBalance = getLedgerBalance(employeeGLCode);
    updateEmployeeOSBalance(normalizedId, ledgerBalance.balance);
    
    console.log('✅ Advance approval completed!');
    
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      employeeGLCode: employeeGLCode,
      bankGLCode: bankData.bankCode,
      amount: parseFloat(advanceRequest.amount),
      newBalance: ledgerBalance.balance,
      employeeName: employee.fullName,
      message: `Advance of ₹${parseFloat(advanceRequest.amount).toLocaleString()} processed for ${employee.fullName}`
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
// 9. MAIN PROCESSING - BATCH APPROVAL (FIXED!)
// ========================================

/**
 * 🔧 FIXED: Now creates INDIVIDUAL transactions for each employee
 * Each employee gets their own voucher number and transaction entry
 */
export const processMultipleAdvanceApprovals = (advanceRequests, bankData) => {
  try {
    if (DEBUG) console.log(`🚀 Starting batch approval for ${advanceRequests.length} requests...`);
    
    // Validate bank data
    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }
    
    const results = [];
    let totalAmount = 0;
    let successCount = 0;
    let failureCount = 0;
    
    // 🔧 FIX: Process each request INDIVIDUALLY
    for (let i = 0; i < advanceRequests.length; i++) {
      const request = advanceRequests[i];
      
      try {
        console.log(`\n📝 Processing request ${i + 1}/${advanceRequests.length}...`);
        
        // Process this single request
        const result = processAdvanceApproval(request, bankData);
        
        if (result.success) {
          results.push({
            employeeId: normalizeEmployeeId(request.employeeId),
            employeeName: result.employeeName,
            amount: result.amount,
            voucherNo: result.voucherNo,
            transactionId: result.transactionId,
            newBalance: result.newBalance,
            success: true
          });
          
          totalAmount += result.amount;
          successCount++;
          
          console.log(`✅ Request ${i + 1} processed successfully`);
        } else {
          results.push({
            employeeId: normalizeEmployeeId(request.employeeId),
            employeeName: request.employeeName,
            amount: parseFloat(request.amount),
            error: result.error,
            success: false
          });
          
          failureCount++;
          console.error(`❌ Request ${i + 1} failed: ${result.error}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing request ${i + 1}:`, error);
        results.push({
          employeeId: normalizeEmployeeId(request.employeeId),
          employeeName: request.employeeName,
          amount: parseFloat(request.amount),
          error: error.message,
          success: false
        });
        failureCount++;
      }
    }
    
    console.log(`\n✅ Batch processing complete: ${successCount} succeeded, ${failureCount} failed`);
    
    return {
      success: successCount > 0,
      batchSize: advanceRequests.length,
      successCount: successCount,
      failureCount: failureCount,
      totalAmount: totalAmount,
      bankGLCode: bankData.bankCode,
      employees: results,
      message: failureCount === 0 
        ? `All ${successCount} advances processed successfully (Total: ₹${totalAmount.toLocaleString()})`
        : `${successCount} of ${advanceRequests.length} advances processed. ${failureCount} failed.`
    };
    
  } catch (error) {
    console.error('❌ Error in batch approval:', error);
    return {
      success: false,
      error: error.message,
      message: `Batch processing failed: ${error.message}`
    };
  }
};

// ========================================
// 10. QUERY FUNCTIONS
// ========================================

export const getAllTransactions = () => safeGetItem('transactions', []);

export const getTransactionsByEmployee = (employeeId) => {
  const normalizedId = normalizeEmployeeId(employeeId);
  const transactions = getAllTransactions();
  return transactions.filter(txn => 
    txn.entries.some(entry => entry.employeeId === normalizedId)
  );
};

export const getTransactionsByGLCode = (glCode) => {
  const transactions = getAllTransactions();
  return transactions.filter(txn => 
    txn.entries.some(entry => entry.glCode === glCode)
  );
};

export const getTransactionsByDateRange = (fromDate, toDate) => {
  const transactions = getAllTransactions();
  return transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate >= new Date(fromDate) && txnDate <= new Date(toDate);
  });
};

// ========================================
// 11. FORMATTING FUNCTIONS
// ========================================

export const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

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

// Export all functions
export default {
  normalizeEmployeeId,
  generateEmployeeGLCode,
  getSiteByEmpId,
  generateVoucherNumber,
  checkEmployeeLedgerExists,
  createEmployeeLedger,
  getEmployeeDetails,
  getBankDetails,
  validateAdvanceRequest,
  validateBankData,
  validateTransaction,
  postTransaction,
  createAdvancePaymentTransaction,
  updateLedgerBalances,
  getLedgerBalance,
  updateEmployeeOSBalance,
  processAdvanceApproval,
  processMultipleAdvanceApprovals,
  getAllTransactions,
  getTransactionsByEmployee,
  getTransactionsByGLCode,
  getTransactionsByDateRange,
  formatAmount,
  formatDate
};
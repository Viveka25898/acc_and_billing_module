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

// 1. Add this helper function at the top of accountingHelpers.js
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

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
      date: getCurrentDate(), // ✅ FIXED: Always use current date for posting
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
      approvedDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

// ========================================
// 6A. CONVEYANCE APPROVAL TRANSACTION
// ========================================

/**
 * Resolve GL codes for Conveyance Expense and Payable from COA with safe fallbacks
 * Uses shared L2001001 Conveyance Payable (not per-employee)
 */
const resolveConveyanceGLs = () => {
  const chartOfAccounts = safeGetItem('chartOfAccounts', []);

  // Try to find specific Conveyance Expense under Expenses
  const expenseCandidates = [
    'X2001003', // Branch Conveyance Expense (primary - you mentioned created)
    'X2001004', // Branch Conveyance (if exists)
    'X2002001006', // Corporate Conveyance (if present)
    'X2001002', // Other Branch Expenses (fallback)
    'X2002002001' // Other Corporate Expenses (last resort)
  ];

  const payableCandidates = [
    'L2001001', // Conveyance Payable (shared for all employees)
    'L2001003', // Old code (if exists, will migrate)
    'L2001004'  // Other Employee Dues (fallback)
  ];

  const hasCode = (code) => chartOfAccounts.some(acc => acc.code === code);

  let expenseGLCode = expenseCandidates.find(hasCode);
  
  // Auto-create X2001003 if missing
  if (!expenseGLCode) {
    const newExpenseLedger = {
      id: `AUTO_${Date.now()}_X2001003`,
      code: 'X2001003',
      name: 'BRANCH CONVEYANCE EXPENSE',
      type: 'ACCOUNT',
      parentAccount: 'BRANCH MANAGEMENT',
      parentCode: 'X2001'
    };
    chartOfAccounts.push(newExpenseLedger);
    if (!safeSetItem('chartOfAccounts', chartOfAccounts)) {
      throw new Error('Failed to create Branch Conveyance Expense ledger');
    }
    expenseGLCode = 'X2001003';
  }

  let payableGLCode = payableCandidates.find(hasCode);

  // Auto-create L2001001 Conveyance Payable if missing (shared for all employees)
  if (!payableGLCode) {
    const newPayableLedger = {
      id: `AUTO_${Date.now()}_L2001001`,
      code: 'L2001001',
      name: 'CONVEYANCE PAYABLE',
      type: 'ACCOUNT',
      parentAccount: 'LIABILITY - EMPLOYEES',
      parentCode: 'L2001'
    };
    chartOfAccounts.push(newPayableLedger);
    if (!safeSetItem('chartOfAccounts', chartOfAccounts)) {
      throw new Error('Failed to create Conveyance Payable ledger');
    }
    payableGLCode = 'L2001001';
  } else if (payableGLCode === 'L2001003') {
    // If old code exists, prefer L2001001 going forward
    // But still use L2001003 if L2001001 doesn't exist
    if (!hasCode('L2001001')) {
      // Create L2001001 for future use
      const newPayableLedger = {
        id: `AUTO_${Date.now()}_L2001001`,
        code: 'L2001001',
        name: 'CONVEYANCE PAYABLE',
        type: 'ACCOUNT',
        parentAccount: 'LIABILITY - EMPLOYEES',
        parentCode: 'L2001'
      };
      chartOfAccounts.push(newPayableLedger);
      if (safeSetItem('chartOfAccounts', chartOfAccounts)) {
        payableGLCode = 'L2001001';
      }
    } else {
      payableGLCode = 'L2001001';
    }
  }

  const getName = (code) => {
    const acc = chartOfAccounts.find(a => a.code === code);
    return acc?.name || code;
  };

  return {
    expense: { code: expenseGLCode, name: getName(expenseGLCode) },
    payable: { code: payableGLCode, name: getName(payableGLCode) }
  };
};

/**
 * Create conveyance expense transaction (Dr Expense, Cr Liability)
 */
export const createConveyanceExpenseTransaction = (claim, voucherNo) => {
  const employee = getEmployeeDetails(claim.employeeId);
  if (!employee) throw new Error(`Employee ${claim.employeeId} not found`);

  const { expense, payable } = resolveConveyanceGLs();
  const amount = parseFloat(claim.amount);

  return {
    id: `TXN_CONV_${Date.now()}_${claim.id}`,
    voucherNo: voucherNo,
    voucherType: 'Expense Voucher',
    date: getCurrentDate(), // ✅ FIXED: Use approval date, not claim date
    conveyanceClaimId: claim.id,
    entries: [
      {
        lineNo: 1,
        glCode: expense.code,
        glName: expense.name,
        debit: amount,
        credit: 0,
        narration: `Conveyance claim - ${employee.fullName}`,
        employeeId: employee.empId,
        costCenter: employee.site || 'General'
      },
      {
        lineNo: 2,
        glCode: payable.code,
        glName: payable.name,
        debit: 0,
        credit: amount,
        narration: `Conveyance payable - ${employee.fullName}`,
        employeeId: employee.empId,
        costCenter: employee.site || 'General'
      }
    ],
    totalDebit: amount,
    totalCredit: amount,
    narration: `Conveyance reimbursement for ${employee.fullName}`,
    approvedBy: claim.aeApprovedBy || 'ae1',
    approvedDate: new Date().toISOString()
  };
};

/**
 * Process Conveyance Approval: create voucher number, post transaction, update balances
 */
export const processConveyanceApproval = (claim) => {
  try {
    if (DEBUG) console.log('🚀 Processing conveyance approval...');

    const employee = getEmployeeDetails(claim.employeeId);
    if (!employee) throw new Error(`Employee ${claim.employeeId} not found`);

    // Note: We use shared L2001001 Conveyance Payable for all employees
    // No need to create per-employee ledgers like we do for advances

    const site = employee.site || getSiteByEmpId(employee.empId);
    // Reuse generic voucher generator; categorized under EXP for readability
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `EXP/CONV/${site}/${year}`;
    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    const transaction = createConveyanceExpenseTransaction(claim, voucherNo);
    const postResult = postTransaction(transaction);
    if (!postResult.success) throw new Error(postResult.error);

    updateLedgerBalances(transaction.entries);

    return {
      success: true,
      voucherNo,
      transactionId: postResult.transaction.id,
      amount: parseFloat(claim.amount),
      message: `Conveyance of ₹${parseFloat(claim.amount).toLocaleString()} posted`
    };
  } catch (error) {
    console.error('❌ ERROR in processConveyanceApproval:', error);
    return { success: false, error: error.message, message: error.message };
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

// ========================================
// 12. Advance Settlement
// ========================================

/**
 * Process advance settlement with proper GL entries
 */
export const processAdvanceSettlement = (settlement) => {
  try {
    console.log('🚀 Starting advance settlement processing...');
    
    // Validate settlement data
    if (!settlement.employeeGLCode) {
      throw new Error('Employee GL Code not found');
    }
    
    if (!settlement.expenseItems || settlement.expenseItems.length === 0) {
      throw new Error('No expense items found');
    }
    
    // Calculate total settlement amount
    const totalAmount = settlement.expenseItems.reduce((sum, item) => {
      return sum + (Number(item['Amount (₹)']) || 0);
    }, 0);
    
    if (totalAmount <= 0) {
      throw new Error('Invalid settlement amount');
    }
    
    // Get employee details
    const normalizedId = normalizeEmployeeId(settlement.employeeId);
    const employee = getEmployeeDetails(normalizedId);
    if (!employee) throw new Error(`Employee ${settlement.employeeId} not found`);
    
    // Get current O/S balance
    const currentBalance = getLedgerBalance(settlement.employeeGLCode).balance;
    const osBalanceBefore = settlement.osBalanceBefore || currentBalance;
    
    // Calculate new O/S balance
    const osBalanceAfter = osBalanceBefore - totalAmount;
    
    if (osBalanceAfter < 0) {
      throw new Error(`Settlement amount (₹${totalAmount}) exceeds O/S balance (₹${osBalanceBefore})`);
    }
    
    // Generate voucher number
    const site = employee.site || getSiteByEmpId(normalizedId);
    const voucherNo = generateSettlementVoucherNumber(site);
    
    // Create JV data for display
    const jvData = createSettlementJVData(settlement, employee, voucherNo, totalAmount, osBalanceBefore, osBalanceAfter);
    
    // Create and post transaction
    const transaction = createSettlementTransaction(settlement, employee, voucherNo, totalAmount);
    const postResult = postTransaction(transaction);
    
    if (!postResult.success) {
      throw new Error(postResult.error);
    }
    
    // Update ledger balances
    updateLedgerBalances(transaction.entries);
    
    // Update employee O/S balance
    updateEmployeeOSBalance(normalizedId, osBalanceAfter);
    
    console.log('✅ Advance settlement completed!');
    
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      jvData: jvData,
      settlementAmount: totalAmount,
      osBalanceBefore: osBalanceBefore,
      newOSBalance: osBalanceAfter,
      employeeName: employee.fullName,
      message: `Settlement of ₹${totalAmount.toLocaleString()} processed for ${employee.fullName}`
    };
    
  } catch (error) {
    console.error('❌ ERROR in processAdvanceSettlement:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process settlement: ${error.message}`
    };
  }
};

/**
 * Create settlement JV data for display
 */
const createSettlementJVData = (settlement, employee, voucherNo, totalAmount, osBalanceBefore, osBalanceAfter) => {
  // Map expense heads to proper GL codes
  const expenseGLMapping = {
  'Travel': 'X1001002001', // TRAVEL EXPENSE
  'Food & Refreshments': 'X1001003001', // FOOD & REFRESHMENT
  'Accommodation': 'X1001002002', // ACCOMODATION
  'Other': 'X2002002001' // OTHER EXPENSE
};
  
  // Group expenses by expense head
  const expenseGroups = {};
  settlement.expenseItems.forEach(item => {
    const expenseHead = item['Expense Head'] || 'Other';
    const amount = Number(item['Amount (₹)']) || 0;
    
    if (!expenseGroups[expenseHead]) {
      expenseGroups[expenseHead] = 0;
    }
    expenseGroups[expenseHead] += amount;
  });
  
  // Create JV entries
  const entries = [];
  
  // Debit entries for each expense head
  Object.entries(expenseGroups).forEach(([expenseHead, amount]) => {
    const glCode = expenseGLMapping[expenseHead] || expenseGLMapping['Other'];
    const glName = getGLName(glCode) || expenseHead;
    
    entries.push({
      particulars: `${expenseHead} Expense`,
      glCode: glCode,
      debit: amount,
      credit: 0,
      narration: `Settlement for ${expenseHead}`
    });
  });
  
  // Credit entry for employee advance
  entries.push({
    particulars: `Employee Advance - ${employee.fullName}`,
    glCode: settlement.employeeGLCode,
    debit: 0,
    credit: totalAmount,
    narration: `Advance settlement`
  });
  
  return {
    header: {
      company: "Ismart",
      voucherNo: voucherNo,
      financialYear: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
      date: new Date().toISOString().split('T')[0],
      reference: `SETTLEMENT-${settlement.id.slice(-6)}`,
      preparedBy: "System"
    },
    entries: entries,
    narration: `Advance settlement for ${employee.fullName}. ${Object.entries(expenseGroups).map(([head, amt]) => `${head}: ₹${amt}`).join(', ')}`,
    approvals: {
      preparer: "System",
      reviewer: "Account Executive",
      approver: "System",
      date: new Date().toISOString().split('T')[0]
    },
    totals: {
      debit: totalAmount,
      credit: totalAmount
    },
    employeeInfo: {
      employeeName: employee.fullName,
      employeeId: employee.empId,
      designation: employee.designation,
      department: employee.department
    },
    balanceInfo: {
      osBalanceBefore: osBalanceBefore,
      settlementAmount: totalAmount,
      osBalanceAfter: osBalanceAfter
    }
  };
};

/**
 * Create settlement transaction for posting
 */
const createSettlementTransaction = (settlement, employee, voucherNo, totalAmount) => {
  const normalizedId = normalizeEmployeeId(settlement.employeeId);
  const employeeName = employee.fullName;
  
  const expenseGLMapping = {
    'Travel': 'X1001002001',
    'Food & Refreshments': 'X1001003001',
    'Accommodation': 'X1001002002',
    'Other': 'X2002002001'
  };
  
  // Group expenses by expense head
  const expenseGroups = {};
  settlement.expenseItems.forEach(item => {
    const expenseHead = item['Expense Head'] || 'Other';
    const amount = Number(item['Amount (₹)']) || 0;
    
    if (!expenseGroups[expenseHead]) {
      expenseGroups[expenseHead] = 0;
    }
    expenseGroups[expenseHead] += amount;
  });
  
  // Create transaction entries
  const entries = [];
  let lineNo = 1;
  
  // Debit entries for each expense head
  Object.entries(expenseGroups).forEach(([expenseHead, amount]) => {
    const glCode = expenseGLMapping[expenseHead] || expenseGLMapping['Other'];
    const glName = getGLName(glCode) || expenseHead;
    
    entries.push({
      lineNo: lineNo++,
      glCode: glCode,
      glName: glName,
      debit: amount,
      credit: 0,
      narration: `${expenseHead} expense settlement - ${employeeName}`,
      employeeId: normalizedId,
      costCenter: employee.site || 'General'
    });
  });
  
  // Credit entry for employee advance
  entries.push({
    lineNo: lineNo,
    glCode: settlement.employeeGLCode,
    glName: `Employee Advance - ${employeeName}`,
    debit: 0,
    credit: totalAmount,
    narration: `Advance settlement for ${employeeName}`,
    employeeId: normalizedId,
    costCenter: employee.site || 'General'
  });
  
  return {
    id: `TXN_SETT_${Date.now()}_${normalizedId}`,
    voucherNo: voucherNo,
    voucherType: "Journal Voucher",
    date: getCurrentDate(), // ✅ FIXED: Use current approval date, not submission date
    settlementId: settlement.id,
    entries: entries,
    totalDebit: totalAmount,
    totalCredit: totalAmount,
    narration: `Advance settlement for ${employeeName} (Submitted: ${settlement.submittedAt || 'N/A'})`,
    approvedBy: "ae1",
    approvedDate: new Date().toISOString()
  };
};

/**
 * Helper function to get GL name from code
 */
const getGLName = (glCode) => {
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    const account = chartOfAccounts.find(acc => acc.code === glCode);
    return account?.name || null;
  } catch (error) {
    console.error('Error getting GL name:', error);
    return null;
  }
};

/**
 * Enhanced voucher number generation for settlements
 */
export const generateSettlementVoucherNumber = (site) => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `SETTLEMENT/${site}/${year}`;
    
    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
    
    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }
    
    if (DEBUG) console.log(`🎫 Generated settlement voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating settlement voucher:', error);
    throw new Error(`Failed to generate settlement voucher: ${error.message}`);
  }
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
// Add these functions to your existing accountingHelpers.js file

// ========================================
// RELIEVER PAYMENT FUNCTIONS
// ========================================

/**
 * Create reliever payment transaction (Dr Reliever Wages, Cr Bank)
 */
export const createRelieverPaymentTransaction = (relieverRequest, bankData, voucherNo) => {
  try {
    const amount = parseFloat(relieverRequest.amount);
    const bank = getBankDetails(bankData.bankCode);
    
    const relieverGLCode = 'X1001001003'; // Reliever Wages Expense
    const bankGLCode = bankData.bankCode;
    const bankName = bank?.name || bankData.bankName;
    
    // Get site from request or use default
    const site = relieverRequest.site || 'General';
    
    return {
      id: `TXN_REL_${Date.now()}_${relieverRequest.id}`,
      voucherNo: voucherNo,
      voucherType: "Payment Voucher",
      date: getCurrentDate(),
      relieverRequestId: relieverRequest.id,
      
      entries: [
        {
          lineNo: 1,
          glCode: relieverGLCode,
          glName: "RELIEVER WAGES",
          debit: amount,
          credit: 0,
          narration: `Reliever payment - ${relieverRequest.name} - ${relieverRequest.narration || 'Temporary staff coverage'}`,
          employeeId: relieverRequest.relieverId,
          costCenter: site,
          site: site,
          days: relieverRequest.days || 1,
          ratePerDay: relieverRequest.ratePerDay || amount
        },
        {
          lineNo: 2,
          glCode: bankGLCode,
          glName: bankName,
          debit: 0,
          credit: amount,
          narration: `Payment to ${relieverRequest.name} - Reliever`,
          costCenter: 'HEAD OFFICE'
        }
      ],
      
      totalDebit: amount,
      totalCredit: amount,
      narration: `Reliever payment to ${relieverRequest.name} for ${relieverRequest.days || 1} day(s)`,
      approvedBy: relieverRequest.aeApprovedBy || 'ae1',
      approvedDate: new Date().toISOString(),
      relieverDetails: {
        name: relieverRequest.name,
        replacedEmployee: relieverRequest.replacedEmployee,
        site: site,
        days: relieverRequest.days || 1,
        ratePerDay: relieverRequest.ratePerDay || amount
      }
    };
  } catch (error) {
    console.error('Error creating reliever transaction:', error);
    throw new Error(`Failed to create reliever transaction: ${error.message}`);
  }
};

/**
 * Process single reliever payment approval
 */
export const processRelieverPaymentApproval = (relieverRequest, bankData) => {
  try {
    if (DEBUG) console.log('🚀 Starting reliever payment approval...');
    
    // Validate inputs
    if (!relieverRequest.name) {
      throw new Error('Reliever name is required');
    }
    
    if (!relieverRequest.amount || parseFloat(relieverRequest.amount) <= 0) {
      throw new Error('Invalid payment amount');
    }
    
     const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }
    
    // Generate voucher number
    const site = relieverRequest.site || 'General';
    const voucherNo = generateRelieverVoucherNumber(site);
    
    // Create and post transaction
    const transaction = createRelieverPaymentTransaction(relieverRequest, bankData, voucherNo);
    const postResult = postTransaction(transaction);
    
    if (!postResult.success) {
      throw new Error(postResult.error);
    }
    
    // Update ledger balances
    updateLedgerBalances(transaction.entries);
    
    console.log('✅ Reliever payment completed!');
    
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      relieverGLCode: 'X100101003',
      bankGLCode: bankData.bankCode,
      amount: parseFloat(relieverRequest.amount),
      relieverName: relieverRequest.name,
      site: site,
      days: relieverRequest.days || 1,
      message: `Reliever payment of ₹${parseFloat(relieverRequest.amount).toLocaleString()} processed for ${relieverRequest.name}`
    };
    
  } catch (error) {
    console.error('❌ ERROR in processRelieverPaymentApproval:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process reliever payment: ${error.message}`
    };
  }
};

/**
 * Process multiple reliever payments (batch approval)
 */
export const processMultipleRelieverPayments = (relieverRequests, bankData) => {
  try {
    if (DEBUG) console.log(`🚀 Starting batch reliever payment for ${relieverRequests.length} requests...`);
    
    // Validate bank data
    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }
    
    const results = [];
    let totalAmount = 0;
    let successCount = 0;
    let failureCount = 0;
    
    // Process each request individually
    for (let i = 0; i < relieverRequests.length; i++) {
      const request = relieverRequests[i];
      
      try {
        console.log(`📝 Processing reliever payment ${i + 1}/${relieverRequests.length}...`);
        
        // Process this single reliever payment
        const result = processRelieverPaymentApproval(request, bankData);
        
        if (result.success) {
          results.push({
            relieverName: request.name,
            amount: result.amount,
            voucherNo: result.voucherNo,
            transactionId: result.transactionId,
            site: result.site,
            days: result.days,
            success: true
          });
          
          totalAmount += result.amount;
          successCount++;
          
          console.log(`✅ Reliever payment ${i + 1} processed successfully`);
        } else {
          results.push({
            relieverName: request.name,
            amount: parseFloat(request.amount),
            error: result.error,
            success: false
          });
          
          failureCount++;
          console.error(`❌ Reliever payment ${i + 1} failed: ${result.error}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing reliever payment ${i + 1}:`, error);
        results.push({
          relieverName: request.name,
          amount: parseFloat(request.amount),
          error: error.message,
          success: false
        });
        failureCount++;
      }
    }
    
    console.log(`\n✅ Batch reliever processing complete: ${successCount} succeeded, ${failureCount} failed`);
    
    return {
      success: successCount > 0,
      batchSize: relieverRequests.length,
      successCount: successCount,
      failureCount: failureCount,
      totalAmount: totalAmount,
      bankGLCode: bankData.bankCode,
      payments: results,
      message: failureCount === 0 
        ? `All ${successCount} reliever payments processed successfully (Total: ₹${totalAmount.toLocaleString()})`
        : `${successCount} of ${relieverRequests.length} payments processed. ${failureCount} failed.`
    };
    
  } catch (error) {
    console.error('❌ Error in batch reliever payment:', error);
    return {
      success: false,
      error: error.message,
      message: `Batch reliever processing failed: ${error.message}`
    };
  }
};

/**
 * Generate voucher number for reliever payments
 */
export const generateRelieverVoucherNumber = (site) => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `PAY/REL/${site}/${year}`;
    
    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
    
    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }
    
    if (DEBUG) console.log(`🎫 Generated reliever voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating reliever voucher:', error);
    throw new Error(`Failed to generate reliever voucher: ${error.message}`);
  }
};

/**
 * Rent Expense Booking
 */

// Add to your accountingHelpers.js - Following your employee ledger pattern
export const createVendorLedger = (vendorId, vendorName) => {
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    
    // Generate proper vendor GL code (L2005001, L2005002, etc.)
    const glCode = generateVendorGLCode();
    
    const newLedger = {
      id: `VENDOR_${Date.now()}_${vendorId}`,
      code: glCode,
      name: `VENDOR-${vendorId} - ${vendorName}`,
      type: "ACCOUNT",
      parentAccount: "SUNDRY CREDITORS",
      parentCode: "L2005001",
      accountCategory: "LIABILITIES",
      debitCreditNature: "CREDIT",
      openingBalance: 0,
      currentBalance: 0,
      isActive: true
    };
    
    console.log(`✅ Creating vendor ledger:`, newLedger);
    
    chartOfAccounts.push(newLedger);
    
    if (!safeSetItem('chartOfAccounts', chartOfAccounts)) {
      throw new Error('Failed to save chart of accounts');
    }
    
    console.log(`✅ Created vendor ledger: ${glCode} for ${vendorName}`);
    return glCode;
  } catch (error) {
    console.error('❌ Error creating vendor ledger:', error);
    throw new Error(`Failed to create vendor ledger: ${error.message}`);
  }
};

const generateVendorGLCode = () => {
  const chartOfAccounts = safeGetItem('chartOfAccounts', []);
  
  // Find all existing vendor GL codes under L2005
  const vendorGLs = chartOfAccounts
    .filter(acc => acc.code.startsWith('L2005001'))
    .map(acc => {
      // Extract the number part after L2005
      const numberPart = acc.code.replace('L2005001', '');
      return parseInt(numberPart) || 0;
    })
    .filter(num => !isNaN(num));
  
  const lastNumber = vendorGLs.length > 0 ? Math.max(...vendorGLs) : 0;
  const nextNumber = lastNumber + 1;
  
  return `L2005001${String(nextNumber).padStart(3, '0')}`; // L2005001, L2005002, etc.
};

// Rent transaction creator - following your advance pattern
export const createRentPaymentTransaction = (rentData, vendorGL, bankData, voucherNo) => {
  try {
    const amount = parseFloat(rentData.amount);
    const bank = getBankDetails(bankData.bankCode);
    
  // Create entries array following your double-entry pattern
    const entries = [
      // Rent Expense Debit
      {
        lineNo: 1,
        glCode: "X2001002002", // BRANCH OFFICE RENT (correct GL)
        glName: "BRANCH OFFICE RENT",
        debit: rentData.breakdown.baseRent,
        credit: 0,
        narration: `Rent for ${rentData.month} - ${rentData.siteName}`,
        costCenter: rentData.siteLocation || 'General',
        site: rentData.siteName
      }
    ];
    
  // Add GST entries automatically if agreement/site indicates GST
  {
    // derive GST applicability and split
    const agreements = JSON.parse(localStorage.getItem('agreements') || '[]');
    const company = JSON.parse(localStorage.getItem('companyProfile') || '{}');
    const agreement = agreements.find(a => a.agreementId === rentData.agreementId || a.siteId === rentData.siteId);
    const gstApplicable = (rentData.gstDetails && rentData.gstDetails.applicable) || rentData.withGST || agreement?.withGST;

    if (gstApplicable) {
      // Determine GST type: default CGST+SGST unless cross-state
      const siteState = rentData.siteState || agreement?.siteState || rentData.siteDetails?.state;
      const companyState = company?.state || company?.registeredState;
      const gstType = rentData.gstDetails?.type || ((siteState && companyState && siteState !== companyState) ? 'IGST' : 'CGST+SGST');

      // Determine base and gst amounts
      const baseRent = (rentData.breakdown?.baseRent ?? agreement?.monthlyBaseRent ?? rentData.amount);
      const totalGST = (rentData.breakdown?.gst ?? agreement?.monthlyGST ?? 0);

      if (gstType === 'CGST+SGST') {
        const half = Number((Number(totalGST) / 2).toFixed(2));
        entries.push(
          {
            lineNo: entries.length + 1,
            glCode: "A3007001001", // CGST INPUT
            glName: "CGST INPUT",
            debit: half,
            credit: 0,
            narration: `CGST on rent - ${rentData.month}`
          },
          {
            lineNo: entries.length + 2,
            glCode: "A3007001002", // SGST INPUT
            glName: "SGST INPUT",
            debit: half,
            credit: 0,
            narration: `SGST on rent - ${rentData.month}`
          }
        );
      } else {
        entries.push({
          lineNo: entries.length + 1,
          glCode: "A3007001003", // IGST INPUT
          glName: "IGST INPUT",
          debit: Number(totalGST),
          credit: 0,
          narration: `IGST on rent - ${rentData.month}`
        });
      }
    }
  }
    
    // Vendor Payable Credit
    entries.push({
      lineNo: entries.length + 1,
      glCode: vendorGL,
      glName: `Rent Payable - ${rentData.ownerName}`,
      debit: 0,
      credit: amount,
      narration: `Rent payable to ${rentData.ownerName} for ${rentData.month}`,
      vendorId: rentData.ownerId
    });
    
    return {
      id: `TXN_RENT_${Date.now()}_${rentData.voucherId}`,
      voucherNo: voucherNo,
      voucherType: "Payment Voucher",
      date: getCurrentDate(),
      rentVoucherId: rentData.voucherId,
      entries: entries,
      totalDebit: amount,
      totalCredit: amount,
      narration: `Rent payment for ${rentData.siteName} - ${rentData.month}`,
      approvedBy: "Billing Manager",
      approvedDate: new Date().toISOString(),
      siteDetails: {
        siteId: rentData.siteId,
        siteName: rentData.siteName,
        location: rentData.siteLocation
      }
    };
  } catch (error) {
    console.error('Error creating rent transaction:', error);
    throw new Error(`Failed to create rent transaction: ${error.message}`);
  }
};

// Main rent processing - following your processAdvanceApproval pattern
export const processRentApproval = (rentVoucher, bankData) => {
  try {
    console.log('🚀 Starting rent voucher processing...');
    
    // Validate inputs
    if (!rentVoucher.ownerName) {
      throw new Error('Owner name is required');
    }
    
    // ✅ FIX: Check if vendor GL exists, if not create it
    let vendorGL = rentVoucher.ownerGLCode;
    
    // Validate if GL code actually exists in COA
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    const glExists = chartOfAccounts.some(acc => acc.code === vendorGL);
    
    if (!vendorGL || !glExists) {
      console.log('📝 Creating vendor ledger for:', rentVoucher.ownerName);
      const vendorId = rentVoucher.ownerId || `VEND-${Date.now()}`;
      vendorGL = createVendorLedger(vendorId, rentVoucher.ownerName);
      
      // Update the rent voucher with the new valid GL code
      rentVoucher.ownerGLCode = vendorGL;
    }
    
    // Rest of your processing logic...
    const siteCode = rentVoucher.siteName?.substring(0, 3).toUpperCase() || 'GEN';
    const voucherNo = generateRentVoucherNumber(siteCode);
    
    // Create and post transaction
    const transaction = createRentPaymentTransaction(rentVoucher, vendorGL, bankData, voucherNo);
    const postResult = postTransaction(transaction);
    
    if (!postResult.success) {
      throw new Error(postResult.error);
    }
    
    updateLedgerBalances(transaction.entries);
    
    console.log('✅ Rent voucher processing completed!');
    
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      vendorGL: vendorGL, // Return the VALID GL code
      bankGLCode: bankData.bankCode,
      amount: parseFloat(rentVoucher.amount),
      ownerName: rentVoucher.ownerName,
      siteName: rentVoucher.siteName,
      month: rentVoucher.month,
      message: `Rent voucher for ${rentVoucher.month} processed successfully - ₹${parseFloat(rentVoucher.amount).toLocaleString()}`
    };
    
  } catch (error) {
    console.error('❌ ERROR in processRentApproval:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process rent voucher: ${error.message}`
    };
  }
};

// Voucher number generator for rent
export const generateRentVoucherNumber = (site) => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `RENT/${site}/${year}`;
    
    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
    
    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }
    
    console.log(`🎫 Generated rent voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating rent voucher:', error);
    throw new Error(`Failed to generate rent voucher: ${error.message}`);
  }
};
/**
 * Validate reliever request data
 */
export const validateRelieverRequest = (relieverRequest) => {
  const errors = [];
  
  if (!relieverRequest.name) errors.push('Reliever name is required');
  if (!relieverRequest.amount || parseFloat(relieverRequest.amount) <= 0) errors.push('Invalid amount');
  return { isValid: errors.length === 0, errors };
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
  createConveyanceExpenseTransaction,
  updateLedgerBalances,
  getLedgerBalance,
  updateEmployeeOSBalance,
  processAdvanceApproval,
  processConveyanceApproval,
  processMultipleAdvanceApprovals,
  getAllTransactions,
  getTransactionsByEmployee,
  getTransactionsByGLCode,
  getTransactionsByDateRange,
  formatAmount,
  formatDate,
  processRelieverPaymentApproval, 
  processMultipleRelieverPayments,
  processRentApproval,


};
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
  return `A3001001001-EMP-${normalizedId.padStart(3, '0')}`;
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
      parentAccount: "EMPLOYEE ADVANCE",
      parentCode: "A3001001"
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
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);

    // Ensure chartOfAccounts is always an array
    if (!Array.isArray(chartOfAccounts)) {
      console.warn('⚠️ chartOfAccounts is not an array, initializing empty array');
      safeSetItem('chartOfAccounts', []);
    }

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

    const hasCode = (code) => {
      if (!chartOfAccounts || !Array.isArray(chartOfAccounts)) return false;
      return chartOfAccounts.some(acc => acc.code === code);
    };

    let expenseGLCode = expenseCandidates.find(hasCode);

    // Auto-create X2001003 if missing
    if (!expenseGLCode) {
      console.log('📝 Creating Branch Conveyance Expense ledger (X2001003)...');
      const newExpenseLedger = {
        id: `AUTO_${Date.now()}_X2001003`,
        code: 'X2001003',
        name: 'BRANCH CONVEYANCE EXPENSE',
        type: 'ACCOUNT',
        parentAccount: 'BRANCH MANAGEMENT',
        parentCode: 'X2001',
        accountCategory: 'EXPENSE',
        debitCreditNature: 'DEBIT',
        openingBalance: 0,
        currentBalance: 0,
        isActive: true
      };

      const updatedCOA = safeGetItem('chartOfAccounts', []);
      updatedCOA.push(newExpenseLedger);

      if (!safeSetItem('chartOfAccounts', updatedCOA)) {
        throw new Error('Failed to create Branch Conveyance Expense ledger');
      }
      expenseGLCode = 'X2001003';
      console.log('✅ Created Branch Conveyance Expense ledger:', expenseGLCode);
    }

    let payableGLCode = payableCandidates.find(hasCode);

    // Auto-create L2001001 Conveyance Payable if missing (shared for all employees)
    if (!payableGLCode) {
      console.log('📝 Creating Conveyance Payable ledger (L2001001)...');
      const newPayableLedger = {
        id: `AUTO_${Date.now()}_L2001001`,
        code: 'L2001001',
        name: 'CONVEYANCE PAYABLE',
        type: 'ACCOUNT',
        parentAccount: 'LIABILITY - EMPLOYEES',
        parentCode: 'L2001',
        accountCategory: 'LIABILITIES',
        debitCreditNature: 'CREDIT',
        openingBalance: 0,
        currentBalance: 0,
        isActive: true
      };

      const updatedCOA = safeGetItem('chartOfAccounts', []);
      updatedCOA.push(newPayableLedger);

      if (!safeSetItem('chartOfAccounts', updatedCOA)) {
        throw new Error('Failed to create Conveyance Payable ledger');
      }
      payableGLCode = 'L2001001';
      console.log('✅ Created Conveyance Payable ledger:', payableGLCode);
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
          parentCode: 'L2001',
          accountCategory: 'LIABILITIES',
          debitCreditNature: 'CREDIT',
          openingBalance: 0,
          currentBalance: 0,
          isActive: true
        };

        const updatedCOA = safeGetItem('chartOfAccounts', []);
        updatedCOA.push(newPayableLedger);

        if (safeSetItem('chartOfAccounts', updatedCOA)) {
          payableGLCode = 'L2001001';
        }
      } else {
        payableGLCode = 'L2001001';
      }
    }

    const getName = (code) => {
      if (!chartOfAccounts || !Array.isArray(chartOfAccounts)) return code;
      const acc = chartOfAccounts.find(a => a.code === code);
      return acc?.name || code;
    };

    console.log('✅ Resolved conveyance GLs:', {
      expense: { code: expenseGLCode, name: getName(expenseGLCode) },
      payable: { code: payableGLCode, name: getName(payableGLCode) }
    });

    return {
      expense: { code: expenseGLCode, name: getName(expenseGLCode) },
      payable: { code: payableGLCode, name: getName(payableGLCode) }
    };
  } catch (error) {
    console.error('❌ Error in resolveConveyanceGLs:', error);
    // Return safe fallbacks
    return {
      expense: { code: 'X2001003', name: 'BRANCH CONVEYANCE EXPENSE' },
      payable: { code: 'L2001001', name: 'CONVEYANCE PAYABLE' }
    };
  }
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


/**
 * Create conveyance bank payment transaction with specified GL entries
 */
export const createConveyanceBankPaymentTransaction = (payments, bankData, voucherNo, totalAmount) => {
  try {
    const bank = getBankDetails(bankData.bankCode);

    return {
      id: `TXN_CONV_BANK_${Date.now()}`,
      voucherNo: voucherNo,
      voucherType: "Payment Voucher",
      date: getCurrentDate(),
      conveyancePaymentBatch: true,

      entries: [
        // DEBIT: L2001001 - CONVEYANCE PAYABLE
        {
          lineNo: 1,
          glCode: 'L2001001',
          glName: "CONVEYANCE PAYABLE",
          debit: totalAmount,
          credit: 0,
          narration: `Conveyance payments batch - ${payments.length} employees`,
          costCenter: 'HEAD OFFICE'
        },
        // CREDIT: Selected Bank
        {
          lineNo: 2,
          glCode: bankData.bankCode,
          glName: bank?.name || bankData.bankName,
          debit: 0,
          credit: totalAmount,
          narration: `Bank payment for conveyance`,
          costCenter: 'HEAD OFFICE'
        }
      ],

      totalDebit: totalAmount,
      totalCredit: totalAmount,
      narration: `Bank payments processed for ${payments.length} conveyance requests`,
      approvedBy: "ae1",
      approvedDate: new Date().toISOString(),
      paymentDetails: {
        totalEmployees: payments.length,
        totalAmount: totalAmount,
        employees: payments.map(p => ({
          name: p.employeeName,
          amount: p.amount,
          client: p.client
        }))
      }
    };
  } catch (error) {
    console.error('Error creating conveyance bank transaction:', error);
    throw new Error(`Failed to create conveyance bank transaction: ${error.message}`);
  }
};

/**
 * Generate voucher number for conveyance bank payments
 */
export const generateConveyanceBankVoucherNumber = () => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `PAY/CONV/BANK/${year}`;

    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;

    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    console.log(`🎫 Generated conveyance bank voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating conveyance bank voucher:', error);
    throw new Error(`Failed to generate conveyance bank voucher: ${error.message}`);
  }
};

/**
 * Process Conveyance Bank Payments
 */
export const processConveyanceBankPayments = (payments, bankData) => {
  try {
    console.log('🚀 Processing conveyance bank payments...');

    // Validate inputs
    if (!payments || payments.length === 0) {
      throw new Error('No conveyance payments found');
    }

    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }

    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);

    if (totalAmount <= 0) {
      throw new Error('Invalid total payment amount');
    }

    // Generate voucher number
    const voucherNo = generateConveyanceBankVoucherNumber();

    // Create transaction with specified GL entries: Debit L2001001, Credit Bank
    const transaction = createConveyanceBankPaymentTransaction(payments, bankData, voucherNo, totalAmount);
    const postResult = postTransaction(transaction);

    if (!postResult.success) {
      throw new Error(postResult.error);
    }

    // Update ledger balances
    updateLedgerBalances(transaction.entries);

    console.log('✅ Conveyance bank payments processed successfully!');

    // Format GL entries for the modal
    const formattedGLEntries = transaction.entries.map(entry => ({
      glCode: entry.glCode,
      glDescription: entry.glName || entry.glDescription,
      costCenter: entry.costCenter,
      department: entry.department || 'Finance',
      debitAmount: entry.debit || entry.debitAmount || 0,
      creditAmount: entry.credit || entry.creditAmount || 0,
      narration: entry.narration
    }));

    console.log('🔍 DEBUG - Formatted GL Entries:', formattedGLEntries);

    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      totalAmount: totalAmount,
      paymentCount: payments.length,
      glEntries: formattedGLEntries,
      message: `Processed ${payments.length} conveyance bank payments totaling ₹${totalAmount.toLocaleString()}`,
      payments: payments,
      bankDetails: bankData
    };

  } catch (error) {
    console.error('❌ ERROR in processConveyanceBankPayments:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process conveyance bank payments: ${error.message}`
    };
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
export const createRelieverPaymentTransaction = (relieverRequest, voucherNo) => {
  try {
    const amount = parseFloat(relieverRequest.amount);
    const site = relieverRequest.site || 'General';

    return {
      id: `TXN_REL_${Date.now()}_${relieverRequest.id}`,
      voucherNo: voucherNo,
      voucherType: "Journal Voucher",
      date: getCurrentDate(),
      relieverRequestId: relieverRequest.id,

      entries: [
        {
          lineNo: 1,
          glCode: 'X2002002001', // RELIEVER PAYMENTS (Expense)
          glName: "RELIEVER PAYMENTS",
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
          glCode: 'L2001002', // EMPLOYEE RELIEVER ACCOUNT (Liability)
          glName: "EMPLOYEE RELIEVER ACCOUNT",
          debit: 0,
          credit: amount,
          narration: `Reliever liability created - ${relieverRequest.name}`,
          costCenter: site
        }
      ],

      totalDebit: amount,
      totalCredit: amount,
      narration: `Reliever payment approved for ${relieverRequest.name} for ${relieverRequest.days || 1} day(s)`,
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
export const processRelieverPaymentApproval = (relieverRequest) => {
  try {
    if (DEBUG) console.log('🚀 Starting reliever payment approval...');

    // Validate inputs
    if (!relieverRequest.name) {
      throw new Error('Reliever name is required');
    }

    if (!relieverRequest.amount || parseFloat(relieverRequest.amount) <= 0) {
      throw new Error('Invalid payment amount');
    }

    // Generate voucher number
    const site = relieverRequest.site || 'General';
    const voucherNo = generateRelieverVoucherNumber(site);

    // Create and post transaction
    const transaction = createRelieverPaymentTransaction(relieverRequest, voucherNo);
    const postResult = postTransaction(transaction);

    if (!postResult.success) {
      throw new Error(postResult.error);
    }

    // Update ledger balances
    updateLedgerBalances(transaction.entries);

    console.log('✅ Reliever payment approval completed!');

    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      expenseGLCode: 'X2002002001',
      liabilityGLCode: 'L2001002',
      amount: parseFloat(relieverRequest.amount),
      relieverName: relieverRequest.name,
      site: site,
      days: relieverRequest.days || 1,
      message: `Reliever payment of ₹${parseFloat(relieverRequest.amount).toLocaleString()} approved for ${relieverRequest.name}`
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
export const processMultipleRelieverPayments = (relieverRequests) => {
  try {
    if (DEBUG) console.log(`🚀 Starting batch reliever payment for ${relieverRequests.length} requests...`);

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
        const result = processRelieverPaymentApproval(request);

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
      expenseGLCode: 'X2002002001',
      liabilityGLCode: 'L2001002',
      payments: results,
      message: failureCount === 0
        ? `All ${successCount} reliever payments approved successfully (Total: ₹${totalAmount.toLocaleString()})`
        : `${successCount} of ${relieverRequests.length} payments approved. ${failureCount} failed.`
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
export const processRelieverBankPayments = (payments, bankData) => {
  try {
    console.log('🚀 Processing reliever bank payments...');

    // Validate inputs
    if (!payments || payments.length === 0) {
      throw new Error('No reliever payments found');
    }

    const bankValidation = validateBankData(bankData);
    if (!bankValidation.isValid) {
      throw new Error(`Invalid bank data: ${bankValidation.errors.join(', ')}`);
    }

    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);

    if (totalAmount <= 0) {
      throw new Error('Invalid total payment amount');
    }

    // Generate voucher number
    const site = payments[0]?.site || 'General';
    const voucherNo = generateRelieverBankVoucherNumber(site);

    // Create transaction with your specified GL entries
    const transaction = createRelieverBankPaymentTransaction(payments, bankData, voucherNo, totalAmount);
    const postResult = postTransaction(transaction);

    if (!postResult.success) {
      throw new Error(postResult.error);
    }

    // Update ledger balances
    updateLedgerBalances(transaction.entries);

    console.log('✅ Reliever bank payments processed successfully!');

    // 🔥 FIX: Convert debit/credit fields to debitAmount/creditAmount for the modal
    const formattedGLEntries = transaction.entries.map(entry => ({
      glCode: entry.glCode,
      glDescription: entry.glName || entry.glDescription,
      costCenter: entry.costCenter,
      department: entry.department || 'Finance',
      debitAmount: entry.debit || entry.debitAmount || 0,  // Convert debit to debitAmount
      creditAmount: entry.credit || entry.creditAmount || 0, // Convert credit to creditAmount
      narration: entry.narration
    }));

    console.log('🔍 DEBUG - Formatted GL Entries:', formattedGLEntries);

    // Return COMPLETE data structure for the modal
    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      totalAmount: totalAmount,
      paymentCount: payments.length,
      glEntries: formattedGLEntries, // Use properly formatted GL entries
      message: `Processed ${payments.length} reliever bank payments totaling ₹${totalAmount.toLocaleString()}`,
      payments: payments,
      bankDetails: bankData
    };

  } catch (error) {
    console.error('❌ ERROR in processRelieverBankPayments:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process reliever bank payments: ${error.message}`
    };
  }
};

/**
 * Create reliever bank payment transaction with specified GL entries
 */
export const createRelieverBankPaymentTransaction = (payments, bankData, voucherNo, totalAmount) => {
  try {
    const bank = getBankDetails(bankData.bankCode);

    return {
      id: `TXN_REL_BANK_${Date.now()}`,
      voucherNo: voucherNo,
      voucherType: "Payment Voucher",
      date: getCurrentDate(),
      relieverPaymentBatch: true,

      entries: [
        // DEBIT: L2001002 - EMPLOYEE RELIEVER ACCOUNT
        {
          lineNo: 1,
          glCode: 'L2001002',
          glName: "EMPLOYEE RELIEVER ACCOUNT",
          debit: totalAmount,
          credit: 0,
          narration: `Reliever payments batch - ${payments.length} relievers`,
          costCenter: 'HEAD OFFICE'
        },
        // CREDIT: Selected Bank
        {
          lineNo: 2,
          glCode: bankData.bankCode,
          glName: bank?.name || bankData.bankName,
          debit: 0,
          credit: totalAmount,
          narration: `Bank payment for relievers`,
          costCenter: 'HEAD OFFICE'
        }
      ],

      totalDebit: totalAmount,
      totalCredit: totalAmount,
      narration: `Bank payments processed for ${payments.length} relievers`,
      approvedBy: "ae1",
      approvedDate: new Date().toISOString(),
      paymentDetails: {
        totalRelievers: payments.length,
        totalAmount: totalAmount,
        relievers: payments.map(p => ({
          name: p.name,
          amount: p.amount,
          site: p.site
        }))
      }
    };
  } catch (error) {
    console.error('Error creating reliever bank transaction:', error);
    throw new Error(`Failed to create reliever bank transaction: ${error.message}`);
  }
};

/**
 * Generate voucher number for reliever bank payments
 */
export const generateRelieverBankVoucherNumber = (site) => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `PAY/REL/BANK/${site}/${year}`;

    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;

    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    console.log(`🎫 Generated reliever bank voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating reliever bank voucher:', error);
    throw new Error(`Failed to generate reliever bank voucher: ${error.message}`);
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

/**
 * Get existing vendor GL code by vendor name (all under L2005)
 */
export const getVendorGLCode = (vendorName) => {
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    const vendorNameNormalized = vendorName.trim().toLowerCase().replace(/\s+/g, ' ');

    // Find existing ledger for this vendor by name under L2005
    const existingLedger = chartOfAccounts.find(acc => {
      if (!acc.code.startsWith('L2005_')) return false;

      // Check by account name - extract vendor name from "VENDOR - {VendorName}"
      const accountName = (acc.name || '').toLowerCase();
      if (accountName.includes('vendor -')) {
        const vendorInAccountName = accountName.replace('vendor -', '').trim();
        if (vendorInAccountName === vendorNameNormalized) {
          return true;
        }
      }

      return false;
    });

    if (existingLedger) {
      console.log(`✅ Found existing vendor ledger: ${existingLedger.code} for ${vendorName}`);
      return existingLedger.code;
    }

    // If not found, return null (will need to create)
    return null;
  } catch (error) {
    console.error('Error getting vendor GL code:', error);
    return null;
  }
};
/**
 * Create vendor ledger directly under L2005 (no sub-grouping)
 */
export const createVendorLedger = (vendorId, vendorName) => {
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);

    // Generate vendor GL code under L2005
    const glCode = generateVendorGLCode(vendorName);

    const newLedger = {
      id: `VENDOR_${Date.now()}_${vendorId}`,
      code: glCode,
      name: `VENDOR - ${vendorName}`,
      type: "ACCOUNT",
      parentAccount: "SUNDRY CREDITORS",
      parentCode: "L2005",
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
/**
 * Check if vendor ledger exists under L2005
 */
export const checkVendorLedgerExists = (vendorName) => {
  try {
    const chartOfAccounts = safeGetItem('chartOfAccounts', []);
    const vendorNameNormalized = vendorName.trim().toLowerCase().replace(/\s+/g, ' ');

    // Check if a ledger exists for this vendor by name under L2005
    const existingLedger = chartOfAccounts.find(acc => {
      if (!acc.code.startsWith('L2005_')) return false;

      // Check by account name - extract vendor name from "VENDOR - {VendorName}"
      const accountName = (acc.name || '').toLowerCase();
      if (accountName.includes('vendor -')) {
        const vendorInAccountName = accountName.replace('vendor -', '').trim();
        if (vendorInAccountName === vendorNameNormalized) {
          return true;
        }
      }

      return false;
    });

    return !!existingLedger;
  } catch (error) {
    console.error('Error checking vendor ledger:', error);
    return false;
  }
};

const generateVendorGLCode = (vendorName) => {
  const chartOfAccounts = safeGetItem('chartOfAccounts', []);

  // Find all existing vendor GL codes under L2005
  const vendorGLs = chartOfAccounts
    .filter(acc => acc.code.startsWith('L2005_'))
    .map(acc => {
      // Extract the number part after L2005_
      const numberPart = acc.code.replace('L2005_', '');
      return parseInt(numberPart) || 0;
    })
    .filter(num => !isNaN(num));

  const lastNumber = vendorGLs.length > 0 ? Math.max(...vendorGLs) : 0;
  const nextNumber = lastNumber + 1;

  return `L2005_${String(nextNumber).padStart(3, '0')}`;
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
    let vendorGL = getVendorGLCode(rentVoucher.ownerName);

    if (!vendorGL) {
      console.log('📝 Creating vendor ledger for:', rentVoucher.ownerName);
      const vendorId = rentVoucher.ownerId || `VEND-${Date.now()}`;
      vendorGL = createVendorLedger(vendorId, rentVoucher.ownerName);

      // Update the rent voucher with the new valid GL code
      rentVoucher.ownerGLCode = vendorGL;
    }

    // Rest of your processing logic remains the same...
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


export const createHKMaterialTransaction = (invoice, vendorGLCode, expenseGLCode, bankData, voucherNo, taxableAmount, cgstAmount, sgstAmount) => {
  try {
    return {
      id: `TXN_HK_MAT_${Date.now()}_${invoice.id}`,
      voucherNo: voucherNo,
      voucherType: "Purchase Voucher",
      date: getCurrentDate(),
      invoiceNumber: invoice.invoiceNumber,

      entries: [
        {
          lineNo: 1,
          glCode: expenseGLCode,
          glName: "HK MATERIALS",
          debit: taxableAmount,
          credit: 0,
          narration: `HK Material purchase - ${invoice.vendorName}`,
          vendorId: invoice.vendorName,
          costCenter: "Operations"
        },
        {
          lineNo: 2,
          glCode: "A3007001001",
          glName: "CGST Input",
          debit: cgstAmount,
          credit: 0,
          narration: `CGST @${invoice.gstRate / 2}% on HK Materials`
        },
        {
          lineNo: 3,
          glCode: "A3007001002",
          glName: "SGST Input",
          debit: sgstAmount,
          credit: 0,
          narration: `SGST @${invoice.gstRate / 2}% on HK Materials`
        },
        {
          lineNo: 4,
          glCode: vendorGLCode,
          glName: `VENDOR - ${invoice.vendorName}`, // ✅ UPDATED: Use unified naming
          debit: 0,
          credit: invoice.totalAmount,
          narration: `Invoice ${invoice.invoiceNumber} - HK Materials`
        }
      ],

      totalDebit: invoice.totalAmount,
      totalCredit: invoice.totalAmount,
      narration: `HK Material purchase from ${invoice.vendorName}`,
      approvedBy: invoice.processedByAM || "am1",
      approvedDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating HK Material transaction:', error);
    throw new Error(`Failed to create HK Material transaction: ${error.message}`);
  }
};
export const generateHKMaterialVoucherNumber = () => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `PINV/HK/${year}`;

    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;

    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    console.log(`🎫 Generated HK Material voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating HK Material voucher:', error);
    throw new Error(`Failed to generate HK Material voucher: ${error.message}`);
  }
};
export const processHKMaterialInvoice = (invoice, bankData) => {
  try {
    console.log('🚀 Starting HK Material invoice processing...');

    // Validate inputs
    if (!invoice.vendorName) {
      throw new Error('Vendor name is required for HK Material invoice');
    }

    if (!invoice.totalAmount || parseFloat(invoice.totalAmount) <= 0) {
      throw new Error('Invalid invoice amount');
    }

    // ✅ Validate GST Rate
    if (!invoice.gstRate || invoice.gstRate <= 0) {
      throw new Error('Invalid GST rate');
    }

    // Check/create vendor ledger using main function
    let vendorGLCode = getVendorGLCode(invoice.vendorName);

    if (!vendorGLCode) {
      console.log(`📝 Creating vendor ledger for ${invoice.vendorName}...`);
      vendorGLCode = createVendorLedger(invoice.vendorName, invoice.vendorName);
    } else {
      console.log(`✅ Using existing vendor ledger: ${vendorGLCode}`);
    }

    // Rest of the function remains the same...
    const expenseGLCode = "X1001004001"; // HK MATERIALS expense account

    // ✅ IMPROVED GST CALCULATION
    const totalAmount = parseFloat(invoice.totalAmount);
    const gstRate = parseFloat(invoice.gstRate);

    // Calculate taxable amount (base amount before GST)
    const taxableAmount = Math.round((totalAmount * 100) / (100 + gstRate));

    // Calculate total GST (ensure it matches total - taxable)
    const totalGST = totalAmount - taxableAmount;

    // Split GST equally for CGST and SGST
    const halfGST = totalGST / 2;
    const cgstAmount = Math.round(halfGST * 100) / 100; // Round to 2 decimals
    const sgstAmount = totalGST - cgstAmount; // Remainder ensures total matches

    // ✅ Validation check
    const calculatedTotal = taxableAmount + cgstAmount + sgstAmount;
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.warn(`⚠️ GST calculation mismatch: Expected ${totalAmount}, Got ${calculatedTotal}`);
    }

    console.log(`📊 GST Breakdown: Taxable: ₹${taxableAmount}, CGST: ₹${cgstAmount}, SGST: ₹${sgstAmount}`);

    // Generate voucher number
    const voucherNo = generateHKMaterialVoucherNumber();

    // Create and post transaction
    const transaction = createHKMaterialTransaction(
      invoice,
      vendorGLCode,
      expenseGLCode,
      bankData,
      voucherNo,
      taxableAmount,
      cgstAmount,
      sgstAmount
    );

    const postResult = postTransaction(transaction);
    if (!postResult.success) {
      throw new Error(postResult.error);
    }

    // Update ledger balances
    updateLedgerBalances(transaction.entries);

    console.log('✅ HK Material invoice processing completed!');

    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      vendorGLCode: vendorGLCode,
      expenseGLCode: expenseGLCode,
      amount: totalAmount,
      vendorName: invoice.vendorName,
      breakdown: {
        taxable: taxableAmount,
        cgst: cgstAmount,
        sgst: sgstAmount,
        total: totalAmount
      },
      message: `HK Material invoice processed successfully - ₹${totalAmount.toLocaleString()}`
    };

  } catch (error) {
    console.error('❌ ERROR in processHKMaterialInvoice:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process HK Material invoice: ${error.message}`
    };
  }
};

// ========================================
// FIXED ASSET INVOICE PROCESSING
// ========================================

/**
 * Map asset category to Fixed Asset GL code
 */
export const getFixedAssetGLCode = (assetCategory) => {
  if (!assetCategory) {
    // Default to FA COMPUTERS if no category specified
    console.warn('⚠️ No asset category specified, defaulting to A1001 (FA COMPUTERS)');
    return 'A1001';
  }

  const categoryMap = {
    'computer': 'A1001',
    'computers': 'A1001',
    'laptop': 'A1001',
    'desktop': 'A1001',
    'furniture': 'A1002',
    'furniture & fixtures': 'A1002',
    'furniture and fixtures': 'A1002',
    'motor car': 'A1003',
    'motor cars': 'A1003',
    'vehicle': 'A1003',
    'vehicles': 'A1003',
    'software': 'A1004',
    'softwares': 'A1004',
    'office equipment': 'A1005',
    'office equipments': 'A1005',
    'equipment': 'A1005',
    'building': 'A1006',
    'premises': 'A1006',
    'building & premises': 'A1006',
    'building and premises': 'A1006',
    'machinery': 'A1007',
    'machineries': 'A1007',
    'machine': 'A1007'
  };

  const normalizedCategory = assetCategory.toLowerCase().trim();
  const glCode = categoryMap[normalizedCategory];

  if (!glCode) {
    console.warn(`⚠️ Unknown asset category "${assetCategory}", defaulting to A1001 (FA COMPUTERS)`);
    return 'A1001'; // Default fallback
  }

  return glCode;
};

/**
 * Get Fixed Asset GL name from code
 */
export const getFixedAssetGLName = (glCode) => {
  const assetNames = {
    'A1001': 'FA COMPUTERS',
    'A1002': 'FA FURNITURE & FIXTURES',
    'A1003': 'FA MOTOR CARS',
    'A1004': 'FA SOFTWARES',
    'A1005': 'FA OFFICE EQUIPMENTS',
    'A1006': 'FA BUILDING & PREMISES',
    'A1007': 'FA MACHINERIES'
  };

  return assetNames[glCode] || 'FA COMPUTERS';
};

/**
 * Create Fixed Asset vendor ledger (L2005-VEN-{code} format)
 */




/**
 * Create Fixed Asset transaction
 */
export const createFixedAssetTransaction = (invoice, vendorGLCode, fixedAssetGLCode, fixedAssetGLName, voucherNo, taxableAmount, cgstAmount, sgstAmount) => {
  try {
    return {
      id: `TXN_FA_${Date.now()}_${invoice.id}`,
      voucherNo: voucherNo,
      voucherType: "Purchase Voucher",
      date: getCurrentDate(),
      invoiceNumber: invoice.invoiceNumber,

      entries: [
        {
          lineNo: 1,
          glCode: fixedAssetGLCode,
          glName: fixedAssetGLName,
          debit: taxableAmount,
          credit: 0,
          narration: `Fixed Asset purchase - ${invoice.vendorName}`,
          vendorId: invoice.vendorName,
          costCenter: invoice.assetDetails?.location || "Operations",
          assetTag: invoice.assetDetails?.assetTag || '',
          assetCategory: invoice.assetDetails?.assetCategory || ''
        },
        {
          lineNo: 2,
          glCode: "A3007001001",
          glName: "CGST Input",
          debit: cgstAmount,
          credit: 0,
          narration: `CGST @${invoice.gstRate / 2}% on Fixed Asset`
        },
        {
          lineNo: 3,
          glCode: "A3007001002",
          glName: "SGST Input",
          debit: sgstAmount,
          credit: 0,
          narration: `SGST @${invoice.gstRate / 2}% on Fixed Asset`
        },
        {
          lineNo: 4,
          glCode: vendorGLCode,
          glName: `VENDOR - ${invoice.vendorName}`, // ✅ UPDATED: Use unified naming
          debit: 0,
          credit: invoice.totalAmount,
          narration: `Invoice ${invoice.invoiceNumber} - Fixed Asset`
        }
      ],

      totalDebit: invoice.totalAmount,
      totalCredit: invoice.totalAmount,
      narration: `Fixed Asset purchase from ${invoice.vendorName} - ${invoice.assetDetails?.assetCategory || 'Asset'}`,
      approvedBy: invoice.processedByAM || "am1",
      approvedDate: new Date().toISOString(),
      assetDetails: invoice.assetDetails || {}
    };
  } catch (error) {
    console.error('Error creating Fixed Asset transaction:', error);
    throw new Error(`Failed to create Fixed Asset transaction: ${error.message}`);
  }
};


/**
 * Generate Fixed Asset voucher number
 */
export const generateFixedAssetVoucherNumber = () => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `FA/PUR/${year}`;

    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;

    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    console.log(`🎫 Generated Fixed Asset voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating Fixed Asset voucher:', error);
    throw new Error(`Failed to generate Fixed Asset voucher: ${error.message}`);
  }
};

/**
 * Process Fixed Asset invoice - Automatic GL posting
 */
/**
 * Process Fixed Asset invoice - Automatic GL posting
 */
export const processFixedAssetInvoice = (invoice) => {
  try {
    console.log('🚀 Starting Fixed Asset invoice processing...');

    // Validate inputs
    if (!invoice.vendorName) {
      throw new Error('Vendor name is required for Fixed Asset invoice');
    }

    if (!invoice.totalAmount || parseFloat(invoice.totalAmount) <= 0) {
      throw new Error('Invalid invoice amount');
    }

    // ✅ Validate GST Rate
    if (!invoice.gstRate || invoice.gstRate <= 0) {
      throw new Error('Invalid GST rate');
    }

    // Determine Fixed Asset GL code from asset category
    const assetCategory = invoice.assetDetails?.assetCategory || invoice.assetCategory || 'Computer';
    const fixedAssetGLCode = getFixedAssetGLCode(assetCategory);
    const fixedAssetGLName = getFixedAssetGLName(fixedAssetGLCode);

    console.log(`📦 Asset Category: ${assetCategory} -> GL Code: ${fixedAssetGLCode} (${fixedAssetGLName})`);

    // ✅ UPDATED: Use unified vendor creation under L2005
    let vendorGLCode = getVendorGLCode(invoice.vendorName);

    if (!vendorGLCode) {
      console.log(`📝 Creating vendor ledger for ${invoice.vendorName}...`);
      vendorGLCode = createVendorLedger(invoice.vendorName, invoice.vendorName);
    } else {
      console.log(`✅ Using existing vendor ledger: ${vendorGLCode}`);
    }

    // ✅ IMPROVED GST CALCULATION
    const totalAmount = parseFloat(invoice.totalAmount);
    const gstRate = parseFloat(invoice.gstRate);

    // Calculate taxable amount (base amount before GST)
    const taxableAmount = Math.round((totalAmount * 100) / (100 + gstRate));

    // Calculate total GST (ensure it matches total - taxable)
    const totalGST = totalAmount - taxableAmount;

    // Split GST equally for CGST and SGST
    const halfGST = totalGST / 2;
    const cgstAmount = Math.round(halfGST * 100) / 100; // Round to 2 decimals
    const sgstAmount = totalGST - cgstAmount; // Remainder ensures total matches

    // ✅ Validation check
    const calculatedTotal = taxableAmount + cgstAmount + sgstAmount;
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.warn(`⚠️ GST calculation mismatch: Expected ${totalAmount}, Got ${calculatedTotal}`);
    }

    console.log(`💰 Amount breakdown: Taxable=${taxableAmount}, CGST=${cgstAmount}, SGST=${sgstAmount}, Total=${totalAmount}`);

    // Generate voucher number
    const voucherNo = generateFixedAssetVoucherNumber();

    // Create and post transaction
    const transaction = createFixedAssetTransaction(
      invoice,
      vendorGLCode,
      fixedAssetGLCode,
      fixedAssetGLName,
      voucherNo,
      taxableAmount,
      cgstAmount,
      sgstAmount
    );

    const postResult = postTransaction(transaction);
    if (!postResult.success) {
      throw new Error(postResult.error);
    }

    // Update ledger balances
    updateLedgerBalances(transaction.entries);

    console.log('✅ Fixed Asset invoice processing completed!');

    return {
      success: true,
      voucherNo: voucherNo,
      transactionId: postResult.transaction.id,
      vendorGLCode: vendorGLCode,
      fixedAssetGLCode: fixedAssetGLCode,
      fixedAssetGLName: fixedAssetGLName,
      amount: totalAmount,
      vendorName: invoice.vendorName,
      assetCategory: assetCategory,
      breakdown: {
        taxable: taxableAmount,
        cgst: cgstAmount,
        sgst: sgstAmount,
        total: totalAmount
      },
      message: `Fixed Asset invoice processed successfully - ₹${totalAmount.toLocaleString()}`
    };

  } catch (error) {
    console.error('❌ ERROR in processFixedAssetInvoice:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process Fixed Asset invoice: ${error.message}`
    };
  }
};

/**
 * ========================================
 * PREPAID UNIFORM (UNIFORM PROCUREMENT) FUNCTIONS
 * ========================================
 */






/**
 * Generate Prepaid Uniform voucher number
 */
export const generatePrepaidUniformVoucherNumber = () => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `PREPAID/PUR/${year}`;

    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;

    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    console.log(`🎫 Generated Prepaid Uniform voucher: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating Prepaid Uniform voucher:', error);
    throw new Error(`Failed to generate Prepaid Uniform voucher: ${error.message}`);
  }
};

/**
 * Create Prepaid Uniform Purchase Voucher transaction
 */
export const createPrepaidUniformTransaction = (invoice, vendorGLCode, voucherNo, taxableAmount, cgstAmount, sgstAmount) => {
  try {
    return {
      id: `TXN_PREPAID_UNIFORM_${Date.now()}_${invoice.id}`,
      voucherNo: voucherNo,
      voucherType: "Purchase Voucher",
      date: getCurrentDate(),
      invoiceNumber: invoice.invoiceNumber,

      entries: [
        {
          lineNo: 1,
          glCode: "A3005001",
          glName: "UNIFORM EXPENSE",
          debit: taxableAmount,
          credit: 0,
          narration: `Prepaid Uniform purchase - ${invoice.vendorName}`,
          vendorId: invoice.vendorName,
          costCenter: invoice.site || "Operations",
          prepaidPeriod: invoice.prepaidPeriod || 12,
          prepaidStartMonth: invoice.prepaidStartMonth || new Date().toISOString().slice(0, 7)
        },
        {
          lineNo: 2,
          glCode: "A3007001001",
          glName: "CGST Input",
          debit: cgstAmount,
          credit: 0,
          narration: `CGST @${invoice.gstRate / 2}% on Prepaid Uniform`
        },
        {
          lineNo: 3,
          glCode: "A3007001002",
          glName: "SGST Input",
          debit: sgstAmount,
          credit: 0,
          narration: `SGST @${invoice.gstRate / 2}% on Prepaid Uniform`
        },
        {
          lineNo: 4,
          glCode: vendorGLCode,
          glName: `VENDOR - ${invoice.vendorName}`, // ✅ UPDATED: Use unified naming
          debit: 0,
          credit: invoice.totalAmount,
          narration: `Invoice ${invoice.invoiceNumber} - Prepaid Uniform`
        }
      ],

      totalDebit: invoice.totalAmount,
      totalCredit: invoice.totalAmount,
      narration: `Prepaid Uniform purchase from ${invoice.vendorName}`,
      approvedBy: invoice.processedByBM || "am1",
      approvedDate: new Date().toISOString(),
      prepaidDetails: {
        prepaidPeriod: invoice.prepaidPeriod || 12,
        prepaidStartMonth: invoice.prepaidStartMonth || new Date().toISOString().slice(0, 7),
        monthlyAmortization: Math.round(taxableAmount / (invoice.prepaidPeriod || 12)),
        taxableAmount: taxableAmount,
        totalGST: (invoice.totalAmount - taxableAmount)
      }
    };
  } catch (error) {
    console.error('Error creating Prepaid Uniform transaction:', error);
    throw new Error(`Failed to create Prepaid Uniform transaction: ${error.message}`);
  }
};

/**
 * Process Prepaid Uniform invoice - Automatic GL posting
 * This function creates both Purchase Voucher and initial Prepaid JV entry
 */
export const processPrepaidUniformInvoice = (invoice) => {
  try {
    console.log('🚀 Starting Prepaid Uniform invoice processing...');

    // Validate inputs
    if (!invoice.vendorName) {
      throw new Error('Vendor name is required for Prepaid Uniform invoice');
    }

    if (!invoice.totalAmount || parseFloat(invoice.totalAmount) <= 0) {
      throw new Error('Invalid invoice amount');
    }

    // Validate GST Rate
    if (!invoice.gstRate || invoice.gstRate <= 0) {
      throw new Error('Invalid GST rate');
    }

    // ✅ UPDATED: Use unified vendor creation under L2005
    let vendorGLCode = getVendorGLCode(invoice.vendorName);

    if (!vendorGLCode) {
      console.log(`📝 Creating vendor ledger for ${invoice.vendorName}...`);
      vendorGLCode = createVendorLedger(invoice.vendorName, invoice.vendorName);
    } else {
      console.log(`✅ Using existing vendor ledger: ${vendorGLCode}`);
    }

    // GST CALCULATION
    const totalAmount = parseFloat(invoice.totalAmount);
    const gstRate = parseFloat(invoice.gstRate);

    // Calculate taxable amount (base amount before GST)
    const taxableAmount = Math.round((totalAmount * 100) / (100 + gstRate));

    // Calculate total GST (ensure it matches total - taxable)
    const totalGST = totalAmount - taxableAmount;

    // Split GST equally for CGST and SGST
    const halfGST = totalGST / 2;
    const cgstAmount = Math.round(halfGST * 100) / 100; // Round to 2 decimals
    const sgstAmount = totalGST - cgstAmount; // Remainder ensures total matches
    // Calculate monthly amortization ONLY on taxable amount (not including GST)
    const prepaidPeriod = invoice.prepaidPeriod || 12;
    const prepaidStartMonth = invoice.prepaidStartMonth || new Date().toISOString().slice(0, 7);
    const monthlyAmortization = Math.round(taxableAmount / prepaidPeriod);

    console.log('💰 Prepaid calculation:', {
      totalAmount,
      taxableAmount,
      gstAmount: totalGST,
      prepaidPeriod,
      monthlyAmortization,
      note: 'Monthly amortization is ONLY on taxable amount, GST excluded'
    });

    // Validation check
    const calculatedTotal = taxableAmount + cgstAmount + sgstAmount;
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.warn(`⚠️ GST calculation mismatch: Expected ${totalAmount}, Got ${calculatedTotal}`);
    }

    console.log(`💰 Amount breakdown: Taxable=${taxableAmount}, CGST=${cgstAmount}, SGST=${sgstAmount}, Total=${totalAmount}`);

    // Generate voucher number for Purchase Voucher
    const purchaseVoucherNo = generatePrepaidUniformVoucherNumber();

    // Create and post Purchase Voucher transaction
    const purchaseTransaction = createPrepaidUniformTransaction(
      invoice,
      vendorGLCode,
      purchaseVoucherNo,
      taxableAmount,
      cgstAmount,
      sgstAmount
    );

    const postPurchaseResult = postTransaction(purchaseTransaction);
    if (!postPurchaseResult.success) {
      throw new Error(postPurchaseResult.error);
    }

    // Update ledger balances for Purchase Voucher
    updateLedgerBalances(purchaseTransaction.entries);

    console.log('✅ Prepaid Uniform Purchase Voucher posted successfully!');

    // Note: Monthly amortization JV will be created separately via button click
    // The initial setup is complete with the Purchase Voucher

    return {
      success: true,
      purchaseVoucherNo: purchaseVoucherNo,
      purchaseTransactionId: postPurchaseResult.transaction.id,
      vendorGLCode: vendorGLCode,
      uniformPrepaidGLCode: "A3005001",
      uniformPrepaidGLName: "UNIFORM EXPENSE",
      amount: totalAmount,
      vendorName: invoice.vendorName,
      breakdown: {
        taxable: taxableAmount,
        cgst: cgstAmount,
        sgst: sgstAmount,
        total: totalAmount
      },
      prepaidDetails: {
        prepaidPeriod: prepaidPeriod,
        prepaidStartMonth: prepaidStartMonth,
        monthlyAmortization: monthlyAmortization,
        taxableAmount: taxableAmount, // Store for reference
        totalGST: totalGST // Store for reference
      },
      message: `Prepaid Uniform invoice processed successfully - ₹${totalAmount.toLocaleString()}`
    };

  } catch (error) {
    console.error('❌ ERROR in processPrepaidUniformInvoice:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process Prepaid Uniform invoice: ${error.message}`
    };
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

/**
 * Generate Journal Voucher number for monthly amortization
 */
export const generateMonthlyAmortizationJVNumber = () => {
  try {
    const counters = safeGetItem('voucherCounters', {});
    const year = new Date().getFullYear();
    const key = `JV/AMORT/${year}`;

    counters[key] = (counters[key] || 0) + 1;
    const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;

    if (!safeSetItem('voucherCounters', counters)) {
      throw new Error('Failed to update voucher counter');
    }

    console.log(`🎫 Generated Monthly Amortization JV: ${voucherNo}`);
    return voucherNo;
  } catch (error) {
    console.error('Error generating Monthly Amortization JV:', error);
    throw new Error(`Failed to generate Monthly Amortization JV: ${error.message}`);
  }
};

/**
 * Get count of monthly amortizations already passed for an invoice
 */
export const getMonthlyAmortizationCount = (invoiceNumber) => {
  try {
    const transactions = safeGetItem('transactions', []);

    // Filter transactions that are monthly amortization JVs for this invoice
    const amortizationTransactions = transactions.filter(txn => {
      // Check if transaction is a Journal Voucher for monthly amortization
      const isAmortizationJV = txn.voucherType === "Journal Voucher" ||
        (txn.voucherNo && txn.voucherNo.includes('AMORT'));

      // Check if it's related to this invoice
      const isForInvoice = txn.invoiceNumber === invoiceNumber ||
        (txn.narration && txn.narration.includes(invoiceNumber));

      // Check if it has the amortization GL entries (X2001004 debit and A3005001 credit)
      const hasAmortizationEntries = txn.entries?.some(entry =>
        entry.glCode === "X2001004" && entry.debit > 0
      ) && txn.entries?.some(entry =>
        entry.glCode === "A3005001" && entry.credit > 0
      );

      return isAmortizationJV && isForInvoice && hasAmortizationEntries;
    });

    return amortizationTransactions.length;
  } catch (error) {
    console.error('Error getting monthly amortization count:', error);
    return 0;
  }
};

/**
 * Create Monthly Amortization Journal Voucher transaction
 */
export const createMonthlyAmortizationTransaction = (invoice, monthYear) => {
  try {
    // Get prepaid details
    const prepaidPeriod = invoice.prepaidDetails?.prepaidPeriod || invoice.prepaidPeriod || 12;
    const prepaidStartMonth = invoice.prepaidDetails?.prepaidStartMonth || invoice.prepaidStartMonth || new Date().toISOString().slice(0, 7);

    // Use the monthly amortization that was calculated during purchase voucher
    // This ensures we use the EXACT same taxable base amount
    const monthlyAmortization = invoice.prepaidDetails?.monthlyAmortization ||
      invoice.accountingResult?.prepaidDetails?.monthlyAmortization ||
      (() => {
        // Fallback calculation if prepaidDetails not found
        const gstRate = invoice.gstRate || 18;
        const totalAmount = parseFloat(invoice.totalAmount);
        const taxableAmount = Math.round((totalAmount * 100) / (100 + gstRate));
        return Math.round(taxableAmount / prepaidPeriod);
      })();

    console.log('📊 Monthly amortization JV:', {
      invoiceNumber: invoice.invoiceNumber,
      monthYear,
      monthlyAmortization,
      prepaidPeriod,
      note: 'Amount is based on taxable value only'
    });

    // Generate voucher number
    const voucherNo = generateMonthlyAmortizationJVNumber();

    // Get current user for approval
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    return {
      id: `TXN_AMORT_${Date.now()}_${invoice.id}`,
      voucherNo: voucherNo,
      voucherType: "Journal Voucher",
      date: getCurrentDate(),
      invoiceNumber: invoice.invoiceNumber,
      monthYear: monthYear, // Store the month for which amortization is being done

      entries: [
        {
          lineNo: 1,
          glCode: "X2001004",
          glName: "X2-UNIFORM EXPENSE",
          debit: monthlyAmortization,
          credit: 0,
          narration: `Monthly amortization for ${monthYear} - Invoice ${invoice.invoiceNumber}`,
          costCenter: invoice.site || "Operations",
          prepaidPeriod: prepaidPeriod,
          prepaidStartMonth: prepaidStartMonth
        },
        {
          lineNo: 2,
          glCode: "A3005001",
          glName: "UNIFORM EXPENSE",
          debit: 0,
          credit: monthlyAmortization,
          narration: `Monthly amortization for ${monthYear} - Invoice ${invoice.invoiceNumber}`,
          costCenter: invoice.site || "Operations",
          prepaidPeriod: prepaidPeriod,
          prepaidStartMonth: prepaidStartMonth
        }
      ],

      totalDebit: monthlyAmortization,
      totalCredit: monthlyAmortization,
      narration: `Monthly amortization JV for Invoice ${invoice.invoiceNumber} - ${monthYear}`,
      approvedBy: currentUser.username || "am1",
      approvedDate: new Date().toISOString(),
      prepaidDetails: {
        prepaidPeriod: prepaidPeriod,
        prepaidStartMonth: prepaidStartMonth,
        monthlyAmortization: monthlyAmortization,
        monthYear: monthYear
      }
    };
  } catch (error) {
    console.error('❌ Error creating Monthly Amortization transaction:', error);
    throw new Error(`Failed to create Monthly Amortization transaction: ${error.message}`);
  }
};

/**
 * Process Monthly Amortization - Create and post JV for a specific month
 */
export const processMonthlyAmortization = (invoice, monthYear) => {
  try {
    console.log('🚀 Starting Monthly Amortization processing...');

    // Validate inputs
    if (!invoice || !invoice.invoiceNumber) {
      throw new Error('Invalid invoice data');
    }

    if (!monthYear) {
      throw new Error('Month/Year is required for amortization');
    }

    // Check if amortization already exists for this month
    const transactions = safeGetItem('transactions', []);
    const existingAmortization = transactions.find(txn =>
      txn.invoiceNumber === invoice.invoiceNumber &&
      txn.monthYear === monthYear &&
      txn.entries?.some(entry => entry.glCode === "X2001004" && entry.debit > 0)
    );

    if (existingAmortization) {
      throw new Error(`Monthly amortization for ${monthYear} already exists for this invoice`);
    }

    // Create transaction
    const transaction = createMonthlyAmortizationTransaction(invoice, monthYear);

    // Post transaction
    const postResult = postTransaction(transaction);
    if (!postResult.success) {
      throw new Error(postResult.error);
    }

    // Update ledger balances
    updateLedgerBalances(transaction.entries);

    console.log('✅ Monthly Amortization JV posted successfully!');

    return {
      success: true,
      voucherNo: transaction.voucherNo,
      transactionId: postResult.transaction.id,
      monthYear: monthYear,
      amount: transaction.totalDebit,
      message: `Monthly amortization of ₹${transaction.totalDebit.toLocaleString()} posted for ${monthYear}`
    };

  } catch (error) {
    console.error('❌ ERROR in processMonthlyAmortization:', error);
    return {
      success: false,
      error: error.message,
      message: `Failed to process monthly amortization: ${error.message}`
    };
  }
};

// ========================================
// VENDOR PAYMENT (PROCESS FOR PAYMENTS)
// ========================================

/**
 * Map invoice type to vendor parent GL code (L2005xxxx)
 */
export const getVendorParentCodeByType = (invoiceType) => {
  // Updated rule: Always use direct vendor ledgers under L2005 (no sub-grouping)
  return 'L2005';
};

/**
 * Find or create a vendor ledger under a given parent (L2005xxxx) by vendor name
 */
export const getOrCreateVendorLedgerUnderParent = (vendorName, parentCode) => {
  const chartOfAccounts = safeGetItem('chartOfAccounts', []);
  // Try exact match by name under the same parent
  const existing = chartOfAccounts.find(
    acc =>
      acc.parentCode === parentCode &&
      acc.type === 'ACCOUNT' &&
      (acc.name?.toUpperCase().includes(vendorName.toUpperCase()) ||
        acc.glName?.toUpperCase().includes(vendorName.toUpperCase()))
  );
  if (existing) return existing.code;

  // Create a new ledger
  const sanitized = vendorName.replace(/\s+/g, '_').toUpperCase();
  const code = `${parentCode}_${sanitized}`.slice(0, 24); // keep code length reasonable
  const newLedger = {
    id: `VEND_${Date.now()}_${sanitized}`,
    code,
    name: `VENDOR - ${vendorName}`,
    type: 'ACCOUNT',
    parentAccount: 'TRADE CREDITORS',
    parentCode: parentCode,
    accountCategory: 'LIABILITIES',
    debitCreditNature: 'CREDIT',
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
  };
  chartOfAccounts.push(newLedger);
  safeSetItem('chartOfAccounts', chartOfAccounts);
  return code;
};

/**
 * Generate vendor payment voucher number
 */
export const generateVendorPaymentVoucherNumber = () => {
  const counters = safeGetItem('voucherCounters', {});
  const year = new Date().getFullYear();
  const key = `PAY/VEND/${year}`;
  counters[key] = (counters[key] || 0) + 1;
  const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`;
  safeSetItem('voucherCounters', counters);
  return voucherNo;
};

/**
 * Create a single vendor payment transaction for one invoice
 * DR Vendor Payable (L2005 child), CR Bank
 */
export const createVendorPaymentTransaction = (payment, vendorGLCode, bankGLCode, bankName, voucherNo) => {
  const amount = parseFloat(payment.amount || payment.paidAmount || 0);
  if (!amount || amount <= 0) {
    throw new Error('Invalid payment amount');
  }
  const narration = `Payment for Invoice ${payment.invoiceNumber} - ${payment.vendorName}`;
  return {
    id: `TXN_VPAY_${Date.now()}_${payment.invoiceNumber}`,
    voucherNo,
    voucherType: 'Payment Voucher',
    date: getCurrentDate(),
    invoiceNumber: payment.invoiceNumber,
    vendorName: payment.vendorName,
    entries: [
      {
        lineNo: 1,
        glCode: vendorGLCode,
        glName: `VENDOR - ${payment.vendorName}`,
        debit: amount,
        credit: 0,
        narration,
        costCenter: 'HEAD OFFICE',
      },
      {
        lineNo: 2,
        glCode: bankGLCode,
        glName: bankName || 'Bank',
        debit: 0,
        credit: amount,
        narration,
        costCenter: 'HEAD OFFICE',
      },
    ],
    totalDebit: amount,
    totalCredit: amount,
    narration,
    approvedBy: payment.approvedBy || 'ae1',
    approvedDate: new Date().toISOString(),
  };
};

/**
 * Process multiple vendor invoice payments
 * payments: [{ vendorName, invoiceNumber, amount, type }]
 * bank: { bankCode, bankName }
 */
export const processVendorPayments = (payments, bank) => {
  try {
    if (!bank?.bankCode) throw new Error('Bank selection is required');
    const bankGLCode = bank.bankCode;
    const bankName = bank.bankName;
    const results = [];

    // Group payments by vendor ledger (all under L2005)
    const groupKeyToInfo = {};
    for (const p of payments) {
      if (!p.vendorName || !p.invoiceNumber) continue;

      let vendorGLCode = p.vendorGLCode;
      if (!vendorGLCode) {
        vendorGLCode = getVendorGLCode(p.vendorName);
      }
      if (!vendorGLCode) {
        vendorGLCode = createVendorLedger(p.vendorName, p.vendorName);
      }
      const key = `${vendorGLCode}`;
      if (!groupKeyToInfo[key]) {
        groupKeyToInfo[key] = {
          vendorGLCode,
          vendorName: p.vendorName,
          totalAmount: 0,
          invoices: [],
        };
      }
      const amt = parseFloat(p.amount || 0) || 0;
      groupKeyToInfo[key].totalAmount += amt;
      groupKeyToInfo[key].invoices.push({ invoiceNumber: p.invoiceNumber, amount: amt });

      // Keep per-invoice results for downstream cleanup and UI
      results.push({
        invoiceNumber: p.invoiceNumber,
        vendorName: p.vendorName,
        amount: amt,
        vendorGLCode,
        bankGLCode,
      });
    }

    // Rest of the function remains the same...
    const groups = Object.values(groupKeyToInfo);
    const totalPaid = groups.reduce((sum, g) => sum + g.totalAmount, 0);

    if (totalPaid <= 0) {
      throw new Error('Total payment amount is zero');
    }

    // Create ONE voucher with multiple vendor debits and ONE bank credit
    const voucherNo = generateVendorPaymentVoucherNumber();
    const narration = `Vendor payments for ${groups.length} ledger(s), total ₹${totalPaid.toLocaleString()}`;
    const entries = [];

    groups.forEach((g, idx) => {
      const invoiceList = g.invoices.map(i => i.invoiceNumber).join(', ');
      entries.push({
        lineNo: idx + 1,
        glCode: g.vendorGLCode,
        glName: `VENDOR - ${g.vendorName}`,
        debit: g.totalAmount,
        credit: 0,
        narration: `Payment for invoices: ${invoiceList}`,
        costCenter: 'HEAD OFFICE',
      });
    });

    // Bank credit as single line
    entries.push({
      lineNo: entries.length + 1,
      glCode: bankGLCode,
      glName: bankName || 'Bank',
      debit: 0,
      credit: totalPaid,
      narration: 'Bank payment (batch)',
      costCenter: 'HEAD OFFICE',
    });

    const batchTransaction = {
      id: `TXN_VPAY_BATCH_${Date.now()}`,
      voucherNo,
      voucherType: 'Payment Voucher',
      date: getCurrentDate(),
      entries,
      totalDebit: totalPaid,
      totalCredit: totalPaid,
      narration,
      approvedBy: 'ae1',
      approvedDate: new Date().toISOString(),
    };

    const postResult = postTransaction(batchTransaction);
    if (!postResult.success) {
      throw new Error(postResult.error || 'Failed to post payment transaction');
    }
    updateLedgerBalances(entries);

    return {
      success: true,
      count: results.length, // per-invoice count
      totalPaid,
      bankGLCode,
      voucherNo,
      transactionId: postResult.transaction.id,
      groups,
      results,
      message: `Processed ${results.length} vendor payment entries for ₹${totalPaid.toLocaleString()}`,
    };
  } catch (error) {
    console.error('❌ ERROR in processVendorPayments:', error);
    return { success: false, error: error.message, message: error.message };
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
  processFixedAssetInvoice,
  processPrepaidUniformInvoice,
  createPrepaidUniformTransaction,
  generatePrepaidUniformVoucherNumber,
  generateMonthlyAmortizationJVNumber,
  getMonthlyAmortizationCount,
  createMonthlyAmortizationTransaction,
  processMonthlyAmortization
};
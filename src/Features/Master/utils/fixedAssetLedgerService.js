/* eslint-disable no-unused-vars */
export class FixedAssetLedgerService {
  static parseDate(dateStr) {
    try {
      if (!dateStr) return null;
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          return new Date(dateStr);
        } else {
          // DD-MM-YY format
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          return new Date(`${year}-${parts[1]}-${parts[0]}`);
        }
      }
      return new Date(dateStr);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get asset account details from real data
   */
  static getAssetAccountDetails(accountCode) {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices')) || [];

      const account = chartOfAccounts.find(acc => acc.code === accountCode);

      if (!account) {
        console.log(`❌ Fixed Asset account not found: ${accountCode}`);
        return null;
      }

      // Get asset name mapping
      const assetNames = {
        'A1001': 'FA COMPUTERS',
        'A1002': 'FA FURNITURE & FIXTURES',
        'A1003': 'FA MOTOR CARS',
        'A1004': 'FA SOFTWARES',
        'A1005': 'FA OFFICE EQUIPMENTS',
        'A1006': 'FA BUILDING & PREMISES',
        'A1007': 'FA MACHINERIES'
      };

      const assetCategory = assetNames[accountCode] || account.name;

      // Get current balance from ledger balances
      const balance = ledgerBalances[accountCode] || { debit: 0, credit: 0, balance: 0 };
      const totalPurchaseValue = balance.debit || 0;
      const accumulatedDepreciation = balance.credit || 0;
      const netBookValue = totalPurchaseValue - accumulatedDepreciation;

      // Filter transactions for this asset account
      const assetTransactions = transactions.filter(txn =>
        txn.entries?.some(entry => entry.glCode === accountCode && entry.debit > 0)
      );

      // Count assets from processed invoices
      const assetInvoices = processedInvoices.filter(inv =>
        inv.type === 'Fixed Asset' &&
        inv.fixed_asset_gl_code === accountCode
      );

      const totalAssets = assetInvoices.length;
      const activeAssets = assetInvoices.filter(inv =>
        !inv.status || !inv.status.toLowerCase().includes('disposed')
      ).length;

      // Get depreciation rate based on asset type
      const depreciationRates = {
        'A1001': '40%',
        'A1002': '10%',
        'A1003': '15%',
        'A1004': '60%',
        'A1005': '15%',
        'A1006': '5%',
        'A1007': '15%'
      };

      return {
        assetCode: accountCode,
        assetCategory: assetCategory,
        glAccountCode: accountCode,
        accountName: account.name,
        depreciationRate: depreciationRates[accountCode] || '15%',
        depreciationMethod: 'WDV',
        totalAssets: totalAssets,
        activeAssets: activeAssets,
        balances: [
          {
            label: 'Total Purchase Value',
            amount: `₹${totalPurchaseValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            type: 'Original Cost'
          },
          {
            label: 'Accumulated Depreciation',
            amount: `₹${accumulatedDepreciation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            type: 'Depreciation'
          },
          {
            label: 'Net Book Value',
            amount: `₹${netBookValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            type: 'Current Value'
          }
        ],
        summary: {
          totalAssets: totalAssets,
          activeAssets: activeAssets,
          disposedAssets: totalAssets - activeAssets,
          underMaintenance: 0
        }
      };

    } catch (error) {
      console.error('❌ Error getting Fixed Asset account details:', error);
      return null;
    }
  }

  /**
   * Get asset ledger entries from real transactions
   */
  static getAssetLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      console.log(`📊 Generating Fixed Asset ledger for: ${accountCode}`);

      // Filter transactions that involve this Fixed Asset account (debit entries)
      const assetTransactions = transactions.filter(txn =>
        txn.entries?.some(entry => entry.glCode === accountCode && entry.debit > 0)
      );

      // Sort by date ascending
      assetTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log(`📋 Found ${assetTransactions.length} Fixed Asset transactions for ${accountCode}`);

      // Get depreciation rate
      const depreciationRates = {
        'A1001': '40',
        'A1002': '10',
        'A1003': '15',
        'A1004': '60',
        'A1005': '15',
        'A1006': '5',
        'A1007': '15'
      };

      const depreciationRate = depreciationRates[accountCode] || '15';

      // Convert to ledger entries
      const ledgerEntries = [];
      let runningPurchaseValue = 0;
      let accumulatedDepreciation = 0;

      assetTransactions.forEach(txn => {
        const assetEntry = txn.entries.find(entry => entry.glCode === accountCode && entry.debit > 0);
        const vendorEntry = txn.entries.find(entry =>
          entry.glCode.startsWith('L2005003_') ||
          entry.glCode.startsWith('L2005-VEN-') ||
          entry.glCode.startsWith('L2005002_')
        );

        if (assetEntry) {
          const purchaseValue = assetEntry.debit || 0;
          runningPurchaseValue += purchaseValue;

          // Find corresponding invoice for asset details
          // Try multiple matching strategies
          let invoice = processedInvoices.find(inv =>
            inv.invoiceNumber === txn.invoiceNumber
          );

          if (!invoice) {
            invoice = processedInvoices.find(inv =>
              inv.voucher_id === txn.voucherNo
            );
          }

          if (!invoice) {
            invoice = processedInvoices.find(inv =>
              inv.type === 'Fixed Asset' &&
              inv.fixed_asset_gl_code === accountCode &&
              Math.abs(new Date(inv.processedAtAM || inv.submittedAt) - new Date(txn.date)) < 86400000 // within 1 day
            );
          }

          // Get asset details from invoice or transaction
          const assetDetails = invoice?.assetDetails || assetEntry.assetDetails || {};
          const assetTag = assetDetails.assetTag || assetEntry.assetTag || invoice?.assetDetails?.assetTag || '-';
          const serialNumber = assetDetails.serialNumber || assetEntry.serialNumber || invoice?.assetDetails?.serialNumber || '-';
          const location = assetDetails.location || assetEntry.costCenter || invoice?.assetDetails?.location || 'Operations';
          const warranty = assetDetails.warranty || assetEntry.warranty || invoice?.assetDetails?.warranty || '-';
          const assetCategory = assetDetails.assetCategory || invoice?.asset_category || invoice?.assetDetails?.assetCategory || 'Fixed Asset';
          const vendorName = invoice?.vendorName
            || vendorEntry?.glName?.replace('FIXED ASSET VENDOR - ', '').replace('VENDOR - ', '').replace('HK MATERIAL VENDOR - ', '')
            || txn.narration?.split('from ')[1]?.split(' - ')[0]
            || '-';

          // Format date for display
          const displayDate = this.formatDate(txn.date);

          // Calculate net book value (purchase value - accumulated depreciation)
          // For now, depreciation is 0 as it's not being calculated automatically
          const netBookValue = purchaseValue;

          ledgerEntries.push({
            date: displayDate,
            originalDate: txn.date,
            voucherNo: txn.voucherNo,
            assetTag: assetTag,
            assetDescription: `${assetCategory} - ${vendorName !== '-' ? vendorName : 'Fixed Asset Purchase'}`,
            entryType: 'Purchase',
            purchaseValue: purchaseValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            depreciation: '-',
            netBookValue: netBookValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            serialNumber: serialNumber,
            location: location,
            warranty: warranty,
            vendor: vendorName,
            invoiceNo: txn.invoiceNumber || invoice?.invoiceNumber || '-',
            status: txn.status || invoice?.finalStatus || 'Active',
            approvedBy: txn.approvedBy || invoice?.processedByAM || 'System',
            attachments: assetEntry.attachments || (invoice?.poDocuments ? invoice.poDocuments.length : 0) || 0,
            narration: assetEntry.narration || txn.narration || `Fixed Asset purchase - ${assetCategory}`,
            glCode: accountCode,
            purchaseDate: displayDate,
            usefulLife: this.getUsefulLife(accountCode),
            depreciationMethod: 'WDV',
            depreciationRate: depreciationRate,
            originalCost: purchaseValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            accumulatedDepreciation: '0',
            salvageValue: '0',
            lastDepreciationDate: '-',
            department: location.includes('Office') ? 'Administration' : location.includes('Factory') ? 'Production' : 'General',
            costCenter: assetEntry.costCenter || location,
            custodian: '-',
            insurance: '-',
            amcStatus: warranty !== '-' ? 'Under Warranty' : '-',
            remarks: invoice?.amRemarks || `Fixed Asset purchase - ${assetCategory}`
          });
        }
      });

      console.log(`✅ Generated ${ledgerEntries.length} Fixed Asset ledger entries`);
      return ledgerEntries;

    } catch (error) {
      console.error('❌ Error generating Fixed Asset ledger entries:', error);
      return [];
    }
  }

  /**
   * Format date for display (DD-MM-YY format)
   */
  static formatDate(dateString) {
    try {
      if (!dateString) return '-';
      let date;
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          date = new Date(dateString);
        } else {
          // DD-MM-YY format - convert to YYYY-MM-DD
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          date = new Date(`${year}-${parts[1]}-${parts[0]}`);
        }
      } else {
        date = new Date(dateString);
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Get useful life based on asset type
   */
  static getUsefulLife(accountCode) {
    const usefulLives = {
      'A1001': '5 Years', // Computers
      'A1002': '10 Years', // Furniture
      'A1003': '8 Years', // Motor Cars
      'A1004': '3 Years', // Software
      'A1005': '10 Years', // Office Equipment
      'A1006': '60 Years', // Building
      'A1007': '15 Years' // Machinery
    };

    return usefulLives[accountCode] || '10 Years';
  }

  /**
   * Get all Fixed Asset GL codes
   */
  static getAllFixedAssetCodes() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      return chartOfAccounts
        .filter(acc => ['A1001', 'A1002', 'A1003', 'A1004', 'A1005', 'A1006', 'A1007'].includes(acc.code))
        .map(acc => ({
          code: acc.code,
          name: acc.name,
          assetCategory: acc.name.replace('FA ', '')
        }));
    } catch (error) {
      console.error('Error getting Fixed Asset codes:', error);
      return [];
    }
  }
}

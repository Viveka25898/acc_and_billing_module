// Generic loadLedgerData function template for all Revenue Ledger pages
// This is the standard implementation using RevenueLedgerService

export const loadLedgerDataTemplate = (glCodeDefault) => `
  const loadLedgerData = async () => {
    try {
      setLoading(true)
      setError(null)

      await new Promise((resolve) => setTimeout(resolve, 500))

      const glCode = accountCode || '${glCodeDefault}'
      const data = RevenueLedgerService.getRevenueLedgerWithTransactions(glCode)

      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to load revenue ledger data')
      }

      const transformedData = {
        headerInfo: {
          ledgerName: data.ledgerName,
          glAccountCode: data.glCode,
          accountName: data.accountName,
          financialYear: data.financialYear,
          period: data.period,
          ledgerType: data.ledgerType,
          category: data.category,
          gstApplicable: data.gstApplicable
        },
        ledgerDetails: {
          openingBalance: data.openingBalance,
          currentBalance: data.currentBalance,
          balanceType: data.balanceType,
          totalDebit: data.totalDebit,
          totalCredit: data.totalCredit,
          netRevenue: data.netRevenue,
          entries: data.entries.map(entry => ({
            date: new Date(entry.date).toLocaleDateString('en-GB'),
            voucher: entry.voucherNo,
            narration: entry.description,
            entryType: entry.voucherType,
            counterparty: entry.customer,
            refNo: entry.invoiceNumber,
            debit: entry.debit,
            credit: entry.credit,
            balance: entry.balance
          }))
        }
      }

      setLedgerData(transformedData)
      setFilteredTransactions(transformedData.ledgerDetails.entries || [])
      setLoading(false)
    } catch (err) {
      console.error('❌ Error loading revenue ledger:', err)
      setError('Failed to load revenue ledger data. Please try again.')
      setLedgerData(null)
      setLoading(false)
    }
  }
`;

// Mapping of pages to their GL codes:
// ServiceChargesRevenueLedgerPage: R1001003
// PestControlRevenueLedgerPage: R1001010
// DeepCleaningRevenueLedgerPage: R1001007
// HKMaterialRevenueLedgerPage: R1001005001
// OverseasConsultancyRevenueLedgerPage: R1001004
// HouseKeepingExemptRevenueLedgerPage: R1001002

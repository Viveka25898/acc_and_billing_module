// pages/BankLedgerPage.jsx - UPDATED VERSION
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BankLedgerHeader from '../Components/BankLedgerHeader'
import FilterSection from '../Components/FilterSection'
import TransactionTable from '../Components/TransactionTable'
import SummarySection from '../Components/SummerySection'
import { BankLedgerService } from '../../utils/BankLedgerService'

const BankLedgerPage = () => {
  const { accountCode } = useParams()
  const [bankDetails, setBankDetails] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBankLedgerData()
  }, [accountCode])

  const loadBankLedgerData = () => {
    try {
      setLoading(true)
      console.log(`🏦 Loading bank ledger for: ${accountCode}`)

      // Get bank account details
      const details = BankLedgerService.getBankAccountDetails(accountCode)
      setBankDetails(details)

      // Get bank transactions
      const bankTransactions = BankLedgerService.getBankTransactions(accountCode)
      setTransactions(bankTransactions)

      // Get summary
      const summaryData = BankLedgerService.getBankSummary(bankTransactions)
      setSummary(summaryData)

      console.log(`✅ Loaded ${bankTransactions.length} transactions for ${accountCode}`)
    } catch (error) {
      console.error('❌ Error loading bank ledger:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bank ledger...</p>
        </div>
      </div>
    )
  }

  if (!bankDetails) {
    return (
      <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Bank Account Not Found</h2>
          <p className="text-gray-600">The bank account {accountCode} does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <BankLedgerHeader bankDetails={bankDetails} />
          <FilterSection />
          <TransactionTable transactions={transactions} />
          <SummarySection summary={summary} />
        </div>
      </div>
    </div>
  )
}

export default BankLedgerPage

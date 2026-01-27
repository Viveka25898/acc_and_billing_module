/**
 * Transaction Enrichment Service
 * Enriches transactions with billing data (client, site, state, costCenter)
 * Extracts data from billingCalculationData and randomly assigns to transactions
 */

import { RATE_CARDS } from '../../Billing/data/billingCalculationData'

// Try to import CUSTOMERS if available, otherwise use empty array
let CUSTOMERS = []
try {
  const billingData = require('../../Billing/data/billingCalculationData')
  CUSTOMERS = billingData.CUSTOMERS || []
} catch (e) {
  // CUSTOMERS not available, will use RATE_CARDS only
  CUSTOMERS = []
}

export class TransactionEnrichmentService {
  /**
   * Extract billing data structure
   * @returns {Object} Billing data with clients, sites, states
   */
  static extractBillingData() {
    try {
      const billingData = {
        clients: [],
        clientSiteMap: {}, // { clientName: [sites] }
        clientStateMap: {}, // { clientName: state }
        clientCityMap: {}, // { clientName: city }
        clientBranchMap: {}, // { clientName: branch }
        allSites: [], // Flat list of all sites
        allStates: new Set(),
        allCities: new Set()
      }

      // Extract from RATE_CARDS
      Object.keys(RATE_CARDS).forEach(clientName => {
        const rateCard = RATE_CARDS[clientName]
        const sites = Object.keys(rateCard.sites || {})
        
        billingData.clients.push(clientName)
        billingData.clientSiteMap[clientName] = sites
        billingData.allSites.push(...sites)
      })

      // Extract from CUSTOMERS array (if available)
      if (CUSTOMERS && Array.isArray(CUSTOMERS)) {
        CUSTOMERS.forEach(customer => {
          const clientName = customer.name
          
          // Add state and city from CUSTOMERS
          if (customer.state) {
            billingData.clientStateMap[clientName] = customer.state
            billingData.allStates.add(customer.state)
          }
          
          if (customer.city) {
            billingData.clientCityMap[clientName] = customer.city
            billingData.allCities.add(customer.city)
          }
          
          if (customer.branch) {
            billingData.clientBranchMap[clientName] = customer.branch
          }

          // Add sites from CUSTOMERS if not already in RATE_CARDS
          if (customer.sites && Array.isArray(customer.sites)) {
            const customerSites = customer.sites.map(s => s.name || s)
            if (!billingData.clientSiteMap[clientName]) {
              billingData.clientSiteMap[clientName] = customerSites
            } else {
              // Merge sites
              const existingSites = billingData.clientSiteMap[clientName]
              customerSites.forEach(site => {
                if (!existingSites.includes(site)) {
                  existingSites.push(site)
                }
              })
            }
            billingData.allSites.push(...customerSites)
          }
        })
      }

      // Convert Sets to Arrays
      billingData.allStates = Array.from(billingData.allStates)
      billingData.allCities = Array.from(billingData.allCities)

      // Default state/city mappings if not found in CUSTOMERS
      // Map based on common patterns
      const defaultStateMap = {
        'ABC Mall': 'Maharashtra',
        'TechCorp IT Park': 'Karnataka',
        'XYZ Hospital': 'Delhi',
        'DEF Complex': 'Maharashtra',
        'PQR Industries': 'Gujarat',
        'LMN Corporate': 'Tamil Nadu',
        'Global Industries': 'Delhi'
      }

      const defaultCityMap = {
        'ABC Mall': 'Mumbai',
        'TechCorp IT Park': 'Bangalore',
        'XYZ Hospital': 'New Delhi',
        'DEF Complex': 'Pune',
        'PQR Industries': 'Ahmedabad',
        'LMN Corporate': 'Chennai',
        'Global Industries': 'Delhi'
      }

      const defaultBranchMap = {
        'ABC Mall': 'Mumbai Branch',
        'TechCorp IT Park': 'Bangalore Branch',
        'XYZ Hospital': 'Delhi Branch',
        'DEF Complex': 'Pune Branch',
        'PQR Industries': 'Ahmedabad Branch',
        'LMN Corporate': 'Chennai Branch',
        'Global Industries': 'Delhi Branch'
      }

      // Apply defaults for missing data
      billingData.clients.forEach(clientName => {
        if (!billingData.clientStateMap[clientName] && defaultStateMap[clientName]) {
          billingData.clientStateMap[clientName] = defaultStateMap[clientName]
          billingData.allStates.push(defaultStateMap[clientName])
        }
        
        if (!billingData.clientCityMap[clientName] && defaultCityMap[clientName]) {
          billingData.clientCityMap[clientName] = defaultCityMap[clientName]
          billingData.allCities.push(defaultCityMap[clientName])
        }
        
        if (!billingData.clientBranchMap[clientName] && defaultBranchMap[clientName]) {
          billingData.clientBranchMap[clientName] = defaultBranchMap[clientName]
        }
      })

      // Remove duplicates
      billingData.allStates = [...new Set(billingData.allStates)]
      billingData.allCities = [...new Set(billingData.allCities)]
      billingData.allSites = [...new Set(billingData.allSites)]

      console.log('📊 Extracted Billing Data:', {
        clients: billingData.clients.length,
        totalSites: billingData.allSites.length,
        states: billingData.allStates.length,
        cities: billingData.allCities.length
      })

      return billingData
    } catch (error) {
      console.error('❌ Error extracting billing data:', error)
      return {
        clients: [],
        clientSiteMap: {},
        clientStateMap: {},
        clientCityMap: {},
        clientBranchMap: {},
        allSites: [],
        allStates: [],
        allCities: []
      }
    }
  }

  /**
   * Get random client from billing data
   */
  static getRandomClient(billingData) {
    if (!billingData.clients || billingData.clients.length === 0) return null
    const randomIndex = Math.floor(Math.random() * billingData.clients.length)
    return billingData.clients[randomIndex]
  }

  /**
   * Get random site for a client
   */
  static getRandomSiteForClient(clientName, billingData) {
    const sites = billingData.clientSiteMap[clientName]
    if (!sites || sites.length === 0) return null
    const randomIndex = Math.floor(Math.random() * sites.length)
    return sites[randomIndex]
  }

  /**
   * Get state for a client
   */
  static getStateForClient(clientName, billingData) {
    return billingData.clientStateMap[clientName] || null
  }

  /**
   * Get city for a client
   */
  static getCityForClient(clientName, billingData) {
    return billingData.clientCityMap[clientName] || null
  }

  /**
   * Get branch for a client
   */
  static getBranchForClient(clientName, billingData) {
    return billingData.clientBranchMap[clientName] || null
  }

  /**
   * Check if transaction has revenue entries (R-prefix GL codes)
   */
  static hasRevenueEntries(transaction) {
    if (!transaction.entries || !Array.isArray(transaction.entries)) return false
    return transaction.entries.some(entry => 
      entry.glCode && entry.glCode.startsWith('R')
    )
  }

  /**
   * Check if transaction has expense entries (X-prefix GL codes)
   */
  static hasExpenseEntries(transaction) {
    if (!transaction.entries || !Array.isArray(transaction.entries)) return false
    return transaction.entries.some(entry => 
      entry.glCode && entry.glCode.startsWith('X')
    )
  }

  /**
   * Check if transaction has asset entries (A-prefix GL codes)
   * Fixed Assets: A1001-A1007
   * Current Assets: 
   *   - A3001 (Loans & Advances) and sub-accounts
   *   - A3002-EMP-* (Employee Advances - under A3001)
   *   - A3004 (Cash & Bank) and sub-accounts like A3004001001, A3004001002
   *   - A3005 (Prepaid Expense) and sub-accounts
   *   - A3007 (Duties & Taxes) and sub-accounts like A3007001001, A3007001002
   */
  static hasAssetEntries(transaction) {
    if (!transaction.entries || !Array.isArray(transaction.entries)) return false
    return transaction.entries.some(entry => {
      if (!entry.glCode) return false
      const glCode = entry.glCode
      
      // Fixed Assets: A1001-A1007
      if (glCode.match(/^A100[1-7]$/)) return true
      
      // Current Assets: A3001, A3004, A3005, A3007 and all their sub-accounts
      if (glCode.startsWith('A3001') || glCode.startsWith('A3004') || glCode.startsWith('A3005') || glCode.startsWith('A3007')) return true
      
      // Employee Advances: A3002-EMP-* (these are under A3001 Loans & Advances)
      if (glCode.startsWith('A3002-EMP-') || glCode.match(/^A3002-EMP-/)) return true
      
      // Other assets (A1xx, A2xx)
      if (glCode.startsWith('A1') || glCode.startsWith('A2')) return true
      
      return false
    })
  }

  /**
   * Check if transaction has liability entries (L-prefix GL codes)
   * Liabilities: L2001 (Employee Liabilities), L2002 (Salary Payable), L2005 (Vendors), L3000 (GST Payable), etc.
   */
  static hasLiabilityEntries(transaction) {
    if (!transaction.entries || !Array.isArray(transaction.entries)) return false
    return transaction.entries.some(entry => {
      if (!entry.glCode) return false
      // All L-prefix codes are liabilities
      return entry.glCode.startsWith('L')
    })
  }

  /**
   * Get client GL code from transaction entries (D-prefix)
   */
  static getClientGLCodeFromTransaction(transaction) {
    if (!transaction.entries || !Array.isArray(transaction.entries)) return null
    const clientEntry = transaction.entries.find(entry => 
      entry.glCode && entry.glCode.startsWith('D')
    )
    return clientEntry ? clientEntry.glCode : null
  }

  /**
   * Enrich a single transaction with billing data
   */
  static enrichTransaction(transaction, billingData) {
    if (!transaction) return transaction

    const enriched = { ...transaction }
    let hasChanges = false

    // Check if transaction already has customer/client info
    const hasExistingCustomer = !!(enriched.customer || enriched.clientName)
    const clientGLCode = this.getClientGLCodeFromTransaction(transaction)
    
    // For revenue transactions, prioritize client assignment
    if (this.hasRevenueEntries(transaction)) {
      let clientName = enriched.customer || enriched.clientName
      
      // If no customer but has client GL code, try to find client name
      if (!clientName && clientGLCode) {
        // Try to extract from GL name in entries
        const clientEntry = transaction.entries.find(e => e.glCode === clientGLCode)
        if (clientEntry && clientEntry.glName) {
          // Extract client name from GL name (e.g., "C010-CLIENT-DEMOS" -> "CLIENT-DEMOS")
          const glName = clientEntry.glName
          if (glName.includes('-')) {
            const parts = glName.split('-')
            if (parts.length > 1) {
              clientName = parts.slice(1).join(' ')
            }
          }
        }
      }

      // If still no customer, randomly assign one
      if (!clientName) {
        clientName = this.getRandomClient(billingData)
        if (clientName) {
          enriched.customer = clientName
          enriched.clientName = clientName
          hasChanges = true
        }
      } else if (!enriched.customer) {
        enriched.customer = clientName
        hasChanges = true
      }

      // Assign site, state, city, branch for this client
      if (clientName) {
        const site = enriched.site || this.getRandomSiteForClient(clientName, billingData)
        const state = enriched.state || this.getStateForClient(clientName, billingData)
        const city = enriched.city || this.getCityForClient(clientName, billingData)
        const branch = enriched.branch || this.getBranchForClient(clientName, billingData)

        if (site && !enriched.site) {
          enriched.site = site
          hasChanges = true
        }

        if (state && !enriched.state) {
          enriched.state = state
          hasChanges = true
        }

        if (city && !enriched.city) {
          enriched.city = city
          hasChanges = true
        }

        if (branch && !enriched.branch) {
          enriched.branch = branch
          hasChanges = true
        }

        // Update costCenter to match site (billing requirement)
        if (site && (!enriched.costCenter || enriched.costCenter === 'HEAD OFFICE' || enriched.costCenter === 'General')) {
          enriched.costCenter = site
          hasChanges = true
        }
      } else {
        // If no client available for revenue transaction, randomly assign any site
        const allSites = billingData.allSites || []
        if (allSites.length > 0) {
          const randomSite = allSites[Math.floor(Math.random() * allSites.length)]
          enriched.site = randomSite
          enriched.costCenter = randomSite
          
          // Try to find state/city/branch from RATE_CARDS or CUSTOMERS
          let foundState = null
          let foundCity = null
          let foundBranch = null
          
          // Check RATE_CARDS
          for (const clientName of Object.keys(RATE_CARDS || {})) {
            const rateCard = RATE_CARDS[clientName]
            if (rateCard.sites && rateCard.sites[randomSite]) {
              const siteData = rateCard.sites[randomSite]
              foundState = siteData.state || foundState
              foundCity = siteData.city || foundCity
              foundBranch = siteData.branch || foundBranch
              break
            }
          }
          
          // Check CUSTOMERS if still not found
          if (!foundState && CUSTOMERS && Array.isArray(CUSTOMERS)) {
            for (const customer of CUSTOMERS) {
              if (customer.sites && Array.isArray(customer.sites)) {
                const siteData = customer.sites.find(s => (s.name || s) === randomSite || (s.siteName || s) === randomSite)
                if (siteData) {
                  foundState = siteData.state || customer.state || foundState
                  foundCity = siteData.city || customer.city || foundCity
                  foundBranch = siteData.branch || customer.branch || foundBranch
                  break
                }
              }
            }
          }
          
          enriched.state = foundState || '-'
          enriched.city = foundCity || '-'
          enriched.branch = foundBranch || '-'
          
          hasChanges = true
          console.log(`💰 Enriched Revenue transaction ${enriched.voucherNo} with random site: Site=${enriched.site}, State=${enriched.state}`)
        }
      }
    }

    // For expense transactions, assign client/site (always, like Revenue and Liability)
    if (this.hasExpenseEntries(transaction) && !hasExistingCustomer) {
      const clientName = this.getRandomClient(billingData)
      if (clientName) {
        enriched.customer = clientName
        enriched.clientName = clientName
        
        const site = this.getRandomSiteForClient(clientName, billingData)
        const state = this.getStateForClient(clientName, billingData)
        const city = this.getCityForClient(clientName, billingData)
        const branch = this.getBranchForClient(clientName, billingData)

        if (site) enriched.site = site
        if (state) enriched.state = state
        if (city) enriched.city = city
        if (branch) enriched.branch = branch
        
        // Update costCenter to match site
        if (site && (!enriched.costCenter || enriched.costCenter === 'HEAD OFFICE' || enriched.costCenter === 'General' || enriched.costCenter === 'Operations')) {
          enriched.costCenter = site
        }
        
        hasChanges = true
        console.log(`💰 Enriched Expense transaction ${enriched.voucherNo || enriched.id} with client: Customer=${enriched.customer}, Site=${enriched.site}, State=${enriched.state}`)
      } else {
        // If no client available, randomly assign any site (like Liability)
        const allSites = billingData.allSites || []
        if (allSites.length > 0) {
          const randomSite = allSites[Math.floor(Math.random() * allSites.length)]
          enriched.site = randomSite
          enriched.costCenter = randomSite
          
          // Try to find state/city/branch from RATE_CARDS or CUSTOMERS
          let foundState = null
          let foundCity = null
          let foundBranch = null
          
          // Check RATE_CARDS
          for (const clientName of Object.keys(RATE_CARDS || {})) {
            const rateCard = RATE_CARDS[clientName]
            if (rateCard.sites && rateCard.sites[randomSite]) {
              const siteData = rateCard.sites[randomSite]
              foundState = siteData.state || foundState
              foundCity = siteData.city || foundCity
              foundBranch = siteData.branch || foundBranch
              break
            }
          }
          
          // Check CUSTOMERS if still not found
          if (!foundState && CUSTOMERS && Array.isArray(CUSTOMERS)) {
            for (const customer of CUSTOMERS) {
              if (customer.sites && Array.isArray(customer.sites)) {
                const siteData = customer.sites.find(s => (s.name || s) === randomSite || (s.siteName || s) === randomSite)
                if (siteData) {
                  foundState = siteData.state || customer.state || foundState
                  foundCity = siteData.city || customer.city || foundCity
                  foundBranch = siteData.branch || customer.branch || foundBranch
                  break
                }
              }
            }
          }
          
          enriched.state = foundState || '-'
          enriched.city = foundCity || '-'
          enriched.branch = foundBranch || '-'
          
          hasChanges = true
          console.log(`💰 Enriched Expense transaction ${enriched.voucherNo || enriched.id} with random site: Site=${enriched.site}, State=${enriched.state}`)
        }
      }
    }

    // For asset transactions (Fixed Assets, etc.), assign client/site
    if (this.hasAssetEntries(transaction) && !hasExistingCustomer) {
      // Fixed Assets and other assets should get client/site assigned
      const clientName = this.getRandomClient(billingData)
      if (clientName) {
        enriched.customer = clientName
        enriched.clientName = clientName
        
        const site = this.getRandomSiteForClient(clientName, billingData)
        const state = this.getStateForClient(clientName, billingData)
        const city = this.getCityForClient(clientName, billingData)
        const branch = this.getBranchForClient(clientName, billingData)

        if (site) enriched.site = site
        if (state) enriched.state = state
        if (city) enriched.city = city
        if (branch) enriched.branch = branch
        
        // Update costCenter to match site (billing requirement)
        if (site && (!enriched.costCenter || enriched.costCenter === 'HEAD OFFICE' || enriched.costCenter === 'General' || enriched.costCenter === 'Operations')) {
          enriched.costCenter = site
        }
        
        hasChanges = true
        console.log(`🏗️ Enriched Asset transaction ${enriched.voucherNo} (${enriched.entries?.find(e => e.glCode?.startsWith('A'))?.glCode || 'N/A'}): Customer=${clientName}, Site=${site}, State=${state}`)
      }
    }

    // For liability transactions (L-prefix), assign client/site
    if (this.hasLiabilityEntries(transaction) && !hasExistingCustomer) {
      // Liabilities should get client/site assigned
      const clientName = this.getRandomClient(billingData)
      if (clientName) {
        enriched.customer = clientName
        enriched.clientName = clientName
        
        const site = this.getRandomSiteForClient(clientName, billingData)
        const state = this.getStateForClient(clientName, billingData)
        const city = this.getCityForClient(clientName, billingData)
        const branch = this.getBranchForClient(clientName, billingData)

        if (site) enriched.site = site
        if (state) enriched.state = state
        if (city) enriched.city = city
        if (branch) enriched.branch = branch
        
        // Update costCenter to match site (billing requirement)
        if (site && (!enriched.costCenter || enriched.costCenter === 'HEAD OFFICE' || enriched.costCenter === 'General' || enriched.costCenter === 'Operations')) {
          enriched.costCenter = site
        }
        
        hasChanges = true
        console.log(`💰 Enriched Liability transaction ${enriched.voucherNo} (${enriched.entries?.find(e => e.glCode?.startsWith('L'))?.glCode || 'N/A'}): Customer=${clientName}, Site=${site}, State=${state}`)
      } else {
        // If no client available, randomly assign any site
        const allSites = billingData.allSites || []
        if (allSites.length > 0) {
          const randomSite = allSites[Math.floor(Math.random() * allSites.length)]
          enriched.site = randomSite
          enriched.costCenter = randomSite
          
          // Try to find state/city/branch from RATE_CARDS or CUSTOMERS
          let foundState = null
          let foundCity = null
          let foundBranch = null
          
          // Check RATE_CARDS
          for (const clientName of Object.keys(RATE_CARDS || {})) {
            const rateCard = RATE_CARDS[clientName]
            if (rateCard.sites && rateCard.sites[randomSite]) {
              const siteData = rateCard.sites[randomSite]
              foundState = siteData.state || foundState
              foundCity = siteData.city || foundCity
              foundBranch = siteData.branch || foundBranch
              break
            }
          }
          
          // Check CUSTOMERS if still not found
          if (!foundState && CUSTOMERS && Array.isArray(CUSTOMERS)) {
            for (const customer of CUSTOMERS) {
              if (customer.sites && Array.isArray(customer.sites)) {
                const siteData = customer.sites.find(s => (s.name || s) === randomSite || (s.siteName || s) === randomSite)
                if (siteData) {
                  foundState = siteData.state || customer.state || foundState
                  foundCity = siteData.city || customer.city || foundCity
                  foundBranch = siteData.branch || customer.branch || foundBranch
                  break
                }
              }
            }
          }
          
          enriched.state = foundState || '-'
          enriched.city = foundCity || '-'
          enriched.branch = foundBranch || '-'
          
          hasChanges = true
          console.log(`💰 Enriched Liability transaction ${enriched.voucherNo} with random site: Site=${enriched.site}, State=${enriched.state}`)
        }
      }
    }

    // Update entries with costCenter, site, client info
    if (hasChanges && enriched.entries && Array.isArray(enriched.entries)) {
      enriched.entries = enriched.entries.map(entry => {
        const updatedEntry = { ...entry }
        
        // Update costCenter in entries to match transaction costCenter
        if (enriched.costCenter && (!entry.costCenter || entry.costCenter === 'HEAD OFFICE' || entry.costCenter === 'General')) {
          updatedEntry.costCenter = enriched.costCenter
        }

        // Add site if missing
        if (enriched.site && !entry.site) {
          updatedEntry.site = enriched.site
        }

        // Add client code if missing and we have client GL code
        if (clientGLCode && !entry.clientCode) {
          updatedEntry.clientCode = clientGLCode
        }

        return updatedEntry
      })
    }

    return hasChanges ? enriched : transaction
  }

  /**
   * Enrich all transactions in localStorage
   */
  static enrichAllTransactions() {
    try {
      console.log('🔄 Starting transaction enrichment...')
      
      const billingData = this.extractBillingData()
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      
      if (!Array.isArray(transactions) || transactions.length === 0) {
        console.log('⚠️ No transactions found to enrich')
        return { success: true, enriched: 0, total: 0 }
      }

      let enrichedCount = 0
      let assetTransactionCount = 0
      const enrichedTransactions = transactions.map(txn => {
        // Check if this is an asset transaction before enriching
        const isAsset = this.hasAssetEntries(txn)
        if (isAsset) {
          assetTransactionCount++
          console.log(`🔍 Found Asset transaction: ${txn.voucherNo}, GL Codes: ${txn.entries?.map(e => e.glCode).filter(c => c?.startsWith('A')).join(', ') || 'none'}`)
        }
        
        const enriched = this.enrichTransaction(txn, billingData)
        if (enriched !== txn) {
          enrichedCount++
        }
        return enriched
      })
      
      console.log(`📊 Asset transactions found: ${assetTransactionCount}/${transactions.length}`)

      // Save enriched transactions back to localStorage
      localStorage.setItem('transactions', JSON.stringify(enrichedTransactions))
      
      console.log(`✅ Transaction enrichment complete: ${enrichedCount}/${transactions.length} transactions enriched`)
      
      // Debug: Show sample of enriched asset transactions
      if (assetTransactionCount > 0) {
        const sampleAssetTxns = enrichedTransactions.filter(txn => this.hasAssetEntries(txn)).slice(0, 3)
        console.log(`📋 Sample enriched asset transactions:`, sampleAssetTxns.map(t => ({
          voucherNo: t.voucherNo,
          customer: t.customer || t.clientName || 'MISSING',
          site: t.site || 'MISSING',
          state: t.state || 'MISSING',
          glCodes: t.entries?.map(e => e.glCode).filter(c => c?.startsWith('A')).join(', ')
        })))
      }
      
      return {
        success: true,
        enriched: enrichedCount,
        total: transactions.length,
        assetTransactions: assetTransactionCount,
        billingData: {
          clients: billingData.clients.length,
          sites: billingData.allSites.length,
          states: billingData.allStates.length
        }
      }
    } catch (error) {
      console.error('❌ Error enriching transactions:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get billing data summary (for debugging/reporting)
   */
  static getBillingDataSummary() {
    const billingData = this.extractBillingData()
    return {
      clients: billingData.clients,
      totalClients: billingData.clients.length,
      totalSites: billingData.allSites.length,
      sites: billingData.allSites,
      states: billingData.allStates,
      cities: billingData.allCities,
      clientSiteMap: billingData.clientSiteMap,
      clientStateMap: billingData.clientStateMap
    }
  }
}

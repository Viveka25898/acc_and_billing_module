/**
 * System Data Analyzer
 * Analyzes and counts Vendors, Clients, and States in the system
 */

export class SystemDataAnalyzer {
  /**
   * Get count and list of all vendors
   */
  static getVendors() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      
      // Vendors are under L2005 (SUNDRY CREDITORS)
      // They can have codes like L2005_001, L2005_002, or L2005xxxx format
      const vendors = chartOfAccounts.filter(acc => {
        // Check if it's a vendor account
        if (acc.code.startsWith('L2005') && acc.type === 'ACCOUNT') {
          // Exclude the parent folder itself (L2005)
          return acc.code !== 'L2005'
        }
        return false
      })

      const vendorList = vendors.map(v => ({
        code: v.code,
        name: v.name,
        parentCode: v.parentCode,
      }))

      return {
        count: vendors.length,
        vendors: vendorList,
      }
    } catch (error) {
      console.error('Error getting vendors:', error)
      return { count: 0, vendors: [] }
    }
  }

  /**
   * Get count and list of all clients
   */
  static getClients() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      const clientLedgers = JSON.parse(localStorage.getItem('clientLedgers') || '{}')

      // Clients are under A3003001 (SUNDRY DEBTORS) with codes starting with D
      const clients = chartOfAccounts.filter(acc => {
        return (
          acc.code.startsWith('D') &&
          acc.type === 'ACCOUNT' &&
          acc.parentCode === 'A3003001'
        )
      })

      const clientList = clients.map(c => {
        const ledger = clientLedgers[c.code]
        return {
          code: c.code,
          name: c.name,
          ledgerName: ledger?.ledgerDetails?.clientName || c.name,
          location: c.location || ledger?.ledgerDetails?.location || 'N/A',
          state: c.state || ledger?.ledgerDetails?.state || 'N/A',
          parentCode: c.parentCode,
        }
      })

      return {
        count: clients.length,
        clients: clientList,
      }
    } catch (error) {
      console.error('Error getting clients:', error)
      return { count: 0, clients: [] }
    }
  }

  /**
   * Get count and list of all states
   */
  static getStates() {
    try {
      const sites = JSON.parse(localStorage.getItem('sites') || '[]')
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      const clientLedgers = JSON.parse(localStorage.getItem('clientLedgers') || '{}')

      const stateSet = new Set()

      // Get states from sites
      if (Array.isArray(sites)) {
        sites.forEach(site => {
          if (site.state) {
            stateSet.add(site.state)
          }
          if (site.location) {
            // Try to extract state from location if it contains state name
            const locationStr = site.location.toString()
            const commonStates = [
              'Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu',
              'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Punjab',
              'Haryana', 'Kerala', 'Madhya Pradesh', 'Odisha', 'Bihar',
            ]
            commonStates.forEach(state => {
              if (locationStr.includes(state)) {
                stateSet.add(state)
              }
            })
          }
        })
      }

      // Get states from client accounts
      chartOfAccounts
        .filter(acc => acc.code.startsWith('D') && acc.parentCode === 'A3003001')
        .forEach(client => {
          if (client.state) {
            stateSet.add(client.state)
          }
          if (client.location) {
            const locationStr = client.location.toString()
            const commonStates = [
              'Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu',
              'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Punjab',
            ]
            commonStates.forEach(state => {
              if (locationStr.includes(state)) {
                stateSet.add(state)
              }
            })
          }
        })

      // Get states from client ledgers
      Object.values(clientLedgers).forEach(ledger => {
        if (ledger?.ledgerDetails?.state) {
          stateSet.add(ledger.ledgerDetails.state)
        }
        if (ledger?.ledgerDetails?.location) {
          const locationStr = ledger.ledgerDetails.location.toString()
          const commonStates = [
            'Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu',
            'Gujarat', 'West Bengal', 'Rajasthan', 'Uttar Pradesh', 'Punjab',
          ]
          commonStates.forEach(state => {
            if (locationStr.includes(state)) {
              stateSet.add(state)
            }
          })
        }
      })

      const stateList = Array.from(stateSet).sort()

      return {
        count: stateList.length,
        states: stateList,
      }
    } catch (error) {
      console.error('Error getting states:', error)
      return { count: 0, states: [] }
    }
  }

  /**
   * Get complete system summary
   */
  static getSystemSummary() {
    try {
      const vendors = this.getVendors()
      const clients = this.getClients()
      const states = this.getStates()

      // Also check localStorage keys
      const localStorageKeys = {
        chartOfAccounts: localStorage.getItem('chartOfAccounts') ? 'Exists' : 'Not Found',
        clientLedgers: localStorage.getItem('clientLedgers') ? 'Exists' : 'Not Found',
        transactions: localStorage.getItem('transactions') ? 'Exists' : 'Not Found',
        sites: localStorage.getItem('sites') ? 'Exists' : 'Not Found',
        reportsLedgersBalances: localStorage.getItem('reportsLedgersBalances') ? 'Exists' : 'Not Found',
        ledgerBalances: localStorage.getItem('ledgerBalances') ? 'Exists' : 'Not Found',
      }

      return {
        vendors: {
          count: vendors.count,
          sample: vendors.vendors.slice(0, 5), // First 5 vendors
        },
        clients: {
          count: clients.count,
          sample: clients.clients.slice(0, 5), // First 5 clients
        },
        states: {
          count: states.count,
          list: states.states,
        },
        localStorage: localStorageKeys,
      }
    } catch (error) {
      console.error('Error getting system summary:', error)
      return null
    }
  }

  /**
   * Print system summary to console
   */
  static printSystemSummary() {
    const summary = this.getSystemSummary()
    
    if (!summary) {
      console.error('❌ Failed to get system summary')
      return
    }

    console.log('='.repeat(60))
    console.log('📊 SYSTEM DATA SUMMARY')
    console.log('='.repeat(60))
    
    console.log(`\n🏢 VENDORS: ${summary.vendors.count}`)
    if (summary.vendors.sample.length > 0) {
      console.log('Sample vendors:')
      summary.vendors.sample.forEach(v => {
        console.log(`  - ${v.code}: ${v.name}`)
      })
    } else {
      console.log('  No vendors found')
    }

    console.log(`\n👥 CLIENTS: ${summary.clients.count}`)
    if (summary.clients.sample.length > 0) {
      console.log('Sample clients:')
      summary.clients.sample.forEach(c => {
        console.log(`  - ${c.code}: ${c.name} (State: ${c.state})`)
      })
    } else {
      console.log('  No clients found')
    }

    console.log(`\n🗺️  STATES: ${summary.states.count}`)
    if (summary.states.list.length > 0) {
      console.log('States list:')
      summary.states.list.forEach(state => {
        console.log(`  - ${state}`)
      })
    } else {
      console.log('  No states found')
    }

    console.log(`\n💾 LOCALSTORAGE KEYS:`)
    Object.entries(summary.localStorage).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`)
    })

    console.log('='.repeat(60))
    
    return summary
  }
}

export default SystemDataAnalyzer

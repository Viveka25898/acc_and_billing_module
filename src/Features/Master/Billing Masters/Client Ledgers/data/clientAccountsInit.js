// Initialize Client Accounts in Chart of Accounts
// This file adds ABC Mall (D001) and other client accounts to the Chart of Accounts

export const clientAccounts = [
    {
        id: Date.now().toString(),
        code: 'D001',
        name: 'ABC Mall - Pune',
        type: 'ACCOUNT',
        parentAccount: 'SUNDRY DEBTORS',
        parentCode: 'A3003001',
        description: 'Client Account - ABC Mall, Pune',
        gstin: '27AABCU9603R1ZX',
        pan: 'AABCU9603R',
        location: 'Pune, India',
        contactPerson: 'Rajesh Kumar',
        email: 'accounts@abcmall.com',
        phone: '+91 98765 43210',
        paymentTerms: 'Net 30 Days',
        creditLimit: '₹50,00,000',
    },
]

// Function to initialize client accounts in Chart of Accounts
export const initializeClientAccounts = () => {
    try {
        const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []

        // Check if client accounts already exist
        const existingCodes = chartOfAccounts.map(acc => acc.code)
        const clientsToAdd = clientAccounts.filter(client => !existingCodes.includes(client.code))

        if (clientsToAdd.length > 0) {
            const updatedAccounts = [...chartOfAccounts, ...clientsToAdd]
            localStorage.setItem('chartOfAccounts', JSON.stringify(updatedAccounts))
            console.log(`✅ Added ${clientsToAdd.length} client account(s) to Chart of Accounts`)
            return true
        } else {
            console.log('✅ Client accounts already exist in Chart of Accounts')
            return false
        }
    } catch (error) {
        console.error('❌ Error initializing client accounts:', error)
        return false
    }
}

// Function to add a new client account
export const addClientAccount = (clientData) => {
    try {
        const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []

        // Generate next client code (D001, D002, D003...)
        const existingClientCodes = chartOfAccounts
            .filter(acc => acc.code.startsWith('D') && acc.parentCode === 'A3003001')
            .map(acc => acc.code)

        const nextNumber = existingClientCodes.length + 1
        const nextCode = `D${String(nextNumber).padStart(3, '0')}`

        const newClient = {
            id: Date.now().toString(),
            code: nextCode,
            name: clientData.name,
            type: 'ACCOUNT',
            parentAccount: 'SUNDRY DEBTORS',
            parentCode: 'A3003001',
            description: `Client Account - ${clientData.name}`,
            ...clientData,
        }

        chartOfAccounts.push(newClient)
        localStorage.setItem('chartOfAccounts', JSON.stringify(chartOfAccounts))

        console.log(`✅ Added new client account: ${nextCode} - ${clientData.name}`)
        return newClient
    } catch (error) {
        console.error('❌ Error adding client account:', error)
        return null
    }
}

// Function to get all client accounts
export const getAllClientAccounts = () => {
    try {
        const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []
        return chartOfAccounts.filter(
            acc => acc.code.startsWith('D') && acc.parentCode === 'A3003001'
        )
    } catch (error) {
        console.error('❌ Error getting client accounts:', error)
        return []
    }
}

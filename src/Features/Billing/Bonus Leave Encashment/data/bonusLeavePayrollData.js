/**
 * Mock Payroll Data for Bonus & Leave Encashment Billing
 * This data simulates what would be received from the Payroll module
 */

export const BONUS_LEAVE_PAYROLL_DATA = {
    'Global Industries': {
        periods: {
            'January 2026': {
                bonus: {
                    type: 'New Year Bonus',
                    period: 'January 2026',
                    employees: [
                        {
                            employeeId: 'EMP001',
                            employeeName: 'Rajesh Kumar',
                            designation: 'Security Guard',
                            site: 'Ground Floor',
                            bonusAmount: 5000,
                        },
                        {
                            employeeId: 'EMP002',
                            employeeName: 'Priya Sharma',
                            designation: 'Supervisor',
                            site: 'Ground Floor',
                            bonusAmount: 8000,
                        },
                        {
                            employeeId: 'EMP003',
                            employeeName: 'Amit Patel',
                            designation: 'Security Guard',
                            site: 'First Floor',
                            bonusAmount: 5000,
                        },
                    ],
                    totalBonusAmount: 18000,
                    processedDate: '2026-01-10',
                    approvedBy: 'Payroll Manager',
                },
                leaveEncashment: {
                    period: 'January 2026',
                    employees: [
                        {
                            employeeId: 'EMP001',
                            employeeName: 'Rajesh Kumar',
                            designation: 'Security Guard',
                            leaveDays: 10,
                            dailyRate: 500,
                            encashmentAmount: 5000,
                        },
                        {
                            employeeId: 'EMP002',
                            employeeName: 'Priya Sharma',
                            designation: 'Supervisor',
                            leaveDays: 8,
                            dailyRate: 800,
                            encashmentAmount: 6400,
                        },
                    ],
                    totalLeaveDays: 18,
                    totalEncashmentAmount: 11400,
                    processedDate: '2026-01-11',
                    approvedBy: 'Payroll Manager',
                },
            },
            'December 2025': {
                bonus: {
                    type: 'Year-End Bonus',
                    period: 'December 2025',
                    employees: [
                        {
                            employeeId: 'EMP001',
                            employeeName: 'Rajesh Kumar',
                            designation: 'Security Guard',
                            site: 'Ground Floor',
                            bonusAmount: 7000,
                        },
                        {
                            employeeId: 'EMP002',
                            employeeName: 'Priya Sharma',
                            designation: 'Supervisor',
                            site: 'Ground Floor',
                            bonusAmount: 10000,
                        },
                        {
                            employeeId: 'EMP003',
                            employeeName: 'Amit Patel',
                            designation: 'Security Guard',
                            site: 'First Floor',
                            bonusAmount: 7000,
                        },
                        {
                            employeeId: 'EMP004',
                            employeeName: 'Sneha Reddy',
                            designation: 'Housekeeping Staff',
                            site: 'Ground Floor',
                            bonusAmount: 6000,
                        },
                    ],
                    totalBonusAmount: 30000,
                    processedDate: '2025-12-20',
                    approvedBy: 'Payroll Manager',
                },
                leaveEncashment: null, // No leave encashment for December
            },
        },
    },
    'ABC Mail': {
        periods: {
            'January 2026': {
                bonus: null, // No bonus for January
                leaveEncashment: {
                    period: 'January 2026',
                    employees: [
                        {
                            employeeId: 'EMP101',
                            employeeName: 'Suresh Gupta',
                            designation: 'Security Guard',
                            leaveDays: 12,
                            dailyRate: 550,
                            encashmentAmount: 6600,
                        },
                        {
                            employeeId: 'EMP102',
                            employeeName: 'Kavita Singh',
                            designation: 'Supervisor',
                            leaveDays: 15,
                            dailyRate: 850,
                            encashmentAmount: 12750,
                        },
                    ],
                    totalLeaveDays: 27,
                    totalEncashmentAmount: 19350,
                    processedDate: '2026-01-08',
                    approvedBy: 'Payroll Manager',
                },
            },
            'December 2025': {
                bonus: {
                    type: 'Year-End Bonus',
                    period: 'December 2025',
                    employees: [
                        {
                            employeeId: 'EMP101',
                            employeeName: 'Suresh Gupta',
                            designation: 'Security Guard',
                            site: 'Mumbai Branch',
                            bonusAmount: 6000,
                        },
                        {
                            employeeId: 'EMP102',
                            employeeName: 'Kavita Singh',
                            designation: 'Supervisor',
                            site: 'Mumbai Branch',
                            bonusAmount: 9000,
                        },
                        {
                            employeeId: 'EMP103',
                            employeeName: 'Ramesh Verma',
                            designation: 'Security Guard',
                            site: 'Mumbai Branch',
                            bonusAmount: 6000,
                        },
                    ],
                    totalBonusAmount: 21000,
                    processedDate: '2025-12-10',
                    approvedBy: 'Payroll Manager',
                },
                leaveEncashment: {
                    period: 'December 2025',
                    employees: [
                        {
                            employeeId: 'EMP101',
                            employeeName: 'Suresh Gupta',
                            designation: 'Security Guard',
                            leaveDays: 5,
                            dailyRate: 550,
                            encashmentAmount: 2750,
                        },
                    ],
                    totalLeaveDays: 5,
                    totalEncashmentAmount: 2750,
                    processedDate: '2025-12-20',
                    approvedBy: 'Payroll Manager',
                },
            },
        },
    },
    'Tech Solutions Pvt Ltd': {
        periods: {
            'January 2026': {
                bonus: {
                    type: 'New Year Bonus',
                    period: 'January 2026',
                    employees: [
                        {
                            employeeId: 'EMP201',
                            employeeName: 'Vikram Shah',
                            designation: 'Facility Manager',
                            site: 'Main Office',
                            bonusAmount: 15000,
                        },
                        {
                            employeeId: 'EMP202',
                            employeeName: 'Meera Joshi',
                            designation: 'Housekeeping Staff',
                            site: 'Main Office',
                            bonusAmount: 7000,
                        },
                    ],
                    totalBonusAmount: 22000,
                    processedDate: '2026-01-05',
                    approvedBy: 'Payroll Manager',
                },
                leaveEncashment: {
                    period: 'January 2026',
                    employees: [
                        {
                            employeeId: 'EMP201',
                            employeeName: 'Vikram Shah',
                            designation: 'Facility Manager',
                            leaveDays: 20,
                            dailyRate: 1200,
                            encashmentAmount: 24000,
                        },
                    ],
                    totalLeaveDays: 20,
                    totalEncashmentAmount: 24000,
                    processedDate: '2026-01-10',
                    approvedBy: 'Payroll Manager',
                },
            },
        },
    },
}

/**
 * Get all clients with available bonus/leave encashment data
 * @returns {Array} Array of client objects with available data summary
 */
export const getClientsWithPayrollData = () => {
    const clients = []

    Object.keys(BONUS_LEAVE_PAYROLL_DATA).forEach((clientName) => {
        const clientData = BONUS_LEAVE_PAYROLL_DATA[clientName]

        Object.keys(clientData.periods).forEach((period) => {
            const periodData = clientData.periods[period]
            const hasBonus = periodData.bonus !== null
            const hasLeaveEncashment = periodData.leaveEncashment !== null

            if (hasBonus || hasLeaveEncashment) {
                clients.push({
                    client: clientName,
                    period,
                    hasBonus,
                    hasLeaveEncashment,
                    bonusAmount: hasBonus ? periodData.bonus.totalBonusAmount : 0,
                    leaveEncashmentAmount: hasLeaveEncashment
                        ? periodData.leaveEncashment.totalEncashmentAmount
                        : 0,
                    totalAmount:
                        (hasBonus ? periodData.bonus.totalBonusAmount : 0) +
                        (hasLeaveEncashment ? periodData.leaveEncashment.totalEncashmentAmount : 0),
                    bonusType: hasBonus ? periodData.bonus.type : null,
                    bonusEmployeeCount: hasBonus ? periodData.bonus.employees.length : 0,
                    leaveEmployeeCount: hasLeaveEncashment ? periodData.leaveEncashment.employees.length : 0,
                    processedDate:
                        periodData.bonus?.processedDate || periodData.leaveEncashment?.processedDate,
                    status: 'pending', // pending, billed, draft
                })
            }
        })
    })

    return clients
}

/**
 * Get payroll data for specific client and period
 * @param {string} clientName - Client name
 * @param {string} period - Period (e.g., "September 2024")
 * @returns {Object|null} Payroll data or null if not found
 */
export const getPayrollData = (clientName, period) => {
    try {
        const clientData = BONUS_LEAVE_PAYROLL_DATA[clientName]
        if (!clientData) return null

        const periodData = clientData.periods[period]
        if (!periodData) return null

        return periodData
    } catch (error) {
        console.error('Error fetching payroll data:', error)
        return null
    }
}

/**
 * Check if specific data type is available for client and period
 * @param {string} clientName - Client name
 * @param {string} period - Period
 * @param {string} dataType - 'bonus' or 'leaveEncashment'
 * @returns {boolean}
 */
export const hasPayrollDataType = (clientName, period, dataType) => {
    try {
        const periodData = getPayrollData(clientName, period)
        if (!periodData) return false

        return periodData[dataType] !== null
    } catch (error) {
        console.error('Error checking payroll data type:', error)
        return false
    }
}

/**
 * Get available periods for a client
 * @param {string} clientName - Client name
 * @returns {Array} Array of period strings
 */
export const getAvailablePeriodsForClient = (clientName) => {
    try {
        const clientData = BONUS_LEAVE_PAYROLL_DATA[clientName]
        if (!clientData) return []

        return Object.keys(clientData.periods)
    } catch (error) {
        console.error('Error fetching available periods:', error)
        return []
    }
}

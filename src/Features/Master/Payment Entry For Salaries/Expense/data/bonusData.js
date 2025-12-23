export const ledgerData = [
    {
        id: 1,
        paymentDate: "05-04-2024",
        month: "April 2024",
        transactionRef: "BNS-APR24-001",
        bonusType: "Performance Bonus",
        paymentMethod: "Bank Transfer",
        bonusAmount: 120000,
        employeeCount: 15,
        avgPerEmployee: 8000,
        status: "Paid"
    },
    {
        id: 2,
        paymentDate: "07-05-2024",
        month: "May 2024",
        transactionRef: "BNS-MAY24-001",
        bonusType: "Monthly Incentive",
        paymentMethod: "Bank Transfer",
        bonusAmount: 150000,
        employeeCount: 18,
        avgPerEmployee: 8333,
        status: "Paid"
    },
    {
        id: 3,
        paymentDate: "05-06-2024",
        month: "June 2024",
        transactionRef: "BNS-JUN24-001",
        bonusType: "Performance Bonus",
        paymentMethod: "Bank Transfer",
        bonusAmount: 110000,
        employeeCount: 16,
        avgPerEmployee: 6875,
        status: "Paid"
    },
    {
        id: 4,
        paymentDate: "08-07-2024",
        month: "July 2024",
        transactionRef: "BNS-JUL24-001",
        bonusType: "Monthly Incentive",
        paymentMethod: "Cash",
        bonusAmount: 85000,
        employeeCount: 14,
        avgPerEmployee: 6071,
        status: "Paid"
    }
];

export const summaryData = {
    totalBonus: 645000,
    averageMonthly: 129000,
    highestMonth: 180000,
    lowestMonth: 85000,
    totalMonths: 5,
    totalEmployees: 83
};

export const journalEntries = {
    directEntry: {
        debit: {
            account: "Bonus Expense",
            glCode: "X2001001007",
            amount: "₹ 1,50,000",
            description: "Monthly bonus paid to employees"
        },
        credit: {
            account: "Bank Account",
            glCode: "BANK-001",
            amount: "₹ 1,50,000",
            description: "Payment made via bank transfer"
        }
    },
    payrollEntry: {
        step1: {
            debit: {
                account: "Bonus Expense",
                glCode: "X2001001007",
                amount: "₹ 1,50,000"
            },
            credit: {
                account: "Salary Payable",
                glCode: "L2002001",
                amount: "₹ 1,50,000"
            }
        },
        step2: {
            debit: {
                account: "Salary Payable",
                glCode: "L2002001",
                amount: "₹ 1,50,000"
            },
            credit: {
                account: "Bank Account",
                glCode: "BANK-001",
                amount: "₹ 1,50,000"
            }
        }
    }
};
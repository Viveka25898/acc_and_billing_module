import { RouterProvider } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { router } from "./Routes/Route.jsx";
import { useEffect } from "react";

function App() {
  // Application Version for Migration Management
  const APP_VERSION = "1.0.0";

  // Local Storage Initialization - Enhanced with Accounting Modules
  useEffect(() => {
    try {
      // Check version and handle migrations
      const storedVersion = localStorage.getItem('appVersion');
      if (storedVersion && storedVersion !== APP_VERSION) {
        console.log(`🔄 Upgrading from ${storedVersion} to ${APP_VERSION}`);
        // Handle data migration here if needed
      }
      localStorage.setItem('appVersion', APP_VERSION);

      // ========================================
      // 1. INITIALIZE USERS (Enhanced Structure)
      // ========================================
      const existingUsers = localStorage.getItem("users");
      if (!existingUsers || !JSON.parse(existingUsers).some(user => user.role === "payroll-team")) {
        const users = [
          // Employees
          { 
            username: "emp1", 
            role: "employee", 
            empId: "1", 
            reportsTo: "lm1",
            fullName: "Rajesh Kumar",
            site: "MH01",
            department: "Operations",
            designation: "Site Supervisor",
            glCode: "A3002-EMP-001",
            osBalance: 0,
            email: "rajesh.kumar@company.com",
            mobile: "9876543210",
            bankAccount: "1234567890",
            ifscCode: "SBIN0001234",
            bankName: "State Bank of India"
          },
          { 
            username: "emp2", 
            role: "employee", 
            empId: "2", 
            reportsTo: "lm2",
            fullName: "Priya Sharma",
            site: "DL01",
            department: "Operations",
            designation: "Team Lead",
            glCode: "A3002-EMP-002",
            osBalance: 0,
            email: "priya.sharma@company.com",
            mobile: "9876543211",
            bankAccount: "2345678901",
            ifscCode: "HDFC0001234",
            bankName: "HDFC Bank"
          },
          { 
            username: "emp3", 
            role: "employee", 
            empId: "3", 
            reportsTo: "lm1",
            fullName: "Amit Patel",
            site: "BLR01",
            department: "Operations",
            designation: "Field Executive",
            glCode: "A3002-EMP-003",
            osBalance: 0,
            email: "amit.patel@company.com",
            mobile: "9876543212",
            bankAccount: "3456789012",
            ifscCode: "ICIC0001234",
            bankName: "ICICI Bank"
          },
          { 
            username: "emp4", 
            role: "employee", 
            empId: "4", 
            reportsTo: "lm3",
            fullName: "Sneha Reddy",
            site: "MH01",
            department: "Operations",
            designation: "Senior Executive",
            glCode: "A3002-EMP-004",
            osBalance: 0,
            email: "sneha.reddy@company.com",
            mobile: "9876543213",
            bankAccount: "4567890123",
            ifscCode: "SBIN0005678",
            bankName: "State Bank of India"
          },

          // Line Managers
          { 
            username: "lm1", 
            role: "line-manager", 
            empId: "5", 
            reportsTo: "vp1",
            fullName: "Vikram Singh",
            site: "MH01",
            department: "Operations",
            designation: "Line Manager",
            glCode: "A3002-EMP-005",
            osBalance: 0,
            email: "vikram.singh@company.com",
            mobile: "9876543214"
          },
          { 
            username: "lm2", 
            role: "line-manager", 
            empId: "6", 
            reportsTo: "vp1",
            fullName: "Meera Nair",
            site: "DL01",
            department: "Operations",
            designation: "Line Manager",
            glCode: "A3002-EMP-006",
            osBalance: 0,
            email: "meera.nair@company.com",
            mobile: "9876543215"
          },
          { 
            username: "lm3", 
            role: "line-manager", 
            empId: "7", 
            reportsTo: "vp2",
            fullName: "Arjun Desai",
            site: "BLR01",
            department: "Operations",
            designation: "Line Manager",
            glCode: "A3002-EMP-007",
            osBalance: 0,
            email: "arjun.desai@company.com",
            mobile: "9876543216"
          },
          { 
            username: "lm4", 
            role: "line-manager", 
            empId: "8", 
            reportsTo: "vp2",
            fullName: "Kavita Iyer",
            site: "MH01",
            department: "Operations",
            designation: "Line Manager",
            glCode: "A3002-EMP-008",
            osBalance: 0,
            email: "kavita.iyer@company.com",
            mobile: "9876543217"
          },

          // VPs
          { 
            username: "vp1", 
            role: "vp-operations", 
            empId: "9", 
            reportsTo: "ae1",
            fullName: "Suresh Menon",
            site: "MH01",
            department: "Operations",
            designation: "VP Operations",
            glCode: "A3002-EMP-009",
            osBalance: 0,
            email: "suresh.menon@company.com",
            mobile: "9876543218"
          },
          { 
            username: "vp2", 
            role: "vp-operations", 
            empId: "10", 
            reportsTo: "ae1",
            fullName: "Deepa Krishnan",
            site: "DL01",
            department: "Operations",
            designation: "VP Operations",
            glCode: "A3002-EMP-010",
            osBalance: 0,
            email: "deepa.krishnan@company.com",
            mobile: "9876543219"
          },

          // Account Executive
          { 
            username: "ae1", 
            role: "account-executive", 
            empId: "11", 
            reportsTo: "am1",
            fullName: "Ramesh Agarwal",
            site: "MH01",
            department: "Accounts",
            designation: "Account Executive",
            glCode: null,
            osBalance: 0,
            email: "ramesh.agarwal@company.com",
            mobile: "9876543220"
          },
          
          // Operation Executives
          { 
            username: "oe1", 
            role: "operation-executive", 
            empId: "12", 
            reportsTo: "lm1",
            fullName: "Karan Malhotra",
            site: "MH01",
            department: "Operations",
            designation: "Operation Executive",
            glCode: "A3002-EMP-012",
            osBalance: 0,
            email: "karan.malhotra@company.com",
            mobile: "9876543221"
          },
          { 
            username: "oe2", 
            role: "operation-executive", 
            empId: "13", 
            reportsTo: "lm2",
            fullName: "Anjali Verma",
            site: "DL01",
            department: "Operations",
            designation: "Operation Executive",
            glCode: "A3002-EMP-013",
            osBalance: 0,
            email: "anjali.verma@company.com",
            mobile: "9876543222"
          },
          { 
            username: "oe3", 
            role: "operation-executive", 
            empId: "14", 
            reportsTo: "lm3",
            fullName: "Rohit Kapoor",
            site: "BLR01",
            department: "Operations",
            designation: "Operation Executive",
            glCode: "A3002-EMP-014",
            osBalance: 0,
            email: "rohit.kapoor@company.com",
            mobile: "9876543223"
          },
          { 
            username: "oe4", 
            role: "operation-executive", 
            empId: "15", 
            reportsTo: "lm4",
            fullName: "Pooja Gupta",
            site: "MH01",
            department: "Operations",
            designation: "Operation Executive",
            glCode: "A3002-EMP-015",
            osBalance: 0,
            email: "pooja.gupta@company.com",
            mobile: "9876543224"
          },
          
          // Compliance Team
          { 
            username: "compliance1", 
            role: "compliance-team", 
            empId: "16", 
            reportsTo: "compliance-manager1",
            fullName: "Manish Joshi",
            site: "MH01",
            department: "Compliance",
            designation: "Compliance Officer",
            glCode: null,
            osBalance: 0,
            email: "manish.joshi@company.com",
            mobile: "9876543225"
          },
          { 
            username: "compliance2", 
            role: "compliance-team", 
            empId: "17", 
            reportsTo: "compliance-manager2",
            fullName: "Swati Rao",
            site: "DL01",
            department: "Compliance",
            designation: "Compliance Officer",
            glCode: null,
            osBalance: 0,
            email: "swati.rao@company.com",
            mobile: "9876543226"
          },
          
          // Compliance Managers
          { 
            username: "compliance-manager1", 
            role: "compliance-manager", 
            empId: "18", 
            reportsTo: "ae1",
            fullName: "Anil Bhatt",
            site: "MH01",
            department: "Compliance",
            designation: "Compliance Manager",
            glCode: null,
            osBalance: 0,
            email: "anil.bhatt@company.com",
            mobile: "9876543227"
          },
          { 
            username: "compliance-manager2", 
            role: "compliance-manager", 
            empId: "19", 
            reportsTo: "ae1",
            fullName: "Ritu Saxena",
            site: "DL01",
            department: "Compliance",
            designation: "Compliance Manager",
            glCode: null,
            osBalance: 0,
            email: "ritu.saxena@company.com",
            mobile: "9876543228"
          },
          
          // Payroll Team
          { 
            username: "payroll1", 
            role: "payroll-team", 
            empId: "20", 
            reportsTo: "ae1",
            fullName: "Sanjay Kulkarni",
            site: "MH01",
            department: "Accounts",
            designation: "Payroll Executive",
            glCode: null,
            osBalance: 0,
            email: "sanjay.kulkarni@company.com",
            mobile: "9876543229"
          },
          
          // Account Manager
          { 
            username: "am1", 
            role: "account-manager", 
            empId: "21", 
            reportsTo: "bm1",
            fullName: "Ashok Mehta",
            site: "MH01",
            department: "Accounts",
            designation: "Account Manager",
            glCode: null,
            osBalance: 0,
            email: "ashok.mehta@company.com",
            mobile: "9876543230"
          },
          
          // Billing Manager
          { 
            username: "bm1", 
            role: "billing-manager", 
            empId: "22", 
            reportsTo: null,
            fullName: "Vinod Pandey",
            site: "MH01",
            department: "Accounts",
            designation: "Billing Manager",
            glCode: null,
            osBalance: 0,
            email: "vinod.pandey@company.com",
            mobile: "9876543231"
          }
        ];

        localStorage.setItem("users", JSON.stringify(users));
        console.log("✅ User roles initialized with accounting fields");
      }

      // ========================================
      // 2. INITIALIZE VOUCHER COUNTERS
      // ========================================
      if (!localStorage.getItem('voucherCounters')) {
        const voucherCounters = {
          "PAY/MH01/2025": 0,
          "PAY/DL01/2025": 0,
          "PAY/BLR01/2025": 0
        };
        localStorage.setItem('voucherCounters', JSON.stringify(voucherCounters));
        console.log("✅ Voucher counters initialized");
      }

      // ========================================
      // 3. INITIALIZE TRANSACTIONS STORAGE
      // ========================================
      if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
        console.log("✅ Transactions storage initialized");
      }

      // ========================================
      // 4. INITIALIZE LEDGER BALANCES
      // ========================================
      if (!localStorage.getItem('ledgerBalances')) {
        localStorage.setItem('ledgerBalances', JSON.stringify({}));
        console.log("✅ Ledger balances initialized");
      }

      // ========================================
      // 5. INITIALIZE BANK OPENING BALANCES
      // ========================================
      if (!localStorage.getItem('bankOpeningBalances')) {
        const bankOpeningBalances = {
          "A3004003002": 500000, // HDFC Bank - ₹5,00,000
          "A3004003003": 300000  // Punjab Bank - ₹3,00,000
        };
        localStorage.setItem('bankOpeningBalances', JSON.stringify(bankOpeningBalances));
        console.log("✅ Bank opening balances initialized");
      }

      console.log("🎯 All accounting modules initialized successfully!");

    } catch (error) {
      console.error("❌ Error initializing accounting modules:", error);
      toast.error("Failed to initialize application. Please refresh the page.");
    }
  }, []);

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />  
    </>
  );
}

export default App;
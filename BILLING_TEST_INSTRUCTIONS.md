# BILLING MODULE - TESTING INSTRUCTIONS

## 🧪 TEST SCENARIO 1: ABC Mall (Recommended First Test)

### Step 1: Client & Scope Selection

- **Branch**: Select `Mumbai Branch`
- **State**: Select `Maharashtra`
- **City**: Select `Mumbai`
- **Customer**: Select `ABC Mall`
- **Billing Scope**: Select `Select Specific Sites`
- **Sites**: Check ALL 3 boxes:
  - ✅ Ground Floor
  - ✅ First Floor
  - ✅ Parking Area
- Click **Next Step**

### Step 2: Billing Cycle Selection

- **Select Billing Month**: Choose any month (e.g., `January 2026`)
- **Select Billing Cycle**: Click on any row (e.g., 16th to 15th)
- Click **Next Step**

### Step 3: Invoice Configuration

- **Invoice Series**: Select `Sales Invoice` (radio button)
- **Invoice Type**: Select `REGULAR` from dropdown
- Click **Next: Calculate Billing**

### Step 4: Billing Calculation

- **Expected Result**: You should see billing data with:
  - 8 line items total across 3 sites
  - Ground Floor: Security Guard, Supervisor, Housekeeper
  - First Floor: Security Guard, Housekeeper, Cleaner
  - Parking Area: Cleaner, Security Guard
  - Machinery charges: ₹13,000
  - Consumables: ₹3,000
  - Management fees: 8%
  - Grand Total with GST

---

## 🧪 TEST SCENARIO 2: TechCorp IT Park

### Step 1: Client & Scope Selection

- **Branch**: Select `Bangalore Branch`
- **State**: Select `Karnataka`
- **City**: Select `Bangalore`
- **Customer**: Select `TechCorp IT Park`
- **Billing Scope**: Select `Select Specific Sites`
- **Sites**: Check BOTH boxes:
  - ✅ Building A
  - ✅ Building B
- Click **Next Step**

### Step 2: Billing Cycle Selection

- **Select Billing Month**: Choose any month
- **Select Billing Cycle**: Click on any row
- Click **Next Step**

### Step 3: Invoice Configuration

- **Invoice Series**: Select `Sales Invoice`
- **Invoice Type**: Select `REGULAR`
- Click **Next: Calculate Billing**

### Step 4: Billing Calculation

- **Expected Result**: You should see:
  - 7 line items total across 2 sites
  - Building A: Receptionist, Janitor, Office Boy, House Keeper
  - Building B: Security Guard, Pantry Boy, Chambermaid
  - Machinery charges: ₹4,900
  - Management fees: 10%
  - Grand Total with GST

---

## 🧪 TEST SCENARIO 3: NeoSoft Pvt. Ltd. (Simplest Test)

### Step 1: Client & Scope Selection

- **Branch**: Select `Pune Branch`
- **State**: Select `Maharashtra`
- **City**: Select `Pune`
- **Customer**: Select `NeoSoft Pvt. Ltd.`
- **Billing Scope**: Select `Select Specific Sites`
- **Sites**: Check the box:
  - ✅ Main Office
- Click **Next Step**

### Step 2 & 3: Follow same as above

### Step 4: Billing Calculation

- **Expected Result**: You should see:
  - 2 line items
  - Main Office: Housekeeper - 3 hrs shift, Security Guard
  - Consumables: ₹2,500
  - Management fees: 8%

---

## 🔍 DEBUGGING

### Check Browser Console

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for these log messages:
   - 🔍 Step 4 - Starting Billing Calculation...
   - 👤 Selected Customer: [customer name]
   - 🏢 Selected Sites: [array of sites]
   - 📅 Billing Cycle: [cycle object]
   - ✅ Total Line Items Generated: [number]

### Common Issues

**Issue**: "No billing data available"

- Check console logs
- Verify customer name matches exactly
- Verify site names match exactly

**Issue**: "Missing required billing information"

- Make sure you completed Steps 1, 2, and 3
- Check that you selected sites in Step 1
- Check that you selected billing cycle in Step 2

**Issue**: Sites not matching

- Customer name in Step 1 must match RATE_CARDS keys
- Site names must match exactly (case-sensitive)

---

## 📊 EXPECTED DATA FOR ABC MALL

If everything works, Step 4 should show:

| Location     | Designation    | Duty Days | Rate/Day | Amount  |
| ------------ | -------------- | --------- | -------- | ------- |
| Ground Floor | Security Guard | 90        | ~711.83  | ~64,065 |
| Ground Floor | Supervisor     | 30        | ~950.00  | ~28,500 |
| Ground Floor | Housekeeper    | 60        | ~660.00  | ~39,600 |
| First Floor  | Security Guard | 60        | ~711.83  | ~42,710 |
| First Floor  | Housekeeper    | 30        | ~660.00  | ~19,800 |
| First Floor  | Cleaner        | 90        | ~583.33  | ~52,500 |
| Parking Area | Cleaner        | 60        | ~583.33  | ~35,000 |
| Parking Area | Security Guard | 30        | ~711.83  | ~21,355 |

**Grand Total**: ~₹3,50,000+ (with machinery, consumables, management fees, and GST)

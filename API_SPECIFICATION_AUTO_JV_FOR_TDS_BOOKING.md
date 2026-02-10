# API SPECIFICATION DOCUMENT

## PROCESS: AUTO JV FOR TDS BOOKING

---

## DOCUMENT INFORMATION

| Property          | Details                                                                                |
| ----------------- | -------------------------------------------------------------------------------------- |
| **Process Name**  | Auto JV for TDS Booking                                                                |
| **Module**        | Master / Income Tax Compliance                                                         |
| **Purpose**       | Automate TDS deduction and GL posting during expense booking with statutory compliance |
| **Version**       | 1.0                                                                                    |
| **Date**          | February 4, 2026                                                                       |
| **Primary Users** | Account Executive (AE), Billing Manager (BM)                                           |

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Process Flow](#process-flow)
3. [User Roles](#user-roles)
4. [Part 1: Vendor TDS Mapping (Account Executive)](#part-1-vendor-tds-mapping-account-executive)
5. [Part 2: Income Tax Statutory Master (Billing Manager)](#part-2-income-tax-statutory-master-billing-manager)
6. [Part 3: Automatic TDS Journal Voucher Generation](#part-3-automatic-tds-journal-voucher-generation)
7. [Part 4: TDS Ledger Management](#part-4-tds-ledger-management)
8. [Common Error Responses](#common-error-responses)
9. [GL Code Reference](#gl-code-reference)
10. [Sample Data Flow](#sample-data-flow)

---

## OVERVIEW

### Objective

To automate the deduction and posting of TDS (Tax Deducted at Source) entries during expense booking, ensuring statutory compliance with minimal manual intervention.

### Key Features

1. **Vendor TDS Mapping**: AE maps vendors to applicable TDS sections
2. **Statutory Master Management**: BM maintains Income Tax section rates and details
3. **Automatic TDS Calculation**: System calculates TDS on applicable expense bookings
4. **Auto Journal Voucher**: Automatic GL posting for TDS deductions
5. **TDS Ledger Tracking**: Real-time TDS payable tracking with quarterly reporting
6. **Compliance Ready**: Maintains PAN, section, and payment details for TDS returns

### TDS Sections Supported

| Section | Description                   | Typical Rate | Applicable To                         |
| ------- | ----------------------------- | ------------ | ------------------------------------- |
| 194C    | Contractors & Sub-Contractors | 1% - 2%      | Construction, material suppliers      |
| 194J    | Professional Fees             | 10%          | Legal, consulting, technical services |
| 194I    | Rent                          | 2% - 10%     | Property rent payments                |
| 194H    | Commission                    | 5%           | Agent commission                      |
| 194A    | Interest                      | 7.5% - 10%   | Interest payments                     |

---

## PROCESS FLOW

### Overall Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TDS BOOKING PROCESS                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼───────┐              ┌───────▼────────┐
        │  BM: Create    │              │  AE: Map       │
        │  TDS Statutory │              │  Vendor to TDS │
        │  Master        │              │  Section       │
        └───────┬───────┘              └───────┬────────┘
                │                               │
                └───────────────┬───────────────┘
                                │
                        ┌───────▼────────┐
                        │  Expense       │
                        │  Booking       │
                        │  (Any User)    │
                        └───────┬────────┘
                                │
                        ┌───────▼────────┐
                        │  System Checks:│
                        │  Is TDS        │
                        │  Applicable?   │
                        └───────┬────────┘
                                │
                        ┌───────▼────────┐
                        │  Auto Calculate│
                        │  TDS Amount    │
                        │  (Taxable × %) │
                        └───────┬────────┘
                                │
                        ┌───────▼────────┐
                        │  Auto Generate │
                        │  Journal Voucher│
                        │  (JV)          │
                        └───────┬────────┘
                                │
                        ┌───────▼────────┐
                        │  GL Entries:   │
                        │  DR Expense    │
                        │  CR TDS Payable│
                        │  CR Vendor Net │
                        └───────┬────────┘
                                │
                        ┌───────▼────────┐
                        │  TDS Payable   │
                        │  Ledger Updated│
                        │  (L2003001)    │
                        └────────────────┘
```

---

## USER ROLES

### Account Executive (AE)

- View all registered vendors
- Filter vendors by state and vendor code
- Map vendors to TDS sections
- Edit existing TDS mappings
- View TDS ledger transactions

### Billing Manager (BM)

- View Income Tax Statutory configurations
- Add new TDS sections with rates
- Edit existing statutory details
- Delete statutory entries
- Configure section as Corporate/Non-Corporate

---

## PART 1: VENDOR TDS MAPPING (ACCOUNT EXECUTIVE)

### 1. API TO FETCH ALL VENDORS FOR TDS MAPPING

**Endpoint**: `GET /api/tds/vendors`

**Authorization**: Account Executive role required

**Description**: Fetches all registered vendors with their current TDS mapping status

**Query Parameters**

| Parameter  | Type    | Required | Description                                      |
| ---------- | ------- | -------- | ------------------------------------------------ |
| state      | String  | No       | Filter by state name                             |
| vendorCode | String  | No       | Filter by vendor code                            |
| name       | String  | No       | Search by vendor name (partial match)            |
| tdsMapped  | Boolean | No       | Filter mapped (true) or unmapped (false) vendors |
| page       | Number  | No       | Page number for pagination (default: 1)          |
| limit      | Number  | No       | Items per page (default: 20)                     |

**Success Response (200 OK)**

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 20,
    "pageSize": 20
  },
  "summary": {
    "totalVendors": 20,
    "mappedVendors": 12,
    "unmappedVendors": 8,
    "states": 15
  },
  "vendors": [
    {
      "id": 1,
      "vendorCode": "V001",
      "vendorName": "Asha Suppliers",
      "state": "Maharashtra",
      "panNumber": "AABCU9603R",
      "vendorGLCode": "L2005002_001",
      "tdsMapping": {
        "isMapped": true,
        "section": "194C",
        "description": "Payment to contractors",
        "rate": "1%",
        "mappedDate": "2025-12-15T10:30:00.000Z",
        "mappedBy": "AE001"
      },
      "lastInvoiceDate": "2025-12-20",
      "totalInvoices": 15,
      "totalAmount": 450000.0
    },
    {
      "id": 2,
      "vendorCode": "V002",
      "vendorName": "Shree Traders",
      "state": "Gujarat",
      "panNumber": "BBCDE1234F",
      "vendorGLCode": "L2005002_002",
      "tdsMapping": {
        "isMapped": false,
        "section": null,
        "description": null,
        "rate": null,
        "mappedDate": null,
        "mappedBy": null
      },
      "lastInvoiceDate": "2025-11-18",
      "totalInvoices": 8,
      "totalAmount": 125000.0
    },
    {
      "id": 3,
      "vendorCode": "V003",
      "vendorName": "Sunrise Enterprises",
      "state": "Karnataka",
      "panNumber": "CCDEG5678H",
      "vendorGLCode": "L2005002_003",
      "tdsMapping": {
        "isMapped": true,
        "section": "194J",
        "description": "Fees for professional services",
        "rate": "10%",
        "mappedDate": "2025-11-10T14:20:00.000Z",
        "mappedBy": "AE001"
      },
      "lastInvoiceDate": "2025-12-22",
      "totalInvoices": 6,
      "totalAmount": 850000.0
    }
  ]
}
```

**Error Response (400 Bad Request - Invalid State)**

```json
{
  "success": false,
  "message": "Invalid state filter",
  "error": "State 'InvalidState' not found in system",
  "validStates": ["Maharashtra", "Gujarat", "Karnataka", "Delhi", "Tamil Nadu"]
}
```

---

### 2. API TO GET AVAILABLE TDS SECTIONS

**Endpoint**: `GET /api/tds/sections`

**Authorization**: Account Executive role required

**Description**: Fetches all available TDS sections from Income Tax Statutory Master

**Query Parameters**

| Parameter  | Type    | Required | Description                               |
| ---------- | ------- | -------- | ----------------------------------------- |
| type       | String  | No       | Filter by 'Corporate' or 'Non-Corporate'  |
| section    | String  | No       | Filter by section code (194C, 194J, etc.) |
| activeOnly | Boolean | No       | Get only active sections (default: true)  |

**Success Response (200 OK)**

```json
{
  "success": true,
  "totalSections": 5,
  "sections": [
    {
      "id": 1,
      "section": "194C",
      "description": "Payment to contractors",
      "rate": "1%",
      "rateNumeric": 1.0,
      "type": "Corporate",
      "applicableFrom": "2022-04-01",
      "applicableTo": null,
      "remarks": "Contractors & Sub-Contractors",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-03-15T09:00:00.000Z"
    },
    {
      "id": 2,
      "section": "194J",
      "description": "Fees for professional services",
      "rate": "10%",
      "rateNumeric": 10.0,
      "type": "Corporate",
      "applicableFrom": "2023-01-01",
      "applicableTo": null,
      "remarks": "Legal & Consulting Services",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-03-15T09:00:00.000Z"
    },
    {
      "id": 3,
      "section": "194I",
      "description": "Rent payments",
      "rate": "2%",
      "rateNumeric": 2.0,
      "type": "Corporate",
      "applicableFrom": "2023-04-01",
      "applicableTo": null,
      "remarks": "Property & Equipment Rent",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-04-10T11:30:00.000Z"
    },
    {
      "id": 4,
      "section": "194H",
      "description": "Commission payments",
      "rate": "5%",
      "rateNumeric": 5.0,
      "type": "Non-Corporate",
      "applicableFrom": "2023-01-01",
      "applicableTo": null,
      "remarks": "Agent Commission",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-05-20T10:00:00.000Z"
    },
    {
      "id": 5,
      "section": "194A",
      "description": "Interest payments",
      "rate": "7.50%",
      "rateNumeric": 7.5,
      "type": "Corporate",
      "applicableFrom": "2024-01-01",
      "applicableTo": null,
      "remarks": "Interest on Loans",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-06-15T14:45:00.000Z"
    }
  ]
}
```

---

### 3. API TO MAP VENDOR TO TDS SECTION

**Endpoint**: `POST /api/tds/vendors/{vendorId}/map-tds`

**Authorization**: Account Executive role required

**Description**: Maps or updates TDS section for a vendor

**URL Parameter**

- `{vendorId}` (number, required): Vendor ID

**Request Body (JSON)**

```json
{
  "sectionId": 1,
  "section": "194C",
  "rate": "1%",
  "description": "Payment to contractors",
  "remarks": "Contractor for HK material supply",
  "mappedBy": "AE001"
}
```

**Request Body Schema**

| Field       | Type   | Required | Description                             |
| ----------- | ------ | -------- | --------------------------------------- |
| sectionId   | Number | Yes      | ID of TDS section from statutory master |
| section     | String | Yes      | Section code (194C, 194J, etc.)         |
| rate        | String | Yes      | TDS rate (e.g., "1%", "10%")            |
| description | String | Yes      | Section description                     |
| remarks     | String | No       | Additional notes about mapping          |
| mappedBy    | String | Yes      | User ID performing the mapping          |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "TDS section mapped successfully to vendor",
  "vendorMapping": {
    "vendorId": 1,
    "vendorCode": "V001",
    "vendorName": "Asha Suppliers",
    "state": "Maharashtra",
    "panNumber": "AABCU9603R",
    "tdsMapping": {
      "sectionId": 1,
      "section": "194C",
      "description": "Payment to contractors",
      "rate": "1%",
      "rateNumeric": 1.0,
      "remarks": "Contractor for HK material supply",
      "mappedDate": "2026-02-04T11:30:00.000Z",
      "mappedBy": "AE001"
    }
  },
  "auditLog": {
    "action": "TDS_MAPPING_UPDATED",
    "previousMapping": null,
    "newMapping": {
      "section": "194C",
      "rate": "1%"
    },
    "timestamp": "2026-02-04T11:30:00.000Z"
  }
}
```

**Error Response (404 Not Found - Vendor Not Found)**

```json
{
  "success": false,
  "message": "Vendor not found",
  "error": "No vendor exists with ID: 999",
  "vendorId": 999
}
```

**Error Response (400 Bad Request - Invalid Section)**

```json
{
  "success": false,
  "message": "Invalid TDS section",
  "error": "TDS section with ID 999 does not exist or is inactive",
  "sectionId": 999
}
```

**Error Response (400 Bad Request - Vendor Missing PAN)**

```json
{
  "success": false,
  "message": "Cannot map TDS without vendor PAN",
  "error": "Vendor 'Shree Traders' does not have PAN number in the system. PAN is mandatory for TDS deduction.",
  "vendorId": 2,
  "vendorName": "Shree Traders",
  "requiredAction": "Update vendor master with valid PAN before TDS mapping"
}
```

---

### 4. API TO UPDATE VENDOR TDS MAPPING

**Endpoint**: `PUT /api/tds/vendors/{vendorId}/update-tds`

**Authorization**: Account Executive role required

**Description**: Updates existing TDS mapping for a vendor

**URL Parameter**

- `{vendorId}` (number, required): Vendor ID

**Request Body (JSON)**

```json
{
  "sectionId": 2,
  "section": "194J",
  "rate": "10%",
  "description": "Fees for professional services",
  "remarks": "Changed to professional services category",
  "updatedBy": "AE001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "TDS mapping updated successfully",
  "vendorMapping": {
    "vendorId": 1,
    "vendorCode": "V001",
    "vendorName": "Asha Suppliers",
    "tdsMapping": {
      "sectionId": 2,
      "section": "194J",
      "description": "Fees for professional services",
      "rate": "10%",
      "rateNumeric": 10.0,
      "remarks": "Changed to professional services category",
      "mappedDate": "2025-12-15T10:30:00.000Z",
      "lastUpdatedDate": "2026-02-04T12:00:00.000Z",
      "mappedBy": "AE001",
      "updatedBy": "AE001"
    }
  },
  "auditLog": {
    "action": "TDS_MAPPING_UPDATED",
    "previousMapping": {
      "section": "194C",
      "rate": "1%"
    },
    "newMapping": {
      "section": "194J",
      "rate": "10%"
    },
    "timestamp": "2026-02-04T12:00:00.000Z"
  }
}
```

---

### 5. API TO DELETE VENDOR TDS MAPPING

**Endpoint**: `DELETE /api/tds/vendors/{vendorId}/remove-tds`

**Authorization**: Account Executive role required

**Description**: Removes TDS mapping from a vendor (unmaps TDS section)

**URL Parameter**

- `{vendorId}` (number, required): Vendor ID

**Request Body (JSON)**

```json
{
  "reason": "Vendor no longer applicable for TDS",
  "deletedBy": "AE001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "TDS mapping removed successfully",
  "vendorId": 1,
  "vendorName": "Asha Suppliers",
  "previousMapping": {
    "section": "194C",
    "rate": "1%",
    "mappedDate": "2025-12-15T10:30:00.000Z"
  },
  "auditLog": {
    "action": "TDS_MAPPING_DELETED",
    "reason": "Vendor no longer applicable for TDS",
    "deletedBy": "AE001",
    "deletedDate": "2026-02-04T13:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request - Has Pending Transactions)**

```json
{
  "success": false,
  "message": "Cannot remove TDS mapping",
  "error": "Vendor has pending TDS transactions. Complete or reverse them before removing mapping.",
  "vendorId": 1,
  "pendingTransactions": 3,
  "pendingTDSAmount": 15000.0
}
```

---

## PART 2: INCOME TAX STATUTORY MASTER (BILLING MANAGER)

### 7. API TO FETCH ALL STATUTORY CONFIGURATIONS

**Endpoint**: `GET /api/tds/statutory-master`

**Authorization**: Billing Manager role required

**Description**: Fetches all Income Tax statutory configurations

**Query Parameters**

| Parameter      | Type    | Required | Description                                 |
| -------------- | ------- | -------- | ------------------------------------------- |
| section        | String  | No       | Filter by section code (194C, 194J, etc.)   |
| type           | String  | No       | Filter by 'Corporate' or 'Non-Corporate'    |
| description    | String  | No       | Search in description (partial match)       |
| applicableFrom | String  | No       | Filter by applicable from date (YYYY-MM-DD) |
| remarks        | String  | No       | Search in remarks (partial match)           |
| activeOnly     | Boolean | No       | Get only active entries (default: true)     |
| page           | Number  | No       | Page number for pagination                  |
| limit          | Number  | No       | Items per page (default: 20)                |

**Success Response (200 OK)**

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "pageSize": 20
  },
  "summary": {
    "totalSections": 5,
    "corporateSections": 3,
    "nonCorporateSections": 2,
    "activeRates": 5
  },
  "statutoryData": [
    {
      "id": 1,
      "section": "194C",
      "description": "Payment to contractors",
      "rate": "1%",
      "rateNumeric": 1.0,
      "type": "Corporate",
      "applicableFrom": "2022-04-01",
      "applicableTo": null,
      "remarks": "Contractors & Sub-Contractors",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-03-15T09:00:00.000Z",
      "lastUpdatedBy": null,
      "lastUpdatedDate": null,
      "usageCount": 45,
      "mappedVendors": 15
    },
    {
      "id": 2,
      "section": "194J",
      "description": "Fees for professional services",
      "rate": "10%",
      "rateNumeric": 10.0,
      "type": "Corporate",
      "applicableFrom": "2023-01-01",
      "applicableTo": null,
      "remarks": "Legal & Consulting Services",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-03-15T09:00:00.000Z",
      "lastUpdatedBy": null,
      "lastUpdatedDate": null,
      "usageCount": 28,
      "mappedVendors": 8
    },
    {
      "id": 3,
      "section": "194I",
      "description": "Rent payments",
      "rate": "2%",
      "rateNumeric": 2.0,
      "type": "Corporate",
      "applicableFrom": "2023-04-01",
      "applicableTo": null,
      "remarks": "Property & Equipment Rent",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-04-10T11:30:00.000Z",
      "lastUpdatedBy": null,
      "lastUpdatedDate": null,
      "usageCount": 12,
      "mappedVendors": 5
    },
    {
      "id": 4,
      "section": "194H",
      "description": "Commission payments",
      "rate": "5%",
      "rateNumeric": 5.0,
      "type": "Non-Corporate",
      "applicableFrom": "2023-01-01",
      "applicableTo": null,
      "remarks": "Agent Commission",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-05-20T10:00:00.000Z",
      "lastUpdatedBy": null,
      "lastUpdatedDate": null,
      "usageCount": 6,
      "mappedVendors": 3
    },
    {
      "id": 5,
      "section": "194A",
      "description": "Interest payments",
      "rate": "7.50%",
      "rateNumeric": 7.5,
      "type": "Corporate",
      "applicableFrom": "2024-01-01",
      "applicableTo": null,
      "remarks": "Interest on Loans",
      "isActive": true,
      "createdBy": "BM001",
      "createdDate": "2024-06-15T14:45:00.000Z",
      "lastUpdatedBy": null,
      "lastUpdatedDate": null,
      "usageCount": 2,
      "mappedVendors": 1
    }
  ]
}
```

---

### 8. API TO CREATE NEW STATUTORY ENTRY

**Endpoint**: `POST /api/tds/statutory-master`

**Authorization**: Billing Manager role required

**Description**: Creates a new Income Tax statutory configuration

**Request Body (JSON)**

```json
{
  "section": "194C",
  "description": "Payment to contractors",
  "rate": "1.00",
  "type": "Corporate",
  "applicableFrom": "2022-04-01",
  "applicableTo": null,
  "remarks": "Contractors & Sub-Contractors for construction work",
  "createdBy": "BM001"
}
```

**Request Body Schema**

| Field          | Type   | Required | Description                                    |
| -------------- | ------ | -------- | ---------------------------------------------- |
| section        | String | Yes      | TDS section code (194A-194M)                   |
| description    | String | Yes      | Description of the section                     |
| rate           | String | Yes      | TDS rate in percentage (e.g., "1.00", "10.00") |
| type           | String | Yes      | 'Corporate' or 'Non-Corporate'                 |
| applicableFrom | String | Yes      | Effective date (YYYY-MM-DD)                    |
| applicableTo   | String | No       | End date (YYYY-MM-DD), null for ongoing        |
| remarks        | String | No       | Additional notes                               |
| createdBy      | String | Yes      | User ID creating the entry                     |

**Validation Rules**

1. Section must be valid Income Tax section (194A to 194M)
2. Rate must be between 0.01 and 30.00 (as percentage)
3. Rate must be numeric with up to 2 decimal places
4. Type must be either 'Corporate' or 'Non-Corporate'
5. applicableFrom must be valid date
6. If applicableTo is provided, it must be after applicableFrom

**Success Response (201 Created)**

```json
{
  "success": true,
  "message": "Statutory configuration created successfully",
  "statutory": {
    "id": 11,
    "section": "194C",
    "description": "Payment to contractors",
    "rate": "1.00%",
    "rateNumeric": 1.0,
    "type": "Corporate",
    "applicableFrom": "2022-04-01",
    "applicableTo": null,
    "remarks": "Contractors & Sub-Contractors for construction work",
    "isActive": true,
    "createdBy": "BM001",
    "createdDate": "2026-02-04T14:00:00.000Z"
  },
  "auditLog": {
    "action": "STATUTORY_CREATED",
    "section": "194C",
    "performedBy": "BM001",
    "timestamp": "2026-02-04T14:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request - Invalid Rate)**

```json
{
  "success": false,
  "message": "Invalid TDS rate",
  "error": "Rate must be between 0.01% and 30.00%. Provided: 35.00%",
  "field": "rate",
  "providedValue": "35.00"
}
```

**Error Response (409 Conflict - Duplicate Section)**

```json
{
  "success": false,
  "message": "Duplicate statutory entry",
  "error": "Section 194C with type 'Corporate' already exists and is active",
  "existingEntry": {
    "id": 1,
    "section": "194C",
    "rate": "1%",
    "applicableFrom": "2022-04-01"
  }
}
```

---

### 9. API TO UPDATE STATUTORY ENTRY

**Endpoint**: `PUT /api/tds/statutory-master/{statutoryId}`

**Authorization**: Billing Manager role required

**Description**: Updates an existing Income Tax statutory configuration

**URL Parameter**

- `{statutoryId}` (number, required): Statutory entry ID

**Request Body (JSON)**

```json
{
  "description": "Payment to contractors and sub-contractors",
  "rate": "2.00",
  "applicableTo": "2026-03-31",
  "remarks": "Updated rate from 1% to 2% effective FY 2025-26",
  "updatedBy": "BM001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Statutory configuration updated successfully",
  "statutory": {
    "id": 1,
    "section": "194C",
    "description": "Payment to contractors and sub-contractors",
    "rate": "2.00%",
    "rateNumeric": 2.0,
    "type": "Corporate",
    "applicableFrom": "2022-04-01",
    "applicableTo": "2026-03-31",
    "remarks": "Updated rate from 1% to 2% effective FY 2025-26",
    "isActive": true,
    "createdBy": "BM001",
    "createdDate": "2024-03-15T09:00:00.000Z",
    "lastUpdatedBy": "BM001",
    "lastUpdatedDate": "2026-02-04T15:00:00.000Z"
  },
  "auditLog": {
    "action": "STATUTORY_UPDATED",
    "previousRate": "1.00%",
    "newRate": "2.00%",
    "performedBy": "BM001",
    "timestamp": "2026-02-04T15:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request - Has Active Mappings)**

```json
{
  "success": false,
  "message": "Cannot update rate",
  "error": "This statutory section has 15 active vendor mappings. Changing rate will affect ongoing transactions.",
  "statutoryId": 1,
  "section": "194C",
  "mappedVendors": 15,
  "recommendation": "Create new entry with new rate and set applicableTo date for current entry"
}
```

---

### 10. API TO DELETE STATUTORY ENTRY

**Endpoint**: `DELETE /api/tds/statutory-master/{statutoryId}`

**Authorization**: Billing Manager role required

**Description**: Deletes or deactivates a statutory configuration

**URL Parameter**

- `{statutoryId}` (number, required): Statutory entry ID

**Request Body (JSON)**

```json
{
  "reason": "Section no longer applicable",
  "deletedBy": "BM001",
  "forceDelete": false
}
```

**Request Body Schema**

| Field       | Type    | Required | Description                                             |
| ----------- | ------- | -------- | ------------------------------------------------------- |
| reason      | String  | Yes      | Reason for deletion                                     |
| deletedBy   | String  | Yes      | User ID performing deletion                             |
| forceDelete | Boolean | No       | Force delete even with active mappings (default: false) |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Statutory entry deactivated successfully",
  "statutory": {
    "id": 5,
    "section": "194A",
    "description": "Interest payments",
    "rate": "7.50%",
    "isActive": false,
    "deactivatedBy": "BM001",
    "deactivatedDate": "2026-02-04T16:00:00.000Z",
    "deactivationReason": "Section no longer applicable"
  },
  "auditLog": {
    "action": "STATUTORY_DELETED",
    "section": "194A",
    "performedBy": "BM001",
    "timestamp": "2026-02-04T16:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request - Has Active Mappings)**

```json
{
  "success": false,
  "message": "Cannot delete statutory entry",
  "error": "This section is currently mapped to 15 active vendors. Remove all vendor mappings first or use forceDelete option.",
  "statutoryId": 1,
  "section": "194C",
  "mappedVendors": 15,
  "mappedVendorsList": ["V001", "V003", "V006", "V009", "V012"],
  "recommendation": "Remap vendors to different section before deleting"
}
```

---

## PART 3: AUTOMATIC TDS JOURNAL VOUCHER GENERATION

### 11. API TO PROCESS EXPENSE WITH TDS (AUTO JV)

**Endpoint**: `POST /api/tds/auto-jv/process-expense`

**Authorization**: System/Internal (triggered automatically during expense booking)

**Description**: Automatically generates TDS Journal Voucher when expense is booked for TDS-mapped vendor

**Request Body (JSON)**

```json
{
  "invoiceId": "INV-2025-0123",
  "invoiceNumber": "ABC-INV-001",
  "invoiceDate": "2026-02-01",
  "vendorId": 1,
  "vendorName": "Asha Suppliers",
  "vendorCode": "V001",
  "vendorGLCode": "L2005002_001",
  "panNumber": "AABCU9603R",
  "totalAmount": 118000.0,
  "taxableAmount": 100000.0,
  "gstRate": 18,
  "gstAmount": 18000.0,
  "cgst": 9000.0,
  "sgst": 9000.0,
  "expenseType": "HK Material",
  "expenseGLCode": "X2001005",
  "tdsApplicable": true,
  "tdsSection": "194C",
  "tdsRate": "1%",
  "costCenter": "HEAD OFFICE",
  "site": "MH01",
  "processedBy": "AE001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "TDS Journal Voucher generated successfully",
  "voucherDetails": {
    "voucherNumber": "JV-TDS-20260204-0001",
    "voucherType": "Purchase Voucher (TDS)",
    "voucherDate": "2026-02-04",
    "transactionId": "TXN_TDS_1738668000000",
    "invoiceNumber": "ABC-INV-001",
    "vendorName": "Asha Suppliers",
    "panNumber": "AABCU9603R"
  },
  "tdsCalculation": {
    "totalAmount": 118000.0,
    "taxableAmount": 100000.0,
    "gstAmount": 18000.0,
    "tdsSection": "194C",
    "tdsRate": 1.0,
    "tdsBaseAmount": 100000.0,
    "tdsAmount": 1000.0,
    "netPayable": 117000.0
  },
  "glEntries": [
    {
      "lineNo": 1,
      "glCode": "X2001005",
      "glName": "HK MATERIAL EXPENSE",
      "debit": 100000.0,
      "credit": 0,
      "narration": "HK Material - Invoice ABC-INV-001",
      "costCenter": "HEAD OFFICE",
      "department": "Operations"
    },
    {
      "lineNo": 2,
      "glCode": "A3007001001",
      "glName": "CGST INPUT",
      "debit": 9000.0,
      "credit": 0,
      "narration": "CGST @9% on Invoice ABC-INV-001",
      "costCenter": "HEAD OFFICE",
      "department": "Accounts"
    },
    {
      "lineNo": 3,
      "glCode": "A3007001002",
      "glName": "SGST INPUT",
      "debit": 9000.0,
      "credit": 0,
      "narration": "SGST @9% on Invoice ABC-INV-001",
      "costCenter": "HEAD OFFICE",
      "department": "Accounts"
    },
    {
      "lineNo": 4,
      "glCode": "L2003001",
      "glName": "TDS PAYABLE - 194C",
      "debit": 0,
      "credit": 1000.0,
      "narration": "TDS @1% on Invoice ABC-INV-001 - Section 194C",
      "costCenter": "HEAD OFFICE",
      "department": "Accounts"
    },
    {
      "lineNo": 5,
      "glCode": "L2005002_001",
      "glName": "VENDOR - Asha Suppliers",
      "debit": 0,
      "credit": 117000.0,
      "narration": "Invoice ABC-INV-001 - Payable (Net of TDS)",
      "costCenter": "HEAD OFFICE",
      "department": "Accounts"
    }
  ],
  "balanceValidation": {
    "totalDebit": 118000.0,
    "totalCredit": 118000.0,
    "difference": 0,
    "isBalanced": true
  },
  "quarterInfo": {
    "financialYear": "2025-26",
    "quarter": "Q4",
    "quarterPeriod": "Jan-Mar 2026",
    "dueDate": "2026-04-07",
    "daysRemaining": 62
  },
  "ledgerUpdates": {
    "expenseLedger": {
      "glCode": "X2001005",
      "previousBalance": 500000.0,
      "newBalance": 600000.0,
      "change": 100000.0
    },
    "tdsPayableLedger": {
      "glCode": "L2003001",
      "previousBalance": 56540.0,
      "newBalance": 57540.0,
      "change": 1000.0
    },
    "vendorLedger": {
      "glCode": "L2005002_001",
      "previousBalance": 250000.0,
      "newBalance": 367000.0,
      "change": 117000.0
    }
  }
}
```

**Error Response (400 Bad Request - Vendor Not Mapped)**

```json
{
  "success": false,
  "message": "TDS mapping not found for vendor",
  "error": "Vendor 'Shree Traders' (V002) does not have TDS section mapped. Map TDS section before processing expense.",
  "vendorId": 2,
  "vendorName": "Shree Traders",
  "requiredAction": "Map vendor to appropriate TDS section in Vendor TDS Mapping"
}
```

**Error Response (400 Bad Request - Invalid PAN)**

```json
{
  "success": false,
  "message": "Invalid or missing PAN",
  "error": "Vendor PAN 'INVALID123' is not valid. Valid PAN format required for TDS deduction.",
  "vendorId": 1,
  "vendorName": "Asha Suppliers",
  "providedPAN": "INVALID123",
  "panFormat": "AAAAA9999A"
}
```

---

### 12. API TO GET TDS CALCULATION PREVIEW

**Endpoint**: `POST /api/tds/calculate-preview`

**Authorization**: Any authenticated user

**Description**: Calculates TDS amount for preview before final expense booking

**Request Body (JSON)**

```json
{
  "vendorId": 1,
  "totalAmount": 118000.0,
  "gstRate": 18,
  "expenseType": "HK Material"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "preview": {
    "vendorName": "Asha Suppliers",
    "panNumber": "AABCU9603R",
    "tdsSection": "194C",
    "tdsDescription": "Payment to contractors",
    "tdsRate": "1%",
    "calculation": {
      "totalInvoiceAmount": 118000.0,
      "taxableAmount": 100000.0,
      "gstAmount": 18000.0,
      "tdsBaseAmount": 100000.0,
      "tdsAmount": 1000.0,
      "netPayableToVendor": 117000.0
    },
    "breakdown": {
      "expenseAmount": 100000.0,
      "cgstAmount": 9000.0,
      "sgstAmount": 9000.0,
      "tdsDeduction": -1000.0,
      "finalPayable": 117000.0
    },
    "quarterInfo": {
      "quarter": "Q4 FY25-26",
      "dueDate": "2026-04-07",
      "daysUntilDue": 62
    }
  }
}
```

---

## PART 4: TDS LEDGER MANAGEMENT

### 13. API TO FETCH TDS LEDGER TRANSACTIONS

**Endpoint**: `GET /api/tds/ledger/transactions`

**Authorization**: Account Executive, Billing Manager, Finance Head

**Description**: Fetches TDS payable ledger transactions with detailed entries

**Query Parameters**

| Parameter     | Type   | Required | Description                                        |
| ------------- | ------ | -------- | -------------------------------------------------- |
| fromDate      | String | No       | Start date (YYYY-MM-DD)                            |
| toDate        | String | No       | End date (YYYY-MM-DD)                              |
| section       | String | No       | Filter by TDS section (194C, 194J, etc.)           |
| entryType     | String | No       | Filter by type: 'deduction', 'payment', 'reversal' |
| vendor        | String | No       | Filter by vendor name or code                      |
| quarter       | String | No       | Filter by quarter (Q1, Q2, Q3, Q4)                 |
| financialYear | String | No       | Filter by FY (e.g., "2025-26")                     |
| page          | Number | No       | Page number for pagination                         |
| limit         | Number | No       | Items per page (default: 50)                       |

**Success Response (200 OK)**

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 120,
    "pageSize": 50
  },
  "ledgerSummary": {
    "glCode": "L2003001",
    "glName": "TDS PAYABLE",
    "accountType": "Liability",
    "financialYear": "2025-26",
    "openingBalance": {
      "date": "2025-04-01",
      "amount": 45000.0,
      "balanceType": "Credit"
    },
    "currentBalance": {
      "amount": 56540.0,
      "balanceType": "Credit",
      "asOfDate": "2026-02-04"
    },
    "periodSummary": {
      "totalDeductions": 11540.0,
      "totalPayments": 0,
      "netPayable": 56540.0,
      "numberOfDeductions": 8,
      "numberOfPayments": 0
    }
  },
  "quarterBreakdown": [
    {
      "quarter": "Q1 (Apr-Jun 2025)",
      "tdsDeducted": 5000.0,
      "tdsPaid": 0,
      "balance": 50000.0,
      "dueDate": "2025-07-07",
      "status": "overdue"
    },
    {
      "quarter": "Q2 (Jul-Sep 2025)",
      "tdsDeducted": 3200.0,
      "tdsPaid": 0,
      "balance": 53200.0,
      "dueDate": "2025-10-07",
      "status": "overdue"
    },
    {
      "quarter": "Q3 (Oct-Dec 2025)",
      "tdsDeducted": 2340.0,
      "tdsPaid": 0,
      "balance": 55540.0,
      "dueDate": "2026-01-07",
      "status": "overdue"
    },
    {
      "quarter": "Q4 (Jan-Mar 2026)",
      "tdsDeducted": 1000.0,
      "tdsPaid": 0,
      "balance": 56540.0,
      "dueDate": "2026-04-07",
      "status": "safe"
    }
  ],
  "transactions": [
    {
      "id": 1,
      "date": "2025-04-01",
      "voucherNo": "OB-2025",
      "entryType": "opening",
      "debit": null,
      "credit": 45000.0,
      "balance": 45000.0,
      "balanceType": "cr",
      "narration": "Opening Balance B/F - Q4 FY 2024-25",
      "paymentVoucher": "-",
      "vendor": "-",
      "pan": "-",
      "paymentAmount": null,
      "tdsRate": null,
      "tdsAmount": 45000.0,
      "quarter": "Q4 FY24-25",
      "dueDate": "2025-04-07",
      "dueStatus": "overdue",
      "daysOverdue": 302,
      "section": "-",
      "costCenter": "-",
      "attachments": 0,
      "status": "pending"
    },
    {
      "id": 2,
      "date": "2025-04-10",
      "voucherNo": "JV-TDS-20250410-0056",
      "entryType": "deduction",
      "debit": null,
      "credit": 1000.0,
      "balance": 46000.0,
      "balanceType": "cr",
      "narration": "TDS @1% on Invoice ABC-INV-001 - Section 194C",
      "vendorDetails": "Invoice: ABC-INV-001 | Taxable: ₹1,00,000",
      "paymentVoucher": "PAY-2025-0056",
      "vendor": "Asha Suppliers (L2005002_001)",
      "pan": "AABCU9603R",
      "paymentAmount": 100000.0,
      "tdsRate": "1%",
      "tdsAmount": 1000.0,
      "quarter": "Q1 FY25-26",
      "section": "194C",
      "dueDate": "2025-07-07",
      "dueStatus": "overdue",
      "daysOverdue": 212,
      "costCenter": "HEAD OFFICE",
      "site": "MH01",
      "customer": "-",
      "state": "Maharashtra",
      "attachments": 2,
      "status": "deducted",
      "invoiceNumber": "ABC-INV-001",
      "invoiceDate": "2025-04-08"
    },
    {
      "id": 3,
      "date": "2025-05-20",
      "voucherNo": "JV-TDS-20250520-0089",
      "entryType": "deduction",
      "debit": null,
      "credit": 1500.0,
      "balance": 47500.0,
      "balanceType": "cr",
      "narration": "TDS @1% on Invoice ABC-INV-002 - Section 194C",
      "vendorDetails": "Invoice: ABC-INV-002 | Partial Payment | Taxable: ₹1,50,000",
      "paymentVoucher": "PAY-2025-0089",
      "vendor": "Asha Suppliers (L2005002_001)",
      "pan": "AABCU9603R",
      "paymentAmount": 150000.0,
      "tdsRate": "1%",
      "tdsAmount": 1500.0,
      "quarter": "Q1 FY25-26",
      "section": "194C",
      "dueDate": "2025-07-07",
      "dueStatus": "overdue",
      "daysOverdue": 212,
      "costCenter": "MH-SITE-001",
      "site": "MH01",
      "customer": "Client A",
      "state": "Maharashtra",
      "attachments": 3,
      "status": "deducted",
      "invoiceNumber": "ABC-INV-002",
      "invoiceDate": "2025-05-18"
    },
    {
      "id": 4,
      "date": "2025-06-15",
      "voucherNo": "JV-TDS-20250615-0145",
      "entryType": "deduction",
      "debit": null,
      "credit": 10000.0,
      "balance": 57500.0,
      "balanceType": "cr",
      "narration": "TDS @10% on Invoice SUN-INV-001 - Section 194J",
      "vendorDetails": "Invoice: SUN-INV-001 | Taxable: ₹1,00,000",
      "paymentVoucher": "PAY-2025-0145",
      "vendor": "Sunrise Enterprises (L2005002_003)",
      "pan": "CCDEG5678H",
      "paymentAmount": 100000.0,
      "tdsRate": "10%",
      "tdsAmount": 10000.0,
      "quarter": "Q1 FY25-26",
      "section": "194J",
      "dueDate": "2025-07-07",
      "dueStatus": "overdue",
      "daysOverdue": 212,
      "costCenter": "HEAD OFFICE",
      "site": "MH01",
      "customer": "-",
      "state": "Karnataka",
      "attachments": 1,
      "status": "deducted",
      "invoiceNumber": "SUN-INV-001",
      "invoiceDate": "2025-06-10",
      "expenseType": "Professional Fees"
    }
  ]
}
```

---

### 14. API TO EXPORT TDS LEDGER DATA

**Endpoint**: `GET /api/tds/ledger/export`

**Authorization**: Account Executive, Billing Manager, Finance Head

**Description**: Exports TDS ledger data in CSV/Excel format for reporting and filing

**Query Parameters**

| Parameter             | Type    | Required | Description                                   |
| --------------------- | ------- | -------- | --------------------------------------------- |
| format                | String  | Yes      | Export format: 'csv' or 'excel'               |
| fromDate              | String  | Yes      | Start date (YYYY-MM-DD)                       |
| toDate                | String  | Yes      | End date (YYYY-MM-DD)                         |
| section               | String  | No       | Filter by TDS section                         |
| quarter               | String  | No       | Filter by quarter (Q1, Q2, Q3, Q4)            |
| includeOpeningBalance | Boolean | No       | Include opening balance entry (default: true) |
| groupByVendor         | Boolean | No       | Group transactions by vendor (default: false) |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "TDS ledger data exported successfully",
  "exportInfo": {
    "format": "excel",
    "fileName": "TDS_Ledger_Q1_FY2025-26.xlsx",
    "fileSize": "45 KB",
    "totalRecords": 120,
    "dateRange": {
      "from": "2025-04-01",
      "to": "2025-06-30"
    },
    "downloadUrl": "/downloads/tds-exports/TDS_Ledger_Q1_FY2025-26.xlsx",
    "expiresAt": "2026-02-05T14:00:00.000Z"
  },
  "summary": {
    "totalDeductions": 5000.0,
    "totalVendors": 8,
    "totalInvoices": 12,
    "bySection": {
      "194C": 3200.0,
      "194J": 1800.0
    }
  }
}
```

**CSV File Structure**

```
Date,Voucher No,Entry Type,Debit (₹),Credit (₹),Balance (₹),Balance Type,Narration,Vendor,PAN,Payment Amount (₹),TDS Rate,TDS Amount (₹),Quarter,Section,Due Date,Cost Center,Site,Status
2025-04-01,OB-2025,opening,,-,45000.00,45000.00,CR,Opening Balance B/F - Q4 FY 2024-25,-,-,-,-,45000.00,Q4 FY24-25,-,2025-04-07,-,-,pending
2025-04-10,JV-TDS-20250410-0056,deduction,,-,1000.00,46000.00,CR,TDS @1% on Invoice ABC-INV-001 - Section 194C,Asha Suppliers,AABCU9603R,100000.00,1%,1000.00,Q1 FY25-26,194C,2025-07-07,HEAD OFFICE,MH01,deducted
```

---

### 15. API TO GET TDS SUMMARY REPORT

**Endpoint**: `GET /api/tds/reports/summary`

**Authorization**: Account Executive, Billing Manager, Finance Head

**Description**: Provides comprehensive TDS summary with quarterly breakdown and section-wise analysis

**Query Parameters**

| Parameter     | Type   | Required | Description                                                   |
| ------------- | ------ | -------- | ------------------------------------------------------------- |
| financialYear | String | Yes      | Financial year (e.g., "2025-26")                              |
| quarter       | String | No       | Specific quarter (Q1, Q2, Q3, Q4), or all quarters if omitted |

**Success Response (200 OK)**

```json
{
  "success": true,
  "financialYear": "2025-26",
  "reportDate": "2026-02-04",
  "overallSummary": {
    "openingBalance": 45000.0,
    "totalDeducted": 11540.0,
    "totalPaid": 0,
    "closingBalance": 56540.0,
    "numberOfVendors": 15,
    "numberOfDeductions": 8,
    "numberOfPayments": 0
  },
  "quarterlyBreakdown": [
    {
      "quarter": "Q1",
      "period": "Apr-Jun 2025",
      "openingBalance": 45000.0,
      "deductions": 5000.0,
      "payments": 0,
      "closingBalance": 50000.0,
      "dueDate": "2025-07-07",
      "status": "overdue",
      "daysOverdue": 212,
      "penalty": 0
    },
    {
      "quarter": "Q2",
      "period": "Jul-Sep 2025",
      "openingBalance": 50000.0,
      "deductions": 3200.0,
      "payments": 0,
      "closingBalance": 53200.0,
      "dueDate": "2025-10-07",
      "status": "overdue",
      "daysOverdue": 120,
      "penalty": 0
    },
    {
      "quarter": "Q3",
      "period": "Oct-Dec 2025",
      "openingBalance": 53200.0,
      "deductions": 2340.0,
      "payments": 0,
      "closingBalance": 55540.0,
      "dueDate": "2026-01-07",
      "status": "overdue",
      "daysOverdue": 28,
      "penalty": 0
    },
    {
      "quarter": "Q4",
      "period": "Jan-Mar 2026",
      "openingBalance": 55540.0,
      "deductions": 1000.0,
      "payments": 0,
      "closingBalance": 56540.0,
      "dueDate": "2026-04-07",
      "status": "safe",
      "daysRemaining": 62,
      "penalty": 0
    }
  ],
  "sectionWiseBreakdown": [
    {
      "section": "194C",
      "description": "Payment to contractors",
      "rate": "1%",
      "totalDeductions": 6540.0,
      "numberOfVendors": 10,
      "numberOfTransactions": 18,
      "averageDeduction": 363.33,
      "largestDeduction": 2000.0,
      "smallestDeduction": 100.0
    },
    {
      "section": "194J",
      "description": "Professional fees",
      "rate": "10%",
      "totalDeductions": 5000.0,
      "numberOfVendors": 5,
      "numberOfTransactions": 12,
      "averageDeduction": 416.67,
      "largestDeduction": 10000.0,
      "smallestDeduction": 500.0
    }
  ],
  "topVendors": [
    {
      "vendorName": "Asha Suppliers",
      "vendorCode": "V001",
      "panNumber": "AABCU9603R",
      "section": "194C",
      "totalDeductions": 2500.0,
      "numberOfInvoices": 4,
      "lastDeductionDate": "2025-12-20"
    },
    {
      "vendorName": "Sunrise Enterprises",
      "vendorCode": "V003",
      "panNumber": "CCDEG5678H",
      "section": "194J",
      "totalDeductions": 20000.0,
      "numberOfInvoices": 2,
      "lastDeductionDate": "2025-12-22"
    }
  ],
  "complianceStatus": {
    "overdueQuarters": 3,
    "totalOverdueAmount": 55540.0,
    "nextDueDate": "2026-04-07",
    "daysUntilNextDue": 62,
    "complianceRating": "Critical",
    "recommendations": [
      "Pay TDS for Q1 FY25-26 immediately to avoid additional penalties",
      "Clear overdue TDS for Q2 and Q3",
      "Maintain sufficient funds for Q4 payment"
    ]
  }
}
```

---

## COMMON ERROR RESPONSES

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required",
  "error": "User session expired or invalid token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied",
  "error": "You do not have permission to perform this action",
  "requiredRole": "Billing Manager",
  "userRole": "Account Executive"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Vendor with ID 999 does not exist",
  "resourceType": "Vendor",
  "resourceId": 999
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An internal error occurred",
  "error": "Database connection failed",
  "errorCode": "DB_CONNECTION_ERROR",
  "timestamp": "2026-02-04T14:30:00.000Z"
}
```

---

## GL CODE REFERENCE

### TDS Related GL Codes

| GL Code  | GL Name            | Account Type | Parent GL           | Description               |
| -------- | ------------------ | ------------ | ------------------- | ------------------------- |
| L2003001 | TDS PAYABLE - 194C | Liability    | L2003 (TDS Payable) | Contractors TDS liability |
| L2003002 | TDS PAYABLE - 194J | Liability    | L2003 (TDS Payable) | Professional fees TDS     |
| L2003003 | TDS PAYABLE - 194I | Liability    | L2003 (TDS Payable) | Rent TDS liability        |
| L2003004 | TDS PAYABLE - 194H | Liability    | L2003 (TDS Payable) | Commission TDS            |
| L2003005 | TDS PAYABLE - 194A | Liability    | L2003 (TDS Payable) | Interest TDS              |

### Expense GL Codes (for TDS calculation)

| GL Code     | GL Name             | Account Type | Used For                                  |
| ----------- | ------------------- | ------------ | ----------------------------------------- |
| X2001005    | HK MATERIAL EXPENSE | Expense      | Housekeeping material expenses (TDS 194C) |
| X2002002002 | PROFESSIONAL FEES   | Expense      | Legal, consulting fees (TDS 194J)         |
| X2002002003 | OTHER FEES          | Expense      | Miscellaneous fees (TDS varies)           |
| X2001006    | RENT EXPENSE        | Expense      | Property rent (TDS 194I)                  |

### Vendor Ledger GL Codes

| GL Code Pattern | GL Name                   | Account Type | Description                 |
| --------------- | ------------------------- | ------------ | --------------------------- |
| L2005002_xxx    | VENDOR - [Vendor Name]    | Liability    | Vendor payable (net of TDS) |
| L2005003_xxx    | VENDOR - [Property Owner] | Liability    | Rent vendor payable         |

---

## SAMPLE DATA FLOW

### Complete TDS Booking Lifecycle

**Step 1: Setup Phase (One-time)**

- **Day 1**: BM creates Income Tax Statutory Master
  - Section 194C: 1% for Contractors
  - Section 194J: 10% for Professional Services
  - Status: Active

- **Day 2**: AE maps vendors to TDS sections
  - Asha Suppliers (V001) → 194C (1%)
  - Sunrise Enterprises (V003) → 194J (10%)
  - Status: Mapped

**Step 2: Expense Booking (Day 10)**

- **Supervisor** creates expense booking:
  - Vendor: Asha Suppliers
  - Invoice: ABC-INV-001
  - Amount: ₹1,18,000 (including 18% GST)
  - Taxable: ₹1,00,000
  - GST: ₹18,000

**Step 3: System Auto-Processing**

- System checks: Is vendor TDS-mapped? → Yes (194C @ 1%)
- Calculates TDS: ₹1,00,000 × 1% = ₹1,000
- Net Payable: ₹1,18,000 - ₹1,000 = ₹1,17,000

**Step 4: Auto Journal Voucher Generation**

```
Voucher: JV-TDS-20260210-0001
Date: 2026-02-10

GL Entries:
Dr. X2001005 (HK Material)         ₹1,00,000
Dr. A3007001001 (CGST Input)       ₹9,000
Dr. A3007001002 (SGST Input)       ₹9,000
Cr. L2003001 (TDS Payable)         ₹1,000
Cr. L2005002_001 (Vendor)          ₹1,17,000
                                   ─────────
Total:                             ₹1,18,000  ₹1,18,000
```

**Step 5: Ledger Updates**

- TDS Payable Ledger (L2003001):
  - Previous: ₹56,540
  - TDS Deducted: ₹1,000
  - New Balance: ₹57,540 CR

- Vendor Ledger (L2005002_001):
  - Previous: ₹2,50,000 CR
  - New Liability: ₹1,17,000
  - New Balance: ₹3,67,000 CR

**Step 6: Quarterly Tracking**

- Quarter: Q4 FY25-26 (Jan-Mar 2026)
- Due Date: 2026-04-07
- Days Remaining: 56 days
- Status: Safe

**Step 7: Compliance & Payment (Before Due Date)**

- Finance generates TDS return (Form 26Q)
- Payment made to government
- TDS certificates issued to vendors
- Ledger updated with payment entry

**Result:**

- ✅ Automatic TDS deduction
- ✅ Proper GL posting
- ✅ Compliance maintained
- ✅ Vendor paid net amount
- ✅ TDS liability tracked

---

## END OF DOCUMENT

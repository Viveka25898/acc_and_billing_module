/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Auth/authSlice'
import advanceRequestReducer from './store/slices/advanceRequestSlice'
import advanceSettlementReducer from './store/slices/advanceSettlementSlice'
import chartOfAccountsReducer from './store/slices/chartOfAccountsSlice'
import aeInvoiceReducer from './store/slices/aeInvoiceSlice'
import amInvoiceReducer from './store/slices/amInvoiceSlice'
import relieverReducer from './store/slices/relieverSlice'
import conveyanceReducer from './store/slices/conveyanceSlice'
import rentExpenseReducer from './store/slices/rentExpenseSlice'
import vendorPaymentReducer from './store/slices/vendorPaymentSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    advanceRequest: advanceRequestReducer,
    advanceSettlement: advanceSettlementReducer,
    chartOfAccounts: chartOfAccountsReducer,
    aeInvoice: aeInvoiceReducer,
    amInvoice: amInvoiceReducer,
    reliever: relieverReducer,
    conveyance: conveyanceReducer,
    rentExpense: rentExpenseReducer,
    vendorPayment: vendorPaymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable File/Blob objects in download and submit actions
        ignoredActions: [
          'advanceSettlement/downloadTemplate/fulfilled',
          'advanceSettlement/submitSettlement/pending',
          'advanceSettlement/submitSettlement/fulfilled',
          'advanceSettlement/submitSettlement/rejected',
          'conveyance/submitConveyanceClaim/pending',
        ],
        ignoredActionPaths: ['payload.blob', 'meta.arg'],
      },
    }),
})

export default store


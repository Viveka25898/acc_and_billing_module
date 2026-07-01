/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Auth/authSlice'
import advanceRequestReducer from './store/slices/advanceRequestSlice'
import advanceSettlementReducer from './store/slices/advanceSettlementSlice'
import chartOfAccountsReducer from './store/slices/chartOfAccountsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    advanceRequest: advanceRequestReducer,
    advanceSettlement: advanceSettlementReducer,
    chartOfAccounts: chartOfAccountsReducer,
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
        ],
        ignoredActionPaths: ['payload.blob', 'meta.arg'],
      },
    }),
})

export default store


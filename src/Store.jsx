/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Auth/authSlice'
import advanceRequestReducer from './store/slices/advanceRequestSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    advanceRequest: advanceRequestReducer,
  },
})

export default store


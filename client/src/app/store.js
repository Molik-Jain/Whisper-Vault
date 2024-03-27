import {configureStore} from "@reduxjs/toolkit"
import loginReducer from '../features/auth/authSlice' 

export const store = configureStore({
    reducer:loginReducer
})
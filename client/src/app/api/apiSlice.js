import { createApi, fetchBasedQuery } from "@reduxjs/toolkit/query/react"
import {serCredentials, logOut} from "../../features/auth/authSlice" 


const basedQuery = fetchBasedQuery({
    basUrl:"http://localhost:8000"
})
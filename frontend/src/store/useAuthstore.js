import axios from "axios"
import {create} from "zustand"
import { axiosInstance } from "../lib/axios"


export const useAuthStore = create((set)=> ({
    authUser: null,

    isCheckingAuth: true,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,   
    
    checkAuth: async() => {
        try{
            const res = await axiosInstance.get("/auth/check")

            set({authUser:res.data})
        }
        catch(error){
            set({authUser: null})
            console.log("error in checkauth", error)
        }
        finally{
            set({isCheckingAuth: false})
        }
    }
}))
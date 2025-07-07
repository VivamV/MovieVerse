import axiosInstance from "../utils/axiosInstance";

export const login=async(payload)=>{
    const res=await axiosInstance.post('v1/login',payload,{withCredentials:true})
    return res;
}

export const register=async(payload)=>{
    const res=await axiosInstance.post('/v1/register',payload,{withCredentials:true});
    return res;
}

export const logoutApp=async()=>{
   const res= await axiosInstance.post('/v1/logout',{},{withCredentials:true});
   return res;
}

export const refreshToken=async()=>{
    const res=await axiosInstance.post('/v1/refresh-token',{},{withCredentials:true});
    return res;
}

export const checkAuth=async()=>{
    const res=await axiosInstance.get('/v1/check-auth',{withCredentials:true});
    return res;
}

export const getUserDetails=async()=>{
    const res=await axiosInstance.get('/v1/get-user-id',{withCredentials:true});
    return res;
}
import axiosInstance from "../utils/axiosInstance"

export const adminClearRedis=async()=>{
    const res=await axiosInstance.delete('/admin/clear-redis',{withCredentials:true});
    return res;
}

export const adminGetRedis=async()=>{
    const res=await axiosInstance.get('/admin/get-redis',{withCredentials:true});
     return res;
}
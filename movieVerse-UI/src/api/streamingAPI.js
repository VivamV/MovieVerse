import axiosInstance from "../utils/axiosInstance";
export const getStreamUploadedData=async()=>{
    const res=await axiosInstance.get('/v1/getUploadedStreamData',{withCredentials:true})
    return res;
}
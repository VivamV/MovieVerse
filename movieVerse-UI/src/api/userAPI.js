import axiosInstance from "../utils/axiosInstance";
export const getUserProfileDetails=async(userId)=>{
    const res=await axiosInstance.get('/v1/profile-details',{
    params: {
     userId
    },
    withCredentials: true,
  })
    return res;
}
import axiosInstance from "../utils/axiosInstance";

export const getReservedSeats = async (payload) => {
  const res = await axiosInstance.get('/v1/booked-seats', {
    params: {
      ...payload,
    },
    withCredentials: true,
  });
  return res;
};

export const lockSeats=async(payload)=>{
    const res=await axiosInstance.post('/v1/book-ticket',payload,{withCredentials:true});
    return res;
}

export const finalTicketBooking=async(payload)=>{
  const res=await axiosInstance.post('/v1/finalize-booking',payload,{withCredentials:true});
  return res;
}

export const deleteRedisLock=async(payload)=>{
  
  const res=await axiosInstance.post('/v1/clear-lock',payload,{withCredentials:true});
  return res;
}
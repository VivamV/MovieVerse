import { getUserDetails } from "../api/authAPI";
export const getUserId = () => {
    const userLocal = JSON.parse(localStorage.getItem("userDetails"));
    // const user=await getUserDetails();
    // console.log("user",user.data.userId);
    return userLocal?.userId  || null; 
  };
  
  // export default getUserId;

  export const getUserIdByToken =async () => {
    const user=await getUserDetails();
    // console.log("user",user.data.userId);
    return user?.data?.userId  || null; 
  };
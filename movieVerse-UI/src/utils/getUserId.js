// import { getUserDetails } from "../api/authAPI";
const getUserId = () => {
    const userLocal = JSON.parse(localStorage.getItem("userDetails"));
    // const user=await getUserDetails();
    // console.log("user",user.data.userId);
    return userLocal?.userId  || null; 
  };
  
  export default getUserId;
  
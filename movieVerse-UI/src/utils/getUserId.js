const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("userin"));
    return user?._id || null; // return the userId or null if not found
  };
  
  export default getUserId;
  
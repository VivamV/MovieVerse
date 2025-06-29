const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    return user?.userId || null; 
  };
  
  export default getUserId;
  
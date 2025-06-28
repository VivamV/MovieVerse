
import {Outlet,Navigate} from "react-router-dom"

const ProtectedRoutes=()=>{

//   const[user,setUser]=useState(null)
//   useEffect(()=>{
      //  setUser(SavedValue._id);
//   })
   const  user = JSON.parse(localStorage.getItem("userin"));

  return user ? <Outlet/> : <Navigate to="/"/>
}
export default ProtectedRoutes;
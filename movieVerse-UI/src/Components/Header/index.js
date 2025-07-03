import React from 'react';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getUserId from '../../utils/getUserId';
import useLogout from '../../Hooks/useLogout';


const HeaderComponent = ()=>{
    const navigate=useNavigate();
    const userId=getUserId();
    const logout=useLogout();
    const navData = [
        {name:'Home', link:'/'},
        {name:'Movies', link:'/movies'},
        {name:'Tv Series', link:'/series'},
        {name:'Search', link:'/search'},
        {name:'Profile', link:`/profile/${userId}`},
    ]

      const clearRedis = async () => {
        try {
          const res = await axios.delete("http://localhost:4000/admin/clear-redis",{withCredentials:true});
          console.log("Redis cleared:", res.data.message);
        } catch (error) {
          console.error("Error clearing Redis:", error.response?.data || error.message);
        }
      };
      
      const getRedis = async () => {
        try {
          const res = await axios.get("http://localhost:4000/admin/get-redis",{
          withCredentials: true 
         });
          console.log("Redis data received:", res.data);
        } catch (error) {
          console.error("Error fetching Redis data:", error.response?.data || error.message);
        }
      };
      
    return (
        <header  className='header'>
          <ToastContainer />
            <Navbar bg="dark" expand="lg">
                <Container>
                    <Navbar.Brand>MovieVerse</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        {
                            navData.map((item)=>{
                                return (
                                    <Nav key={item.name}>
                                        <Link to={item.link}>{item.name}</Link>
                                    </Nav> 
                                )
                            })
                        }
                    </Nav>
                    <button onClick={logout}>Logout</button>
                    {/* these two buttons are for testng purposes only ,i would delete them later */}
                    <button onClick={clearRedis}>ClearRedis</button>
                    <button onClick={getRedis}>GetRedis</button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
                    
        </header>
    )
}

export default HeaderComponent;
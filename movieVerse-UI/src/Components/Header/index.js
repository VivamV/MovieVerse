import React from "react";
import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import getUserId from "../../utils/getUserId";
import useLogout from "../../Hooks/useLogout";
// import { adminClearRedis, adminGetRedis } from '../../api/adminAPI';

const HeaderComponent = () => {
  const userId = getUserId();
  const logout = useLogout();
  const navData = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
    { name: "Tv Series", link: "/series" },
    { name: "Search", link: "/search" },
    { name: "Profile", link: `/profile/${userId}` },
  ];

  // const clearRedis = async () => {
  //   try {
  //     const res = await adminClearRedis();
  //   } catch (error) {
  //     console.error("Error clearing Redis:", error.response?.data || error.message);
  //   }
  // };

  // const getRedis = async () => {
  //   try {
  //     const res = await adminGetRedis()
  //   } catch (error) {
  //     console.error("Error fetching Redis data:", error.response?.data || error.message);
  //   }
  // };

  return (
    <header className="header">
      <Navbar bg="dark" expand="lg">
        <Container>
          <Navbar.Brand>MovieVerse</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {navData.map((item) => {
                return (
                  <Nav key={item.name}>
                    <Link to={item.link}>{item.name}</Link>
                  </Nav>
                );
              })}
            </Nav>
            <button
              onClick={logout}
              className="btn btn-outline-light me-2"
              style={{ borderRadius: "4px" }}
            >
              Logout
            </button>
            {/*admin Routes */}
            {/* <button onClick={clearRedis} className="btn btn-warning me-2">ClearRedis</button>
                    <button onClick={getRedis} className="btn btn-info" >GetRedis</button> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default HeaderComponent;

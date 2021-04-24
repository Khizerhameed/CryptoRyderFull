import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "../css/header.css";
import * as Icons from "phosphor-react";
import Dropdown from "react-bootstrap/Dropdown";

function Header() {
  const [top, setTop] = useState(true);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const SignOut = () => {
    localStorage.clear();
    history.push("/");
  };

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);
  return (
    <Router>
      <header className="fixed shadow-2xl px-4 w-full bg-white z-30  transition duration-300 ease-in-out ">
        <Navbar expand="lg">
          <Navbar.Brand href="/">
            <h3 className="font-Lobster text-3xl text-gray-700">CarVi</h3>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto text-center mt-0 sm:mt-5">
              {/* <Nav.Link href="/discover">Discover</Nav.Link>
              

              <Nav.Link href="/market">Market</Nav.Link>
              <Nav.Link href="/activity">Activity</Nav.Link> */}
              <Nav.Link href="/search" className="text-xl pr-5">
                Find Ride
                <i className="fas fa-search text-lg ml-3"></i>
              </Nav.Link>
              <Nav.Link href="/offerride" className="text-xl pr-5">
                Offer Rider
                <i className="fas fa-plus text-lg ml-3"></i>
              </Nav.Link>
              {localStorage.getItem("walletAddress") ? (
                <>
                  <Dropdown id="check">
                    <Dropdown.Toggle id="dropdown-basic">
                      <div class=" md:px-0 lg:px-0 flex flex-row ">
                        <div>
                          {" "}
                          <Icons.UserCircle
                            size={38}
                            color="black"
                            id="nav-avatar"
                          />
                        </div>
                        <div>
                          {" "}
                          {open ? (
                            <Icons.CaretUp size={25} color="black" />
                          ) : (
                            <Icons.CaretDown
                              size={25}
                              color="black"
                              className="mt-1"
                            />
                          )}
                        </div>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                      <Dropdown.Item href="/myrides">My Rides</Dropdown.Item>
                      <Dropdown.Item href="/mydriver">My Drives</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={SignOut}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Nav.Link href="/signin">SignIn</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </Router>
  );
}

export default Header;

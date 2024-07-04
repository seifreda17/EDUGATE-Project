import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { getAuthUser, removeAuthUser } from "../../../helper/Storage";
import "./header.css";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthUser());
  const history = useHistory();

  const handleLogout = () => {
    removeAuthUser();
    setIsAuthenticated(false);
    history.push("/login");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!getAuthUser());
    };

    const handleAuthChange = () => {
      setIsAuthenticated(!!getAuthUser());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const authUser = getAuthUser();

  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo">
            <img src="./images/logo.png" alt="" />
          </div>
          <div className="nav">
            <ul>
              {isAuthenticated && <Link to="/">Home</Link>}
              {<Link to="/about">About</Link>}
              {isAuthenticated && authUser && authUser.role === 0 && <Link to="/services">Types</Link>}
              {isAuthenticated && <Link to="/blog">Schools</Link>}
              {isAuthenticated && authUser && authUser.role === 0 && <Link to="/pricing">Top Schools</Link>}
              {isAuthenticated && authUser && authUser.role === 0 && <Link to="/contact">Contact</Link>}
              {isAuthenticated && authUser && <Link to="/FavoriteList">Favorites</Link>}
              {!isAuthenticated && <Link to="/register">Register</Link>}
              {!isAuthenticated && <Link to="/login">Login</Link>}
              {isAuthenticated && authUser && authUser.role === 1 && <Link to="/manageSchools">Manage schools</Link>}
              {isAuthenticated && authUser && authUser.role === 1 && <Link to="/ContactAdmin">FeedBack</Link>}
            </ul>
          </div>
          <div className="button flex">
            {isAuthenticated && (
              <button
                className="btn1"
                style={{ fontSize: "0.7em", marginRight: "15px" }}
                onClick={handleLogout}
              >
                <i className="fa fa-sign-out"></i> Logout
              </button>
            )}
          </div>
          <div className="toggle">
            <button>
              {isAuthenticated ? (
                <i className="fa fa-times"></i>
              ) : (
                <i className="fa fa-bars"></i>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
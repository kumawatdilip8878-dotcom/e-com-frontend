
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { REACT_APP_API_URL } from "../config/ApiConfig";

import Sidebar from "./Sidebar";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);


  useEffect(() => {
    if (token) {
      getProfile();
    }

    // Close dropdown when click outside
    const closeMenu = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, [token]);


  const getProfile = async () => {
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/user/profile`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE RESPONSE:", res.data);

      if (res.data.success) {
        setUser(res.data.data || {});
      }
    } catch (error) {
      console.log(
        "PROFILE ERROR:",
        error.response?.data || error
      );
    }
  };

  
  const logout = () => {
    localStorage.removeItem("token");

    setUser({});
    setOpen(false);

    navigate("/");
  };


  const getProfileImage = () => {
    if (!user?.profileImage) {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    if (
      user.profileImage.startsWith("http://") ||
      user.profileImage.startsWith("https://")
    ) {
      return user.profileImage;
    }

    return `${REACT_APP_API_URL}/${String(
      user.profileImage
    ).replace(/^\/+/, "")}`;
  };


  return (
    <>
     
        

      <Sidebar />

     

      <header className="main-header">

      

        <div className="logo">
          <h2>My E-Commerce</h2>
        </div>


        <div
          className="profile-box"
          ref={dropdownRef}
        >

          {/* PROFILE IMAGE + NAME */}

          <div
            className="profile-info"
            onClick={() => setOpen(!open)}
          >

            <img
              src={getProfileImage()}
              alt="Profile"
              className="profile-img"
              onError={(e) => {
                e.currentTarget.src =
                  "https:localhost3001/profile]";
              }}
            />

            <span className="profile-name">
              {user?.name || "User"}
            </span>

          </div>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {open && (
            <div className="profile-dropdown">

              <h4>
                {user?.name }
              </h4>

              <p>
                {user?.email || "No email"}
              </p>

              <hr />


              {/* MY PROFILE */}

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                My Profile
              </button>


        

              <button
                type="button"
                className="logout-btn"
                onClick={logout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </header>
    </>
  );
};

export default Header;

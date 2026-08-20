import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

const Profile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);
  const getProfile = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/admin/profile/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("PROFILE RESPONSE:", res.data);

      // Flexible handling
      if (res.data.success) {
        setUser(res.data.data || {});
      } else if (res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(res.data);
      }
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to load profile");
    }
  };

  // =====================================================
  // PROFILE IMAGE URL
  // =====================================================

  const getProfileImage = () => {
    if (!user?.profileImage) {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    const image = String(user.profileImage).trim();

    // Already complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Remove starting slash
    const cleanImage = image.replace(/^\/+/, "");

    return `${API_URL}/${cleanImage}`;
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* PROFILE IMAGE */}

        <img
          src={getProfileImage()}
          alt="Profile"
          className="profile-photo"
          onError={(e) => {
            console.log("PROFILE IMAGE ERROR:", e.currentTarget.src);

            e.currentTarget.src = "http://localhost:3001/profile";
          }}
        />

        {/* NAME */}

        <h2>{user.name || "User"}</h2>

        {/* USER DETAILS */}

        <table>
          <tbody>
            <tr>
              <td>
                <b>Email</b>
              </td>

              <td>{user.email || "-"}</td>
            </tr>

            <tr>
              <td>
                <b>Mobile</b>
              </td>

              <td>{user.mobile || "-"}</td>
            </tr>
          </tbody>
        </table>

        {/* BUTTONS */}

        <div className="profile-btns">
          <button type="button" onClick={() => navigate("/profile/edit")}>
            Edit Profile
          </button>

          <button
            type="button"
            className="change-btn"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

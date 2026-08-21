import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {REACT_APP_API_URL,REACT_APP_IMAGE_URL} from "../../config/ApiConfig"

const ChangePassword = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return alert("New Password and Confirm Password do not match");
    }

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/changePassword`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(res.data.message);

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      navigate("/profile");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Change Password</h2>

        <form onSubmit={changePassword}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

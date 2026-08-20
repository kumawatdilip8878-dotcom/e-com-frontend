import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

const DEFAULT_PROFILE =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const EditProfile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(DEFAULT_PROFILE);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // GET PROFILE
  // =====================================================

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }

      const res = await axios.post(`${API_URL}/admin/profile/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PROFILE:", res.data);

      if (res.data.success) {
        const user = res.data.data;

        // ===============================================
        // USER DATA
        // ===============================================

        setFormData({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
        });

        // ===============================================
        // CURRENT PROFILE IMAGE
        // ===============================================

        if (user.profileImage) {
          let imageUrl = user.profileImage;

          if (
            !imageUrl.startsWith("http://") &&
            !imageUrl.startsWith("https://")
          ) {
            imageUrl = `${API_URL}${imageUrl}`;
          }

          setImagePreview(imageUrl);
        }
      }
    } catch (error) {
      console.log("GET PROFILE ERROR:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }

    // ===============================================
    // CHECK IMAGE TYPE
    // ===============================================

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(selectedImage.type)) {
      alert("Only JPG, JPEG and PNG images are allowed.");

      e.target.value = "";
      return;
    }

    // ===============================================
    // CHECK IMAGE SIZE
    // ===============================================

    if (selectedImage.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");

      e.target.value = "";
      return;
    }

    // ===============================================
    // SAVE IMAGE
    // ===============================================

    setImage(selectedImage);

    // ===============================================
    // PREVIEW
    // ===============================================

    const previewUrl = URL.createObjectURL(selectedImage);

    setImagePreview(previewUrl);
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      // ===============================================
      // TEXT DATA
      // ===============================================

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);

      // ===============================================
      // PROFILE IMAGE
      // ===============================================

      if (image) {
        data.append("profileImage", image);
      }

      // ===============================================
      // API
      // ===============================================

      const res = await axios.post(`${API_URL}/admin/auth/profile/edit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("UPDATE PROFILE:", res.data);

      if (res.data.success) {
        alert(res.data.message || "Profile updated successfully");

        navigate("/profile");
      }
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Profile Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Edit Profile</h2>

        {/* =============================================
            PROFILE IMAGE
        ============================================= */}

        <div className="edit-profile-image">
          <img
            src={imagePreview}
            alt="Profile"
            className="edit-profile-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_PROFILE;
            }}
          />
        </div>

        {/* =============================================
            FORM
        ============================================= */}

        <form onSubmit={updateProfile} encType="multipart/form-data">
          {/* NAME */}

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* MOBILE */}

          <div className="form-group">
            <label>Mobile</label>

            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* PROFILE IMAGE */}

          <div className="form-group">
            <label>Profile Photo</label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
            />
          </div>

          {/* UPDATE BUTTON */}

          <div className="profile-buttons">
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

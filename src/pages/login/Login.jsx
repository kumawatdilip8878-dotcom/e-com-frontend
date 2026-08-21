import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  REACT_APP_API_URL,
  REACT_APP_IMAGE_URL,
} from "../../config/ApiConfig";


const Login = () => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      toast.error("Please enter mobile number and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${REACT_APP_API_URL}/admin/auth/loginby`,
        {
          mobile,
          password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.data)
        );

        toast.success(
          res.data.message || "Login Successfully"
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        toast.error(
          res.data.message || "Login failed"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background shapes */}

      <div className="login-bg-shape shape-one"></div>
      <div className="login-bg-shape shape-two"></div>
      <div className="login-bg-shape shape-three"></div>

      <div className="login-wrapper">

        {/* =====================================
            LEFT BRAND SECTION
        ===================================== */}

        <div className="login-brand">

          <div className="brand-content">

            <div className="brand-logo">
              {REACT_APP_IMAGE_URL ? (
                <img
                  src={`${REACT_APP_IMAGE_URL}/logo.png`}
                  alt="Logo"
                />
              ) : (
                <div className="logo-placeholder">
                  A
                </div>
              )}
            </div>

            <h1>
              Welcome to
              <span> Admin Panel</span>
            </h1>

            <p className="brand-description">
              Manage your users, products and
              everything from one powerful
              dashboard.
            </p>

            <div className="brand-features">

              <div className="feature-item">
                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Easy Management
                  </strong>

                  <p>
                    Manage your platform
                    effortlessly.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Secure Access
                  </strong>

                  <p>
                    Your admin account stays
                    protected.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Powerful Dashboard
                  </strong>

                  <p>
                    Everything you need in
                    one place.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="brand-footer">
            © 2026 Admin Panel. All rights reserved.
          </div>

        </div>

        {/* =====================================
            RIGHT LOGIN SECTION
        ===================================== */}

        <div className="login-form-section">

          <div className="login-card">

            <div className="mobile-logo">
              <div className="logo-placeholder">
                A
              </div>
            </div>

            <div className="login-heading">
              <span className="welcome-text">
                Welcome back 👋
              </span>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Enter your credentials to
                continue.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="login-form"
            >

              {/* MOBILE */}

              <div className="input-group">

                <label>
                  Mobile Number
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ☎
                  </span>

                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value)
                    }
                    maxLength={10}
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="input-group">

                <div className="password-label">

                  <label>
                    Password
                  </label>

                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>

                </div>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="loader"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="button-arrow">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>

            <div className="login-security">
              <span>🔐</span>
              Secure admin authentication
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
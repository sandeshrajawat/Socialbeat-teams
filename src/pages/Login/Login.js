import "./Login.css";
import React, { useState, useContext } from "react";
import { Button, Spin } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { API_ENDPOINT } from "../../entities/Endpoint";

function Login() {
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [otpFlag, setOtpFlag] = useState(false);
  const [devcode, setDevcode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setEmail, setHeaderFlag } = useContext(AppContext);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setUserNotFound(false);
    setOtpError(false);
    setLoading(true);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(socialbeat\.in|influencer\.in)$/;

    // if (input === "techauth@socialbeat.in") {
    //   setEmail(input);
    //   setHeaderFlag(true);
    //   navigate("/home");
    //   return;
    // }

    if (!emailRegex.test(input)) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_ENDPOINT}/login/validation`, {
        email: input,
      });

      if (response.data.status === "success") {
        setEmail(input);
        setOtpFlag(true);
        setDevcode(response.data.devCode || response.data.devcode);

        if (response.data.inHRTeam) {
          setHeaderFlag(true);
        }

        setOtpSent(true);
      } else {
        setUserNotFound(true);
      }
    } catch (err) {
      console.error("❌ Backend error:", err);
      setUserNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError(false);
    setLoading(true);

    await new Promise((res) => setTimeout(res, 500));

    if (otp === devcode) {
      try {
        localStorage.setItem("isLoggedIn", "true");
        // Verify that the value was successfully stored
        const storedValue = localStorage.getItem("isLoggedIn");
        if (storedValue === "true") {
          navigate("/home");
        } else {
          setOtpError(true);
          console.error("Failed to store login status in localStorage");
        }
      } catch (err) {
        console.error("Error storing login status:", err);
        setOtpError(true);
      }
    } else {
      setOtpError(true);
    }

    setLoading(false);
  };

  return (
    <>
      <div class="flex login-body items-center justify-center ps-2 pe-2 ">
        <div className=" login-form bg-white rounded-lg shadow-md py-2 px-6  sm:w-[50%] md:w-[60%] lg:!w-[35%]">
          <div>
            <form onSubmit={otpFlag ? handleOtpSubmit : handleEmailSubmit}>
              <img
                src="https://www.socialbeat.in/wp-content/themes/socialbeat/assets/images/sb-logos/sb_cheil_2025_logos.png"
                alt="Logo"
                className="w-40 brand-logo object-contain mx-auto"
              />
              <h2 className="text-base sm:text-xl !my-2 font-semibold text-start">
                Team Dashboard Login
              </h2>

              {!otpFlag && (
                <>
                  <input
                    type="email"
                    placeholder="Enter your company email"
                    value={input}
                    onChange={(e) => setInput(e.target.value.trim())}
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData
                        .getData("text")
                        .replace(/\s/g, "");
                      setInput(pasted);
                    }}
                    className="block border border-gray-300 rounded px-4 py-2 w-full !mb-2"
                    disabled={loading}
                  />

                  {error && (
                    <p className="text-red-500 mb-2 text-sm">
                      Only @socialbeat.in or @influencer.in email ID will be
                      valid to login
                    </p>
                  )}
                  {userNotFound && (
                    <p className="text-red-500 text-sm flex items-center gap-1 !mb-2">
                      <CloseCircleOutlined className="text-red-600 text-base" />
                      User does not exist
                    </p>
                  )}
                </>
              )}

              {otpError && (
                <p className="text-red-500 text-sm flex items-center gap-1 !mb-2">
                  <CloseCircleOutlined className="text-red-600 text-base" />
                  Invalid OTP. Please try again.
                </p>
              )}

              {otpFlag && (
                <>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim())}
                    className="border border-gray-300 rounded px-4 py-2 w-full !mb-2"
                    placeholder="Please enter your OTP"
                    disabled={loading}
                  />
                  {otpSent && (
                    <p className="text-green-600 text-sm mb-2">
                      OTP sent to your email. Please check your inbox.
                    </p>
                  )}
                </>
              )}

              <Button
                type="primary"
                ghost
                htmlType="submit"
                className="w-full flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading && <Spin size="small" />}
                {otpFlag ? "Verify OTP" : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

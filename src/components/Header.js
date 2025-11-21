// Header.js
import React, { useState, useContext, useRef, useCallback } from "react";
import {
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Spin, message } from "antd";
import { AppContext } from "../context/AppContext";
import CustomModal from "./Modal";
import Notification from "./Notification";
import IndividualDrawer from "../pages/Home/IndividualDrawer";
import { useNavigate } from "react-router-dom";
import "../pages/Home/Home.css";

function Header() {
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const drawerRef = useRef();
  const navigate = useNavigate();

  const {
    clearAuth,
    headerFlag = false,
    setHeaderFlag,
  } = useContext(AppContext) || {};

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);

      // Remove localStorage item
      localStorage.removeItem("isLoggedIn");

      // Verify that the item was successfully removed
      const isStillLoggedIn = localStorage.getItem("isLoggedIn");
      if (isStillLoggedIn === "true") {
        console.error("Failed to remove login status from localStorage");
        message.error("Failed to logout. Please try again.");
        setLoading(false);
        return;
      }

      // Clear auth context
      if (clearAuth) clearAuth();

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update header flag
      if (setHeaderFlag) setHeaderFlag(false);
      setIsMobileMenuOpen(false);

      // Navigate to login page only after successful removal
      navigate("/", { replace: true });
      message.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Error during logout");
    } finally {
      setLoading(false);
    }
  }, [clearAuth, setHeaderFlag, navigate]);

  const handleNotificationOpen = useCallback(() => {
    setIsNotificationOpen(true);
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header className="bg-white border-b px-4 py-3 shadow-sm overflow-x-hidden w-full sticky top-0 z-50">
        <div className="flex flex-wrap justify-between items-center w-full gap-4">
          {/* Logo */}
          <img
            src="https://www.socialbeat.in/wp-content/themes/socialbeat/assets/images/sb-logos/sb_cheil_2025_logos.png"
            alt="Company Logo"
            className="h-14 w-auto max-w-full"
            onError={(e) => {
              e.target.style.display = "none";
              console.error("Logo failed to load");
            }}
          />

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-4 ml-auto">
            {headerFlag && (
              <Tooltip title="Notifications">
                <div className="w-6 h-6 flex items-center justify-center">
                  <BellOutlined
                    onClick={handleNotificationOpen}
                    className="text-xl text-gray-600 hover:text-black cursor-pointer transition-colors duration-200"
                  />
                </div>
              </Tooltip>
            )}
            <Button
              icon={loading ? <Spin size="small" /> : <LogoutOutlined />}
              onClick={handleLogout}
              danger
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden ml-auto">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        {/* Mobile Menu Items */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-3 flex flex-col gap-3 w-full">
            {headerFlag && (
              <Button
                icon={<BellOutlined />}
                onClick={handleNotificationOpen}
                className="w-full !mt-2"
              >
                Notifications
              </Button>
            )}
            <Button
              icon={loading ? <Spin size="small" /> : <LogoutOutlined />}
              onClick={handleLogout}
              danger
              disabled={loading}
              className="w-full !mt-2"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        )}
      </header>

      {/* Modals and Drawers */}
      <CustomModal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      />
      <Notification
        open={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <IndividualDrawer ref={drawerRef} />
    </>
  );
}

export default Header;

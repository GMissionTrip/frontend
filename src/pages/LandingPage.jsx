import React, { useState } from "react";
import logo from "../assets/logo.png";
import hamburgerBtn from "../assets/hamburgerBtn.png";
import "./LandingPage.css";
import { Sidebar } from "@/components/Landing/sidebar";

export const LandingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="landing-container">
      <div className="overlay">
        <img src={hamburgerBtn} alt="메뉴" className="hamburger-btn" onClick={handleSidebar} />
        <div className="center-content">
          <div className="text">
            <span className="floating-text">
              한 번의 여행이 지나가버리는 기억이 아닌
              <br />
              나만의 이야기가 되는 공간
            </span>
          </div>
          <img src={logo} alt="로고" className="logo" />
        </div>
        {isSidebarOpen && <Sidebar onClose={handleSidebar} />}
      </div>
    </div>
  );
};

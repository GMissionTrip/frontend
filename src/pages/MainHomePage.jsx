import React, { useState } from "react";
import hamburgerBtn from "../assets/hamburgerBtn.png";
import sampleImage from "../assets/sample.png";
import logo from "../assets/logoSmall.png";
import { Sidebar } from "@/components/Landing/Sidebar";
import "./MainHomePage.css";
import { TravelCard } from "@/components/common/TravelCard";

export const MainHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const nowTravel = {
    image: sampleImage,
    title: "가평의 여름!",
    date: "2025/06/28 - 2025/06/30",
  };

  const pastTravels = [
    { image: sampleImage, title: "가평의 여름!", date: "2025/06/28 - 2025/06/30" },
    { image: sampleImage, title: "속초의 가을!", date: "2025/05/01 - 2025/05/03" },
    { image: sampleImage, title: "부산의 봄!", date: "2025/04/10 - 2025/04/12" },
  ];

  return (
    <div className="main-page">
      <div className="appBar">
        <img src={logo} alt="로고" className="logo" />
        <img src={hamburgerBtn} alt="메뉴" className="hamburger-btn" onClick={handleSidebar} />
      </div>

      <div className="section now-travel">
        <h2>현재 진행 중인 여행</h2>
        <TravelCard {...nowTravel} size="large" />
      </div>

      <div className="section past-travel">
        <h2>지난 여행 보기</h2>
        <div className="scroll-container">
          {pastTravels.map((travel, index) => (
            <TravelCard key={index} {...travel} size="small" />
          ))}
        </div>
      </div>

      <div className="footer-buttons">
        <button className="explore-btn">다른 사람들의 여행 구경하기</button>
      </div>
      <button className="plus-btn">+</button>

      {isSidebarOpen && <Sidebar onClose={handleSidebar} />}
    </div>
  );
};

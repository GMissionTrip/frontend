import React, { useState } from "react";
import sampleImage from "@/assets/sample.png";
import logo from "@/assets/logoSmall.png";
import { Sidebar } from "@/components/Landing/Sidebar";
import { TravelCard } from "@/components/common/TravelCard";
import { FaBell } from "react-icons/fa";
import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export const MainHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    <LayoutTitleWithActions
      title={<img src={logo} alt="로고" />}
      icon={<FaBell />}
      onIconClick={() => {
        navigate("/notification");
      }}
    >
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
    </LayoutTitleWithActions>
  );
};

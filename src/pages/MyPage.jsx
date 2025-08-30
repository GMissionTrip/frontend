import React, { useState } from "react";
import { TopBar } from "@/components/common/TopBar";
import "./MyPage.css";
import "@/components/common/TopBar.css";
import useUser from "@/hooks/useUser.mjs";
import { Navigate } from "react-router-dom";

export const MyPage = () => {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // 현재 선택된 탭

  const badges = Array(8).fill(null); // 예시용 8개의 배지 슬롯
  const xp = 2400;
  const maxXp = 3000;

  if (!user) return <Navigate to="/login" replace />;

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleTab = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };
  return (
    <div className="mypage-container">
      {/* 상단 헤더 */}
      <TopBar title="마이페이지" isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebar} />

      {/* 프로필 카드 */}
      <div className="profile-card">
        <img className="profile-avatar" src="https://picsum.photos/80/80" alt="avatar" />
        <div className="profile-info">
          <h3>강추 님</h3>
          <p>신뢰를 사랑하는 모험가</p>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: `${(xp / maxXp) * 100}%` }} />
          </div>
          <p className="xp-text">
            {xp} / {maxXp} XP
          </p>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="mypage-details">
        <div className="mypage-buttons">
          <button
            className={activeTab === "badge" ? "active" : ""}
            onClick={() => toggleTab("badge")}
          >
            배지 & 도장
          </button>
          <button
            className={activeTab === "stats" ? "active" : ""}
            onClick={() => toggleTab("stats")}
          >
            여행 통계
          </button>
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => toggleTab("settings")}
          >
            여행 설정
          </button>
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => toggleTab("info")}
          >
            내 정보
          </button>
        </div>

        {/* 클릭된 탭에 따른 내용 */}
        {activeTab === "badge" && (
          <div className="badge-section">
            <h4>내 배지</h4>
            <div className="badge-grid">
              {badges.map((_, idx) => (
                <div key={idx} className="badge-slot">
                  {idx === 0 ? <img src="" alt="badge" /> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="rank-card">
            <h4>Gold Explorer</h4>
            <img src="https://via.placeholder.com/80" alt="gold-badge" />
            <div className="xp-container">
              <div className="xp-bar">
                <div className="xp-progress" style={{ width: `${(xp / maxXp) * 100}%` }} />
              </div>
            </div>
            <p className="xp-text">
              {xp} / {maxXp} XP
            </p>
          </div>
        )}

        {activeTab === "settings" && <div className="placeholder-card">여행 설정 페이지</div>}

        {activeTab === "info" && <div className="placeholder-card">내 정보 페이지</div>}
      </div>
    </div>
  );
};

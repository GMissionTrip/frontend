import React, { useState } from "react";
import sampleImage from "@/assets/sample.png";
import logo from "@/assets/logoSmall.png";
import { Sidebar } from "@/components/Landing/Sidebar";
import { FaBars, FaChevronRight, FaStar } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import "./styles.css";
import useUser from "@/hooks/useUser.mjs";

export const MainHomePage = () => {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // if (!user) return <Navigate to="/login" replace />;

  const nowTravel = {
    image: sampleImage,
    title: "가평의 여름!",
    location: "가평, 경기도",
    days: "3일",
    progress: 65,
    badge: "진행중",
    date: "2025.06.28 - 06.30",
  };

  const pastTravels = [
    { title: "여행 1", location: "Rome, Italy", date: "2024.07.15 - 08.15", days: "31일" },
    { title: "여행 2", location: "Tokyo, Japan", date: "2024.05.10 - 05.20", days: "11일" },
    { title: "여행 3", location: "Paris, France", date: "2024.09.01 - 09.10", days: "10일" },
  ];

  return (
    <div className="mhp-root">
      {/* 상단 네이비 헤더 */}
      <header className="top-header">
        <div className="header-left">
          <div className="star-box">
            <FaStar className="star-icon" />
          </div>
          <div className="title-box">
            <div>강추트립</div>
            <span>나만의 여행 이야기</span>
          </div>
        </div>
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="메뉴">
          <FaBars />
        </button>
      </header>
      <main className="mhp-content">
        {/* 현재 여행 */}
        <section className="mhp-section">
          <div className="mhp-row">
            <div>현재 여행</div>
            <span className="mhp-count">1</span>
          </div>

          <article className="mhp-nowcard" onClick={() => navigate("/current-trip")} role="button">
            <div className="mhp-nowimg" style={{ backgroundImage: `url(${nowTravel.image})` }}>
              <div className="gradient-overlay" />

              <span className="mhp-badge">{nowTravel.badge}</span>
              <span className="mhp-days">{nowTravel.days}</span>

              <div className="mhp-textwrap">
                <h3>{nowTravel.title}</h3>
                <p>{nowTravel.location}</p>
              </div>

              <div className="mhp-progress">
                <div className="mhp-progress-bar" style={{ width: `${nowTravel.progress}%` }} />
                <span className="mhp-progress-num">{nowTravel.progress}%</span>
              </div>
            </div>

            <div className="mhp-nowdate">{nowTravel.date}</div>
          </article>
        </section>

        {/* 지난 여행들 */}
        <section className="mhp-section">
          <div className="mhp-row between">
            <h2>지난 여행들</h2>
            <button className="mhp-link" onClick={() => navigate("/my-archive")}>
              모두 보기 &gt;
            </button>
          </div>

          <div className="mhp-list">
            {pastTravels.map((t, idx) => (
              <button
                key={idx}
                className="mhp-item"
                onClick={() =>
                  navigate(`/my-archive/details/${idx + 1}`, {
                    state: {
                      id: idx + 1,
                      title: t.title,
                      date: t.date.replaceAll(".", "/"),
                      location: t.location,
                      background: "#003070",
                    },
                  })
                }
              >
                <div className="mhp-item-texts">
                  <div className="mhp-item-title">{t.title}</div>
                  <div className="mhp-item-sub">{t.location}</div>
                  <div className="mhp-item-meta">
                    <span>{t.date}</span>
                    <span className="dot">•</span>
                    <span>{t.days}</span>
                  </div>
                </div>
                <FaChevronRight className="mhp-chevron" />
              </button>
            ))}
          </div>
        </section>

        {/* 여행 영감 찾기 */}
        <section className="mhp-inspire">
          <div className="mhp-inspire-left">
            <h3>여행 영감 찾기</h3>
            <p>다른 여행자들의 이야기를 둘러보세요</p>
            <button className="mhp-inspire-link" onClick={() => navigate("/others-journeys")}>
              둘러보기
            </button>
          </div>
          <button
            className="mhp-inspire-icon"
            onClick={() => navigate("/others-journeys")}
            aria-label="영감 아이콘"
          >
            <FaStar />
          </button>
        </section>

        {/* 플로팅 + */}
        <button className="mhp-fab" onClick={() => navigate("/input-trip-info1")}>
          +
        </button>
      </main>

      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

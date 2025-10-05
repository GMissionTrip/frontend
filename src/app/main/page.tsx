"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import sampleImage from "@/assets/sample.png";
import logo from "@/assets/logoSmall.png";
import { Sidebar } from "@/components/organisms/Landing/Sidebar";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";
import { FaBars, FaBell, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaCompass } from "react-icons/fa";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { useRouter } from "next/navigation";
import { useArchives } from "@/hooks/queries/useArchiveQuery";
import { useToast } from "@/components/ToastProvider";
import "./styles.css";
import useUser from "@/hooks/useUser";
import { Loading } from "@/components/atoms/Loading";

export default function MainHomePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // React Query로 아카이브 데이터 로드
  const { data: pastTravels = [], isLoading: isArchivesLoading, error } = useArchives();

  const handleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 사용자 정보 로딩 중 표시
  if (isUserLoading || !user) {
    return <Loading fullScreen text="사용자 정보 로딩 중..." />;
  }

  // 강추 트립 (첫 번째 여행을 강추로 표시)
  const recommendedTrip = pastTravels.length > 0 ? pastTravels[0] : null;

  // 최근 여행 3개
  const recentTrips = pastTravels.slice(0, 3);

  return (
    <div className="main-page">
      <LayoutTitleWithActions
        title="강추트립"
        icon={<FaBars />}
        onIconClick={handleSidebar}
      >
        <div className="main-content">
          {/* 강추트립 카드 */}
          {recommendedTrip && (
            <div className="recommended-trip-card" onClick={() => router.push("/current-trip")}>
              <div className="recommended-header">
                <FaPlus className="add-icon" />
                <span className="recommended-label">강추트립</span>
                <span className="recommended-subtitle">다양한 여행을 이야기</span>
              </div>
              
              <div className="recommended-image-container">
                <Image 
                  src={recommendedTrip.background}
                  alt={recommendedTrip.title}
                  width={300}
                  height={180}
                  className="recommended-image"
                />
                <div className="recommended-badge">추천</div>
                <div className="recommended-overlay">
                  <h3 className="recommended-title">{recommendedTrip.title}</h3>
                  <p className="recommended-location">{recommendedTrip.location}</p>
                  <div className="recommended-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="recommended-footer">
                <span className="recommended-date">{recommendedTrip.date}</span>
                <span className="recommended-status">진행 중</span>
              </div>
            </div>
          )}

          {/* 지난 여행들 */}
          <div className="past-travels-section">
            <div className="section-header">
              <h3 className="section-title">지난 여행들</h3>
              <button className="view-all-button" onClick={() => router.push("/my-archive")}>
                모두보기 →
              </button>
            </div>

            {isArchivesLoading ? (
              <div className="loading-state">
                <p>여행 데이터를 불러오는 중...</p>
              </div>
            ) : recentTrips.length > 0 ? (
              <div className="travels-list">
                {recentTrips.map((travel, index) => (
                  <div 
                    key={travel.id}
                    className="travel-list-item"
                    onClick={() => router.push(`/my-archive/details/${travel.id}`)}
                  >
                    <div className="travel-item-content">
                      <h4 className="travel-item-title">여행 {index + 1}</h4>
                      <p className="travel-item-location">{travel.location}</p>
                      <p className="travel-item-date">{travel.date}</p>
                    </div>
                    <FaCalendarAlt className="travel-item-icon" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📸"
                title="아직 여행 기록이 없어요"
                description="첫 번째 여행을 기록하고 소중한 추억을 남겨보세요!"
                action={{
                  label: "첫 여행 시작하기",
                  onClick: () => router.push("/input-trip-info1")
                }}
                size="small"
              />
            )}
          </div>

          {/* 여행 일정 찾기 */}
          <div className="find-schedule-section">
            <button className="find-schedule-button" onClick={() => router.push("/others-journey")}>
              <FaCompass className="find-icon" />
              <div className="find-text">
                <h4>여행 일정 찾기</h4>
                <p>다른 사람들의 이야기를 둘러보세요</p>
              </div>
              <div className="find-arrow">→</div>
            </button>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="fab"
          onClick={() => router.push("/input-trip-info1")}
          aria-label="새 여행 추가"
        >
          <FaPlus />
        </button>

        {isSidebarOpen && <Sidebar onClose={handleSidebar} />}
      </LayoutTitleWithActions>
    </div>
  );
}

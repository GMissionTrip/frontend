"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaCheckCircle, FaCamera } from "react-icons/fa";
import "./styles.css";

// 더미 데이터 (나중에 API로 대체)
const currentTrip = {
  id: "1",
  title: "가벼운 여행!",
  location: "강원, 강릉시...",
  startDate: "2025.06.28",
  endDate: "08.30",
  progress: 65,
  coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  missions: [
    {
      id: "m1",
      title: "단양8경",
      location: "단양, 충청북도",
      points: 100,
      isCompleted: true,
      icon: "📍"
    },
    {
      id: "m2",
      title: "법주사 로맨틱",
      location: "충북, 보은",
      points: 200,
      isCompleted: false,
      icon: "🏛️"
    },
    {
      id: "m3",
      title: "나라 생선 선물하기",
      location: "충북, 충주",
      points: 150,
      isCompleted: false,
      icon: "🐟"
    },
    {
      id: "m4",
      title: "감쿨 존스턴",
      location: "충북, 청주",
      points: 120,
      isCompleted: false,
      icon: "☕"
    },
    {
      id: "m5",
      title: "3곳 여행 소감",
      location: "충북, 진천",
      points: 180,
      isCompleted: false,
      icon: "✍️"
    },
    {
      id: "m6",
      title: "가족 여행 스냅",
      location: "충북, 음성",
      points: 150,
      isCompleted: false,
      icon: "📸"
    }
  ]
};

export default function CurrentTripPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"guide" | "map">("guide");

  const completedMissions = currentTrip.missions.filter(m => m.isCompleted).length;
  const totalMissions = currentTrip.missions.length;

  return (
    <LayoutTitleWithActions
      title="현재 여행"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => router.back()}
    >
      <div className="current-trip-page">
        {/* 여행 헤더 */}
        <div className="trip-header">
          <div className="trip-cover">
            <Image
              src={currentTrip.coverImage}
              alt={currentTrip.title}
              fill
              className="cover-image"
            />
            <div className="trip-info-overlay">
              <span className="trip-badge">진행중</span>
              <h1 className="trip-title">{currentTrip.title}</h1>
              <div className="trip-meta">
                <span className="trip-location">
                  <FaMapMarkerAlt /> {currentTrip.location}
                </span>
                <span className="trip-dates">
                  <FaCalendar /> {currentTrip.startDate} - {currentTrip.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="trip-tabs">
          <button
            className={`tab-btn ${selectedTab === "guide" ? "active" : ""}`}
            onClick={() => setSelectedTab("guide")}
          >
            <FaCalendar />
            가이드
          </button>
          <button
            className={`tab-btn ${selectedTab === "map" ? "active" : ""}`}
            onClick={() => setSelectedTab("map")}
          >
            <FaMapMarkerAlt />
            지도
          </button>
        </div>

        {selectedTab === "guide" ? (
          <div className="trip-guide">
            {/* 여행 진행률 */}
            <div className="trip-progress-section">
              <div className="progress-header">
                <h3>여행 진행률</h3>
                <span className="progress-value">{currentTrip.progress}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${currentTrip.progress}%` }}
                />
              </div>
              <p className="progress-info">
                완료 미션을 클릭해 확인하세요! ({completedMissions}/{totalMissions})
              </p>
            </div>

            {/* 미션 목록 */}
            <div className="missions-section">
              <h3 className="section-title">미션 수행</h3>
              <div className="missions-list">
                {currentTrip.missions.map((mission, index) => (
                  <div
                    key={mission.id}
                    className={`mission-card ${mission.isCompleted ? "completed" : ""}`}
                    onClick={() => router.push(`/mission/${mission.id}`)}
                  >
                    <div className="mission-number">
                      {mission.isCompleted ? (
                        <FaCheckCircle className="check-icon" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="mission-icon">{mission.icon}</div>
                    <div className="mission-info">
                      <h4 className="mission-title">{mission.title}</h4>
                      <p className="mission-location">{mission.location}</p>
                    </div>
                    <div className="mission-points">
                      <span className="points-value">{mission.points}P</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 여행 경로 찾기 버튼 */}
            <div className="actions-section">
              <button
                className="route-btn"
                onClick={() => router.push("/route-result")}
              >
                여행 경로 찾기
              </button>
            </div>
          </div>
        ) : (
          <div className="trip-map">
            <div className="map-placeholder">
              <FaMapMarkerAlt className="map-icon" />
              <p>지도 기능은 준비 중입니다</p>
            </div>
          </div>
        )}
      </div>
    </LayoutTitleWithActions>
  );
}

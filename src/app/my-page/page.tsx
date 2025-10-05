"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Loading } from "@/components/atoms/Loading";
import { Modal } from "@/components/atoms/Modal";
import { 
  FaArrowLeft, 
  FaTrophy, 
  FaCalendarAlt, 
  FaChartLine,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { 
  useUserProfile, 
  useBadges, 
  useTravelStats, 
  usePointHistory,
  useTripCalendar 
} from "@/hooks/queries/useMypageQuery";
import { PointHistory } from "@/types/mypage";
import "./styles.css";

type TabType = "badges" | "calendar" | "stats";
type PointTabType = "all" | "earn" | "use";

export default function MyPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<TabType>("badges");
  const [pointTab, setPointTab] = useState<PointTabType>("all");
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointHistory | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 데이터 로드
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: badges = [], isLoading: badgesLoading } = useBadges();
  const { data: stats, isLoading: statsLoading } = useTravelStats();
  const { data: points = [], isLoading: pointsLoading } = usePointHistory(
    pointTab === "all" ? undefined : pointTab
  );
  const { data: calendarEvents = [] } = useTripCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  if (profileLoading) {
    return <Loading fullScreen text="프로필을 불러오는 중..." />;
  }

  if (!profile) {
    return null;
  }

  const xpPercentage = (profile.currentXp / profile.nextLevelXp) * 100;
  const earnedBadges = badges.filter(b => b.progress === 100);

  const handlePointClick = (point: PointHistory) => {
    setSelectedPoint(point);
    setShowPointModal(true);
  };

  return (
    <LayoutTitleWithActions
      title="마이페이지"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => router.push("/main")}
    >
      <div className="mypage">
        {/* 프로필 헤더 */}
        <div className="profile-header">
          <div className="profile-avatar">
            <Image
              src={profile.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt="프로필"
              width={80}
              height={80}
              className="avatar-img"
            />
            <button className="avatar-badge">
              <span className="badge-icon">⭐</span>
            </button>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{profile.nickname}</h1>
            <p className="profile-subtitle">여행을 사랑하는 모험가</p>
            
            <div 
              className="profile-xp-card clickable"
              onClick={() => router.push("/points")}
            >
              <div className="xp-header">
                <span className="xp-label">보유 포인트</span>
                <span className="xp-value">{profile.totalPoints.toLocaleString()} P</span>
              </div>
              <div className="xp-progress">
                <div className="progress-track">
                  <div 
                    className="progress-bar"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
                <div className="xp-info">
                  <span className="current-xp">{profile.currentXp} XP</span>
                  <span className="next-xp">{profile.nextLevelXp} XP</span>
                </div>
              </div>
              <div className="xp-footer">
                <span className="xp-label">더블 포인켓</span>
                <span className="xp-level">550 P</span>
              </div>
              <span className="view-details">자세히 보기 →</span>
            </div>
          </div>
        </div>

        {/* 내 정보 버튼 */}
        <div className="info-button-container">
          <button 
            className="info-button"
            onClick={() => router.push("/my-profile")}
          >
            내 정보
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="tabs-menu">
          <button
            className={`tab-button ${activeTab === "badges" ? "active" : ""}`}
            onClick={() => setActiveTab("badges")}
          >
            배지 수집함
          </button>
          <button
            className={`tab-button ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            여행 달린더
          </button>
          <button
            className={`tab-button ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            여행 통계
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="tab-content">
          {activeTab === "badges" && (
            <div className="badges-section">
              <div className="badges-grid">
                {badges.map((badge) => (
                  <button
                    key={badge.id}
                    className={`badge-item ${badge.progress === 100 ? "earned" : "locked"}`}
                    onClick={() => badge.progress === 100 && setShowBadgeModal(true)}
                  >
                    <div className="badge-icon">
                      <span className="icon-emoji">{badge.icon}</span>
                    </div>
                    {badge.progress === 100 && (
                      <div className="badge-check">✓</div>
                    )}
                  </button>
                ))}
              </div>

              <div className="section-footer">
                <button 
                  className="info-link"
                  onClick={() => setShowBadgeModal(true)}
                >
                  <FaInfoCircle />
                  <span>배지 달성 기준</span>
                </button>
                <button 
                  className="info-link"
                  onClick={() => router.push("/points")}
                >
                  <FaInfoCircle />
                  <span>포인트 기반</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="calendar-section">
              <div className="calendar-header">
                <button 
                  className="month-nav"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  ←
                </button>
                <span className="month-label">
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </span>
                <button 
                  className="month-nav"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  →
                </button>
              </div>

              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {["일", "월", "화", "수", "목", "금", "토"].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>

                <div className="calendar-days">
                  {/* TODO: 실제 달력 날짜 렌더링 */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1 - 5; // 임시로 5일부터 시작
                    const isToday = day === new Date().getDate();
                    const hasEvent = calendarEvents.some(event => {
                      const start = new Date(event.startDate).getDate();
                      const end = new Date(event.endDate).getDate();
                      return day >= start && day <= end;
                    });

                    return (
                      <button
                        key={i}
                        className={`calendar-day ${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""}`}
                        onClick={() => day > 0 && showToast(`${day}일 일정을 확인합니다.`, "info")}
                      >
                        {day > 0 && day <= 31 ? day : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="stats-section">
              {statsLoading ? (
                <Loading text="통계를 불러오는 중..." />
              ) : stats ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">{stats.totalTrips}</div>
                      <div className="stat-label">총 여행</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{stats.totalReviews}</div>
                      <div className="stat-label">총 여행 일수</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{stats.totalPlaces}</div>
                      <div className="stat-label">방문 리뷰 수</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number" style={{ color: "#EF4444" }}>{stats.completedTrips}</div>
                      <div className="stat-label">평균 완주율</div>
                    </div>
                  </div>

                  <div className="points-section">
                    <div className="points-header">
                      <h3>포인트 내역</h3>
                      <div className="points-tabs">
                        <button
                          className={`points-tab ${pointTab === "all" ? "active" : ""}`}
                          onClick={() => setPointTab("all")}
                        >
                          전체
                        </button>
                        <button
                          className={`points-tab ${pointTab === "earn" ? "active" : ""}`}
                          onClick={() => setPointTab("earn")}
                        >
                          적립
                        </button>
                        <button
                          className={`points-tab ${pointTab === "use" ? "active" : ""}`}
                          onClick={() => setPointTab("use")}
                        >
                          사용
                        </button>
                      </div>
                    </div>

                    <div className="points-summary">
                      <div className="summary-item">
                        <span className="summary-value">{profile.earnedPoints}</span>
                        <span className="summary-label">총 적립</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-value">{profile.usedPoints}</span>
                        <span className="summary-label">총 사용</span>
                      </div>
                    </div>

                    {pointsLoading ? (
                      <Loading text="포인트 내역을 불러오는 중..." />
                    ) : (
                      <div className="points-list">
                        {points.map(point => (
                          <button
                            key={point.id}
                            className="point-item"
                            onClick={() => handlePointClick(point)}
                          >
                            <div className="point-info">
                              <span className="point-description">{point.description}</span>
                              <span className="point-date">{point.createdAt} • {point.category}</span>
                            </div>
                            <span className={`point-amount ${point.type === "earn" ? "earn" : "use"}`}>
                              {point.type === "earn" ? "+" : "-"}{point.points} XP
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          )}

        </div>

        {/* 배지 달성 기준 모달 */}
        <Modal
          isOpen={showBadgeModal}
          onClose={() => setShowBadgeModal(false)}
          title="배지 달성 기준"
        >
          <div className="badge-modal-content">
            {badges.map(badge => (
              <div key={badge.id} className="badge-requirement">
                <div className="badge-icon-small">{badge.icon}</div>
                <div className="badge-details">
                  <h4>{badge.name}</h4>
                  <p>{badge.requirement}</p>
                  {badge.progress !== undefined && badge.progress < 100 && (
                    <div className="badge-progress">
                      <div className="progress-bar-small">
                        <div 
                          className="progress-fill-small"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{badge.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>

        {/* 포인트 상세 모달 */}
        <Modal
          isOpen={showPointModal}
          onClose={() => {
            setShowPointModal(false);
            setSelectedPoint(null);
          }}
          title="맛집 리뷰 작성"
        >
          {selectedPoint && (
            <div className="point-detail-modal">
              <div className="detail-row">
                <span className="detail-label">포인트</span>
                <span className={`detail-value ${selectedPoint.type === "earn" ? "earn" : "use"}`}>
                  {selectedPoint.type === "earn" ? "+" : "-"}{selectedPoint.points} XP
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">날짜</span>
                <span className="detail-value">{selectedPoint.createdAt}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">유형</span>
                <span className="detail-value">{selectedPoint.type === "earn" ? "미션 완료" : "사용"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">위치</span>
                <span className="detail-value">{selectedPoint.category}</span>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </LayoutTitleWithActions>
  );
}

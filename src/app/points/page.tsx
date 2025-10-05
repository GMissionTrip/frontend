"use client";

import React, { useState } from "react";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Loading } from "@/components/atoms/Loading";
import { FaArrowLeft, FaCoins, FaArrowUp, FaArrowDown, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { usePointHistory } from "@/hooks/queries/useMypageQuery";
import { PointHistory } from "@/types/mypage";
import "./styles.css";

type PointTabType = "all" | "earn" | "use";

export default function PointsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PointTabType>("all");
  const [selectedPoint, setSelectedPoint] = useState<PointHistory | null>(null);

  const { data: points = [], isLoading } = usePointHistory(
    activeTab === "all" ? undefined : activeTab
  );

  const handlePointClick = (point: PointHistory) => {
    setSelectedPoint(point);
  };

  const getPointIcon = (type: string) => {
    switch (type) {
      case "earn":
        return <FaArrowUp className="point-icon-earn" />;
      case "use":
        return <FaArrowDown className="point-icon-use" />;
      default:
        return <FaCoins className="point-icon-default" />;
    }
  };

  const getPointColor = (type: string) => {
    return type === "earn" ? "earn" : "use";
  };

  if (isLoading) {
    return <Loading fullScreen text="포인트 내역을 불러오는 중..." />;
  }

  return (
    <LayoutTitleWithActions
      title="포인트 내역"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => router.back()}
    >
      <div className="points-page">
        {/* 포인트 요약 */}
        <div className="points-summary">
          <div className="summary-card">
            <FaCoins className="summary-icon" />
            <div className="summary-content">
              <span className="summary-label">총 적립 포인트</span>
              <span className="summary-value">
                {points
                  .filter((p) => p.type === "earn")
                  .reduce((sum, p) => sum + (p.points || 0), 0)
                  .toLocaleString()}{" "}
                P
              </span>
            </div>
          </div>
          <div className="summary-card">
            <FaArrowDown className="summary-icon use" />
            <div className="summary-content">
              <span className="summary-label">총 사용 포인트</span>
              <span className="summary-value use">
                {points
                  .filter((p) => p.type === "use")
                  .reduce((sum, p) => sum + (p.points || 0), 0)
                  .toLocaleString()}{" "}
                P
              </span>
            </div>
          </div>
        </div>

        {/* 탭 필터 */}
        <div className="points-tabs">
          <button
            className={`points-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            전체
          </button>
          <button
            className={`points-tab ${activeTab === "earn" ? "active" : ""}`}
            onClick={() => setActiveTab("earn")}
          >
            적립
          </button>
          <button
            className={`points-tab ${activeTab === "use" ? "active" : ""}`}
            onClick={() => setActiveTab("use")}
          >
            사용
          </button>
        </div>

        {/* 포인트 내역 리스트 */}
        <div className="points-list">
          {points.length === 0 ? (
            <div className="empty-points">
              <FaCoins className="empty-icon" />
              <p className="empty-text">포인트 내역이 없습니다</p>
              <p className="empty-subtext">여행을 완료하고 포인트를 받아보세요!</p>
            </div>
          ) : (
            points.map((point) => (
              <div
                key={point.id}
                className={`point-item ${selectedPoint?.id === point.id ? "selected" : ""}`}
                onClick={() => handlePointClick(point)}
              >
                <div className="point-item-left">
                  {getPointIcon(point.type)}
                  <div className="point-item-info">
                    <span className="point-item-title">{point.description}</span>
                    <span className="point-item-date">
                      {new Date(point.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="point-item-right">
                  <span className={`point-item-amount ${getPointColor(point.type)}`}>
                    {point.type === "earn" ? "+" : "-"}
                    {(point.points || 0).toLocaleString()} P
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 포인트 안내 */}
        <div className="points-info">
          <div className="info-header">
            <FaInfoCircle className="info-icon" />
            <span className="info-title">포인트 적립 안내</span>
          </div>
          <ul className="info-list">
            <li>여행 완료 시 자동으로 포인트가 적립됩니다</li>
            <li>미션 완료 시 추가 포인트를 받을 수 있습니다</li>
            <li>포인트는 다음 여행 계획 시 사용할 수 있습니다</li>
            <li>포인트 유효기간은 적립일로부터 1년입니다</li>
          </ul>
        </div>
      </div>
    </LayoutTitleWithActions>
  );
}


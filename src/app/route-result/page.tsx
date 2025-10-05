"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { KakaoMapWithPlaces } from "@/components/organisms/KakaoMapWithPlaces";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaRoute,
  FaCheck,
  FaChevronRight,
} from "react-icons/fa";
import { useToast } from "@/components/ToastProvider";
import "./styles.css";

// TODO: 실제로는 전 페이지에서 전달받거나 전역 상태에서 가져와야 함
const mockOptimizedPlaces = [
  {
    id: "place1",
    name: "속초 해수욕장",
    category: "자연",
    address: "강원도 속초시 해수욕장길 190",
    imageUrl: "https://picsum.photos/seed/sokcho-beach/400/300",
    lat: 38.207,
    lng: 128.591,
    duration: 120,
    order: 1,
  },
  {
    id: "place3",
    name: "중앙시장",
    category: "먹거리",
    address: "강원도 속초시 중앙로 147",
    imageUrl: "https://picsum.photos/seed/sokcho-market/400/300",
    lat: 38.204,
    lng: 128.589,
    duration: 60,
    order: 2,
  },
  {
    id: "place2",
    name: "낙산사",
    category: "문화",
    address: "강원도 양양군 강현면 낙산사로 100",
    imageUrl: "https://picsum.photos/seed/naksansa/400/300",
    lat: 38.122,
    lng: 128.627,
    duration: 90,
    order: 3,
  },
];

const mockRouteInfo = {
  totalDistance: 28.5,
  totalDuration: 95,
  estimatedCost: 4275,
};

export default function RouteResultPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedPlaces] = useState(mockOptimizedPlaces);

  const handleComplete = () => {
    // TODO: 백엔드에 여행 계획 저장
    showToast("여행 계획이 저장되었습니다!", "success");
    router.push("/main");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LayoutTitleWithActions
      title="경로 최적화 완료"
      showBack
      onBack={handleBack}
    >
      <div className="route-result-page">
        {/* 지도 영역 */}
        <div className="map-section">
          <KakaoMapWithPlaces
            places={selectedPlaces}
            selectedPlaces={selectedPlaces}
            onPlaceClick={() => {}}
            center={{ lat: 38.15, lng: 128.6 }}
          />
        </div>

        {/* 경로 정보 */}
        <div className="route-info-section">
          <div className="route-summary">
            <h2 className="summary-title">최적화된 경로</h2>
            <div className="summary-stats">
              <div className="stat-item">
                <FaRoute className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-label">총 거리</span>
                  <span className="stat-value">{mockRouteInfo.totalDistance}km</span>
                </div>
              </div>
              <div className="stat-item">
                <FaClock className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-label">이동 시간</span>
                  <span className="stat-value">
                    {Math.floor(mockRouteInfo.totalDuration / 60)}시간 {mockRouteInfo.totalDuration % 60}분
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 장소 순서 리스트 */}
          <div className="places-order-list">
            <h3 className="list-title">방문 순서</h3>
            <div className="places-timeline">
              {selectedPlaces.map((place, index) => (
                <div key={place.id} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="marker-number">{place.order}</div>
                    {index < selectedPlaces.length - 1 && (
                      <div className="timeline-line" />
                    )}
                  </div>

                  <div className="timeline-content">
                    <div className="place-card">
                      <div className="place-image">
                        <Image
                          src={place.imageUrl}
                          alt={place.name}
                          width={80}
                          height={80}
                          className="img"
                        />
                      </div>

                      <div className="place-details">
                        <div className="place-category">{place.category}</div>
                        <h4 className="place-name">{place.name}</h4>
                        <div className="place-meta">
                          <FaMapMarkerAlt className="meta-icon" />
                          <span className="meta-text">{place.address}</span>
                        </div>
                        <div className="place-meta">
                          <FaClock className="meta-icon" />
                          <span className="meta-text">예상 소요 시간: {place.duration}분</span>
                        </div>
                      </div>
                    </div>

                    {index < selectedPlaces.length - 1 && (
                      <div className="route-segment">
                        <FaChevronRight className="arrow-icon" />
                        <span className="segment-info">차량 이동 • 약 30분</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="action-buttons">
            <Button
              variant="outline"
              size="large"
              onClick={handleBack}
              className="back-btn"
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={handleComplete}
              leftIcon={<FaCheck />}
              className="complete-btn"
            >
              여행 계획 완료
            </Button>
          </div>
        </div>
      </div>
    </LayoutTitleWithActions>
  );
}


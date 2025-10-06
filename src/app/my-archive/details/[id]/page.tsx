"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft, FaMapMarkerAlt, FaCalendar, FaClock, FaCamera, FaShare } from "react-icons/fa";
import { useKakaoShare } from "@/hooks/useKakaoShare";
import "./styles.css";

declare global {
  interface Window {
    kakao: any;
  }
}

// ✅ AWS 정적 export용 - 동적 라우팅 허용
export const dynamicParams = true;

export default function MyArchiveDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"timeline" | "photos" | "map">("timeline");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const topMapRef = useRef<HTMLDivElement>(null);
  const topMapInstanceRef = useRef<any>(null);
  const { shareToKakao } = useKakaoShare();

  // 더미 데이터 - 실제 강원도 관광지 좌표
  const places = [
    { name: "경포해변", lat: 37.8008, lng: 128.9089, order: 1 },
    { name: "주문진항", lat: 37.8985, lng: 128.8162, order: 2 },
    { name: "정동진", lat: 37.6897, lng: 129.0336, order: 3 },
    { name: "속초해수욕장", lat: 38.2073, lng: 128.5927, order: 4 },
    { name: "낙산사", lat: 38.1245, lng: 128.6273, order: 5 },
  ];

  const tripData = {
    id: params.id as string,
    title: "강원도 동해안 여행",
    location: "강원, 강릉시, 속초시",
    startDate: "2025.06.28",
    endDate: "08.30",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    missions: [
      {
        id: "m1",
        date: "2025년 6월 28일",
        time: "10:00",
        title: "경포해변 일출 감상",
        location: "경포해변",
        description: "아름다운 경포해변에서 일출 사진 찍기",
        photos: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        ],
        isCompleted: true,
      },
      {
        id: "m2",
        date: "2025년 6월 28일",
        time: "14:00",
        title: "주문진항 횟집 투어",
        location: "주문진항",
        description: "신선한 회와 함께 바다 경치 즐기기",
        photos: [
          "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400",
        ],
        isCompleted: true,
      },
      {
        id: "m3",
        date: "2025년 6월 29일",
        time: "06:00",
        title: "정동진 해돋이",
        location: "정동진",
        description: "세계에서 바다와 가장 가까운 역에서 일출 보기",
        photos: [
          "https://images.unsplash.com/photo-1602002413757-3c6010dd1b7c?w=400",
        ],
        isCompleted: true,
      },
      {
        id: "m4",
        date: "2025년 6월 29일",
        time: "15:00",
        title: "속초해수욕장 물놀이",
        location: "속초해수욕장",
        description: "시원한 동해 바다에서 물놀이 즐기기",
        photos: [],
        isCompleted: true,
      },
      {
        id: "m5",
        date: "2025년 6월 30일",
        time: "09:00",
        title: "낙산사 참배",
        location: "낙산사",
        description: "해수관음상과 홍련암에서 기도하기",
        photos: [],
        isCompleted: true,
      },
    ],
    allPhotos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400",
      "https://images.unsplash.com/photo-1602002413757-3c6010dd1b7c?w=400",
    ],
    stats: {
      places: 8,
      photos: 45,
      missions: 12,
    },
  };

  // 상단 작은 지도 초기화
  useEffect(() => {
    if (topMapRef.current && !topMapInstanceRef.current) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        window.kakao.maps.load(() => {
          if (!topMapRef.current) return;

          const centerLat = places.reduce((sum, p) => sum + p.lat, 0) / places.length;
          const centerLng = places.reduce((sum, p) => sum + p.lng, 0) / places.length;

          const mapOption = {
            center: new window.kakao.maps.LatLng(centerLat, centerLng),
            level: 10,
            draggable: false,
            scrollwheel: false,
            disableDoubleClick: true,
            disableDoubleClickZoom: true,
          };

          const map = new window.kakao.maps.Map(topMapRef.current, mapOption);
          topMapInstanceRef.current = map;

          // 경로 선만 간단하게 표시
          const linePath = places.map(
            (place) => new window.kakao.maps.LatLng(place.lat, place.lng)
          );

          const polyline = new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 3,
            strokeColor: "#667eea",
            strokeOpacity: 0.7,
            strokeStyle: "solid",
          });

          polyline.setMap(map);

          // 시작점과 끝점 마커만 표시
          [places[0], places[places.length - 1]].forEach((place, idx) => {
            const markerPosition = new window.kakao.maps.LatLng(place.lat, place.lng);
            const markerContent = `
              <div style="
                background: ${idx === 0 ? "#10b981" : "#ef4444"};
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 11px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              ">
                ${idx === 0 ? "출발" : "도착"}
              </div>
            `;

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: markerPosition,
              content: markerContent,
              yAnchor: 1.2,
            });

            customOverlay.setMap(map);
          });
        });
      };

      document.head.appendChild(script);
    }
  }, []);

  // 탭의 지도 초기화
  useEffect(() => {
    if (activeTab === "map" && mapRef.current && !mapInstanceRef.current) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          // 지도 중심 좌표 계산 (모든 장소의 평균)
          const centerLat = places.reduce((sum, p) => sum + p.lat, 0) / places.length;
          const centerLng = places.reduce((sum, p) => sum + p.lng, 0) / places.length;

          const mapOption = {
            center: new window.kakao.maps.LatLng(centerLat, centerLng),
            level: 9,
          };

          const map = new window.kakao.maps.Map(mapRef.current, mapOption);
          mapInstanceRef.current = map;

          // 마커 추가
          places.forEach((place) => {
            const markerPosition = new window.kakao.maps.LatLng(place.lat, place.lng);
            
            // 커스텀 마커 HTML
            const markerContent = `
              <div style="
                position: relative;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 14px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 6px;
              ">
                <span style="
                  background: white;
                  color: #667eea;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 700;
                ">${place.order}</span>
                ${place.name}
              </div>
            `;

            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: markerPosition,
              content: markerContent,
              yAnchor: 1.2,
            });

            customOverlay.setMap(map);
          });

          // 경로 선 그리기
          const linePath = places.map(
            (place) => new window.kakao.maps.LatLng(place.lat, place.lng)
          );

          const polyline = new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 4,
            strokeColor: "#667eea",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
          });

          polyline.setMap(map);
        });
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [activeTab]);

  const handleShare = () => {
    shareToKakao({
      title: tripData.title,
      description: `${tripData.startDate} - ${tripData.endDate} | ${tripData.location}`,
      imageUrl: tripData.coverImage,
      link: typeof window !== "undefined" ? window.location.href : "",
    });
  };

  // 날짜별로 미션 그룹화
  const groupedMissions = tripData.missions.reduce((acc, mission) => {
    if (!acc[mission.date]) {
      acc[mission.date] = [];
    }
    acc[mission.date].push(mission);
    return acc;
  }, {} as Record<string, typeof tripData.missions>);

  return (
    <div className="archive-details-page">
      {/* 헤더 */}
      <div className="details-header">
        <button className="back-btn" onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
        <h1>내 아카이브</h1>
        <button className="share-btn" onClick={handleShare}>
          <FaShare />
        </button>
      </div>

      {/* 커버 이미지 */}
      <div className="trip-cover">
        <Image
          src={tripData.coverImage}
          alt={tripData.title}
          fill
          className="cover-img"
        />
        <div className="cover-overlay">
          <h2 className="trip-title">{tripData.title}</h2>
          <p className="trip-period">
            {tripData.startDate} - {tripData.endDate}
          </p>
          <p className="trip-location">
            <FaMapMarkerAlt /> {tripData.location}
          </p>
        </div>
      </div>

      {/* 지도 섹션 */}
      <div className="map-section">
        <div className="map-container">
          <div 
            ref={topMapRef} 
            className="map-placeholder" 
            style={{ 
              width: "100%", 
              height: "200px",
              borderRadius: "16px",
              overflow: "hidden"
            }}
          >
            {!topMapInstanceRef.current && (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                flexDirection: "column",
                gap: "8px",
                color: "#667eea"
              }}>
                <FaMapMarkerAlt style={{ fontSize: "32px" }} />
                <p>여행 경로 지도</p>
              </div>
            )}
          </div>
          <div className="location-label">
            <FaMapMarkerAlt /> {tripData.location}
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="details-tabs">
        <button
          className={`tab ${activeTab === "timeline" ? "active" : ""}`}
          onClick={() => setActiveTab("timeline")}
        >
          <FaClock /> 타임라인
        </button>
        <button
          className={`tab ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          <FaCamera /> 사진 ({tripData.allPhotos.length})
        </button>
        <button
          className={`tab ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
        >
          <FaMapMarkerAlt /> 지도
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="tab-content">
        {activeTab === "timeline" && (
          <div className="timeline-view">
            {Object.entries(groupedMissions).map(([date, missions]) => (
              <div key={date} className="date-group">
                <div className="date-header">
                  <div className="date-dot"></div>
                  <h3 className="date-title">{date}</h3>
                </div>

                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className={`mission-item ${!mission.isCompleted ? "incomplete" : ""}`}
                  >
                    <div className="mission-time">
                      <FaClock /> {mission.time}
                    </div>
                    <div className="mission-content">
                      <div className="mission-header">
                        <h4 className="mission-title">{mission.title}</h4>
                        {mission.isCompleted && (
                          <span className="completed-badge">완료</span>
                        )}
                      </div>
                      <p className="mission-location">
                        <FaMapMarkerAlt /> {mission.location}
                      </p>
                      {mission.photos.length > 0 && (
                        <div className="mission-photos">
                          {mission.photos.map((photo, idx) => (
                            <div key={idx} className="photo-thumb">
                              <Image
                                src={photo}
                                alt={`${mission.title} photo ${idx + 1}`}
                                fill
                                className="photo-img"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {mission.description && (
                        <p className="mission-desc">{mission.description}</p>
                      )}
                      {!mission.isCompleted && (
                        <button className="retry-btn">자세히 보기</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "photos" && (
          <div className="photos-view">
            <div className="photos-grid">
              {tripData.allPhotos.map((photo, idx) => (
                <div key={idx} className="photo-card">
                  <Image src={photo} alt={`Photo ${idx + 1}`} fill className="photo-img" />
                </div>
              ))}
              <button className="add-photo-card">
                <span className="plus-icon">+</span>
                <span>카메라 롤 공유하기</span>
              </button>
              <button className="add-photo-card">
                <span className="plus-icon">+</span>
                <span>링크 공유하기</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="map-view">
            <div ref={mapRef} className="map-full" style={{ width: "100%", height: "500px" }}>
              {!mapInstanceRef.current && (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: "100%",
                  flexDirection: "column",
                  gap: "12px",
                  color: "#667eea"
                }}>
                  <FaMapMarkerAlt style={{ fontSize: "48px" }} />
                  <p>지도를 불러오는 중...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 통계 섹션 */}
      <div className="stats-section">
        <h3>간직하고 싶은 사진을 추가해 보세요!</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <FaMapMarkerAlt className="stat-icon" />
            <div className="stat-value">{tripData.stats.places}</div>
            <div className="stat-label">방문 장소</div>
          </div>
          <div className="stat-card">
            <FaCamera className="stat-icon" />
            <div className="stat-value">{tripData.stats.photos}</div>
            <div className="stat-label">촬영 사진</div>
          </div>
          <div className="stat-card">
            <FaClock className="stat-icon" />
            <div className="stat-value">{tripData.stats.missions}</div>
            <div className="stat-label">완료 미션</div>
          </div>
        </div>
      </div>

      {/* 공유 버튼 */}
      <div className="bottom-actions">
        <button className="share-full-btn" onClick={handleShare}>
          <FaShare /> 카카오톡 공유하기
        </button>
      </div>
    </div>
  );
}

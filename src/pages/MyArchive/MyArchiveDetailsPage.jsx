import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TripCard } from "@/components/Archive/TripCard";
import { TopBar } from "@/components/common/TopBar";
import { ArchiveMissionCard } from "@/components/Archive/ArchiveMissionCard";
import "@/pages/MyArchive/MyArchiveDetailsPage.css";

export const MyArchiveDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  const mapRef = useRef(null);
  const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const location = useLocation();
  const trip = location.state;
  const missions = [
    {
      date: "2024년 1월 15일 수요일",
      items: [
        {
          id: "20240115-1",
          time: "14:30",
          title: "미션 01",
          place: "강문 해변",
          description: "일기 쓰기",
          img: "https://picsum.photos/600/400",
        },
        {
          id: "20240115-2",
          time: "15:30",
          title: "미션 02",
          place: "강문 해변",
          description: "강문 해변에서 만세하고 점프샷 찍기",
          img: "https://picsum.photos/600/400",
        },
      ],
    },
    {
      date: "2024년 1월 16일 목요일",
      items: [
        {
          id: "20240116-1",
          time: "14:30",
          title: "미션 01",
          place: "강문 해변",
          description: "일기 쓰기",
          img: "https://picsum.photos/600/400",
        },
        {
          id: "20240116-2",
          time: "15:30",
          title: "미션 02",
          place: "강문 해변",
          description: "강문 해변에서 만세하고 점프샷 찍기",
          img: "https://picsum.photos/600/400",
        },
      ],
    },
    {
      date: "2024년 1월 17일 금요일",
      items: [
        {
          id: "20240117-1",
          time: "14:30",
          title: "미션 01",
          place: "강문 해변",
          description: "일기 쓰기",
        },
      ],
    },
  ];

  // 미션별 사진 상태 관리
  const [missionPhotos, setMissionPhotos] = useState({});
  const [photoToggles, setPhotoToggles] = useState({});

  if (!trip) {
    return <div>여행 정보가 없습니다.</div>;
  }

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const createMap = () => {
      if (!mapRef.current) return;

      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(createMap);
    } else {
      if (!document.querySelector('script[src*="dapi.kakao.com"]')) {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => window.kakao.maps.load(createMap);
        document.head.appendChild(script);
      }
    }
  }, []);

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDeletePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePhotoSection = (missionId) => {
    setPhotoToggles((prev) => ({ ...prev, [missionId]: !prev[missionId] }));
  };

  return (
    <>
      <TopBar title="상세 정보" isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebar} />
      <TripCard trip={trip} className="trip-card-details" hideMeta />

      {/* 지도 띄우기 */}
      <div ref={mapRef} style={{ width: "100%", height: "250px" }}></div>

      {/* 미션 리스트 */}
      {missions.map((missionGroup) => (
        <div className="mission-day" key={missionGroup.date}>
          <div className="mission-date-line">
            <span className="dot" /> {missionGroup.date}
          </div>

          {missionGroup.items.map((m) => (
            <ArchiveMissionCard key={m.id} mission={m} />
          ))}
        </div>
      ))}
      {/* 사진 추가 섹션 */}
      <div className="photo-section">
        <div className="photo-title">간직하고 싶은 사진을 추가해 보세요!</div>

        <div className="photo-grid">
          {/* 사진 추가 버튼 */}
          <label className="photo-add-btn">
            +
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAddPhoto}
            />
          </label>

          {/* 업로드된 사진 */}
          {photos.map((p, idx) => (
            <div className="photo-box" key={idx}>
              <img src={p} alt={`photo-${idx}`} />
              <button className="delete-btn" onClick={() => handleDeletePhoto(idx)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 공유 버튼 */}
      <div className="share-menu">
        <button>카카오톡 공유하기</button>
        <button>링크로 공유하기</button>
      </div>
    </>
  );
};

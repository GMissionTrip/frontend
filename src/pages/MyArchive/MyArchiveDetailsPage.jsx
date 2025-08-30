import React, { useState, useRef, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { TripCard } from "@/components/Archive/TripCard";
import { TopBar } from "@/components/common/TopBar";
import { ArchiveMissionCard } from "@/components/Archive/ArchiveMissionCard";
import "@/pages/MyArchive/MyArchiveDetailsPage.css";

export const MyArchiveDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [tab, setTab] = useState("missions");
  const [shareOpen, setShareOpen] = useState(false);

  const mapRef = useRef(null);
  const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY;
  const shareRef = useRef(null);

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

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDeletePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!trip) {
    return <div>여행 정보가 없습니다.</div>;
  }

  return (
    <>
      <TopBar title="상세 정보" isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebar} />
      <TripCard trip={trip} className="trip-card-details" hideMeta />

      {/* 지도 띄우기 */}
      <div ref={mapRef} style={{ width: "100%", height: "250px" }}></div>

      {/* 탭 네비게이션 */}
      <div className="tab-menu">
        <button className={tab === "missions" ? "active" : ""} onClick={() => setTab("missions")}>
          미션
        </button>
        <button className={tab === "photos" ? "active" : ""} onClick={() => setTab("photos")}>
          사진
        </button>
      </div>

      {/* 미션 리스트 */}
      {tab === "missions" &&
        missions.map((missionGroup) => (
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
      {tab === "photos" && (
        <div className="photo-section">
          <div className="photo-title">추억 사진 모아보기</div>
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
      )}

      <div className="share-menu">
        <div className="share-btn" ref={shareRef} onClick={() => setShareOpen(!shareOpen)}>
          <FaShareAlt />
        </div>
        <div className={`share-dropdown ${shareOpen ? "show" : ""}`}>
          <button onClick={() => alert("카카오톡 공유")}>카카오톡 공유</button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("링크가 복사되었습니다!");
            }}
          >
            링크로 공유
          </button>
        </div>
      </div>
    </>
  );
};

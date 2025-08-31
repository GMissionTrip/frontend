import React, { useState, useRef, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { TripCard } from "@/components/Archive/TripCard";
import { TopBar } from "@/components/common/TopBar";
import { ArchiveMissionCard } from "@/components/Archive/ArchiveMissionCard";
import "@/pages/MyArchive/MyArchiveDetailsPage.css";

export const MyArchiveDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("missions");
  const [shareOpen, setShareOpen] = useState(false);
  const [missionPhotos, setMissionPhotos] = useState({});
  const [modalPhoto, setModalPhoto] = useState(null);
  const [addPhotoModal, setAddPhotoModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const shareRef = useRef(null);
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

  const handleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(files.map((f) => URL.createObjectURL(f)));
    setAddPhotoModal(true);
  };

  const handleAssignPhotos = (missionId) => {
    setMissionPhotos((prev) => ({
      ...prev,
      [missionId]: [...(prev[missionId] || []), ...selectedFiles],
    }));
    setSelectedFiles([]);
    setAddPhotoModal(false);
  };

  const handleDeletePhoto = (missionId, idx) => {
    setMissionPhotos((prev) => ({
      ...prev,
      [missionId]: prev[missionId].filter((_, i) => i !== idx),
    }));
  };

  useEffect(() => {
    // Kakao Map 초기화
    const createMap = () => {
      if (!mapRef.current) return;
      new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      });
    };
    if (window.kakao && window.kakao.maps) window.kakao.maps.load(createMap);
    else if (!document.querySelector('script[src*="dapi.kakao.com"]')) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => window.kakao.maps.load(createMap);
      document.head.appendChild(script);
    }

    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!trip) return <div>여행 정보가 없습니다.</div>;

  return (
    <>
      <TopBar title="상세 정보" isSidebarOpen={isSidebarOpen} onToggleSidebar={handleSidebar} />
      <TripCard trip={trip} className="trip-card-details" hideMeta />

      <div ref={mapRef} style={{ width: "100%", height: "250px" }}></div>

      <div className="tab-menu">
        <button className={tab === "missions" ? "active" : ""} onClick={() => setTab("missions")}>
          미션
        </button>
        <button className={tab === "photos" ? "active" : ""} onClick={() => setTab("photos")}>
          사진
        </button>
      </div>

      {tab === "missions" &&
        missions.map((group) => (
          <div key={group.date} className="mission-day">
            <div className="mission-date-line">
              <span className="dot" /> {group.date}
            </div>
            {group.items.map((m) => (
              <ArchiveMissionCard key={m.id} mission={m} />
            ))}
          </div>
        ))}

      {tab === "photos" && (
        <>
          <button
            className="floating-add-btn"
            onClick={() => document.getElementById("fileInput").click()}
          >
            +
          </button>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleSelectFiles}
          />
          {missions.map((group) => (
            <div key={group.date} className="mission-day">
              <div className="mission-date-line">
                <span className="dot" /> {group.date}
              </div>
              {group.items.map((m) => (
                <div key={m.id} className="mission-photo-group">
                  <div className="mission-header">
                    {m.title} <span style={{ fontWeight: 400, color: "#777" }}>@ {m.place}</span>
                  </div>
                  <div className="photo-grid-horizontal">
                    {(missionPhotos[m.id] || []).map((p, idx) => (
                      <div key={idx} className="photo-box" onClick={() => setModalPhoto(p)}>
                        <img src={p} alt={`photo-${idx}`} />
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(m.id, idx);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {addPhotoModal && (
            <div className="add-photo-modal">
              <div className="modal-content">
                <h4>사진을 추가할 미션 선택</h4>
                <div className="selected-photos-preview">
                  {selectedFiles.map((p, idx) => (
                    <img key={idx} src={p} alt={`preview-${idx}`} />
                  ))}
                </div>
                {missions
                  .flatMap((g) => g.items)
                  .map((m) => (
                    <button key={m.id} onClick={() => handleAssignPhotos(m.id)}>
                      {m.title} @ {m.place}
                    </button>
                  ))}
                <button
                  onClick={() => {
                    setAddPhotoModal(false);
                    setSelectedFiles([]);
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {modalPhoto && (
        <div className="photo-modal" onClick={() => setModalPhoto(null)}>
          <img src={modalPhoto} alt="확대 사진" />
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

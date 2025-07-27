import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { TripCard } from "@/components/Archive/TripCard";
import { TopBar } from "@/components/common/TopBar";

export const MyArchiveDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [photos, setPhotos] = useState([
    "https://picsum.photos/600/400",
    "https://picsum.photos/600/401",
  ]);

  const mapRef = useRef(null);

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

  // const photos = [
  //   "https://picsum.photos/600/400",
  //   "https://picsum.photos/600/400",
  //   "https://picsum.photos/600/400",
  // ];
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
        script.src =
          "//dapi.kakao.com/v2/maps/sdk.js?appkey=a1695389a580ad3b3491b1d31db7dfbc&autoload=false&libraries=services";
        script.async = true;
        script.onload = () => window.kakao.maps.load(createMap);
        document.head.appendChild(script);
      }
    }
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotos]);
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

          {missionGroup.items.map((m) => {
            const isOpen = expandedIds.has(m.id);
            return (
              <div className="mission-item" key={m.id}>
                <div className="time-line">
                  <span className="time-dot" />
                  <span className="time">{m.time}</span>
                </div>

                <div className="mission-bubble">
                  <div className="mission-header">
                    <span className="mission-title">{m.title}</span>
                    <button className="detail-link" onClick={() => toggleExpand(m.id)}>
                      {isOpen ? "접기" : "자세히 보기"}
                    </button>
                  </div>
                  <div className="mission-sub">† {m.place}</div>

                  <div className={`collapse ${isOpen ? "open" : ""}`}>
                    {m.img && (
                      <div className="mission-img">
                        <img src={m.img} alt={m.title} />
                      </div>
                    )}
                    {m.description && <p className="desc">{m.description}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* 사진 추가 */}
      <div className="photo-section">
        <div className="photo-title">간직하고 싶은 사진을 추가해 보세요!</div>
        <div className="photo-grid">
          <label className="photo-add">
            +{" "}
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAddPhoto}
            />
          </label>
        </div>

        {/* 업로드된 사진 */}
        {photos.map((p, idx) => (
          <div className="photo-box" key={idx}>
            <img src={p} alt={`photo-${idx}`} />
          </div>
        ))}
      </div>

      {/* 공유 버튼 */}
      <div className="share-menu">
        <button>카카오톡 공유하기</button>
        <button>링크로 공유하기</button>
      </div>
    </>
  );
};

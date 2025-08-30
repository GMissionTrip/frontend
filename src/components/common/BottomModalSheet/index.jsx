import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

const MIN_HEIGHT = 100;

export const BottomModalSheet = () => {
  const sheetRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [MAX_HEIGHT, setMaxHeight] = useState(0);
  const [activeTab, setActiveTab] = useState("recommend");
  const [places, setPlaces] = useState([
    {
      id: 1,
      category: "카페",
      name: "아라이리오 카페",
      imageUrl: "https://placehold.co/120x80",
    },
    {
      id: 2,
      category: "여행",
      name: "북촌 한옥마을",
      imageUrl: "https://placehold.co/120x80",
    },
    {
      id: 3,
      category: "추억",
      name: "인사동 거리",
      imageUrl: "https://placehold.co/120x80",
    },
  ]);

  useEffect(() => {
    const max = window.innerHeight * 0.8;
    setMaxHeight(max);

    setCurrentHeight(max);
  }, []);

  // 상세 정보 버튼 클릭
  const handleDetail = (id) => {
    console.log("상세 정보 보기:", id);
  };

  // 관광지 담기 버튼 클릭
  const handleAdd = (id) => {
    console.log("관광지 담기:", id);
  };

  const handlePointerDown = (e) => {
    setStartY(e.clientY);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const diff = startY - e.clientY; // 위로 올리면 높이 증가
    let newHeight = currentHeight + diff;

    if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
    if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;

    setCurrentHeight(newHeight);
    setStartY(e.clientY);
  };

  const handlePointerUp = () => {
    setDragging(false);
    const middle = (MAX_HEIGHT + MIN_HEIGHT) / 2;
    setCurrentHeight(currentHeight < middle ? MIN_HEIGHT : MAX_HEIGHT);
  };

  return (
    <div
      className="bottom-sheet"
      ref={sheetRef}
      style={{ height: `${currentHeight}px` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="drag-handle" />
      <div className="sheet-header">
        <div className="tab-container">
          <button
            className={`tab ${activeTab === "recommend" ? "active" : ""}`}
            onClick={() => setActiveTab("recommend")}
          >
            추천 관광지
          </button>
          <button
            className={`tab ${activeTab === "mylist" ? "active" : ""}`}
            onClick={() => setActiveTab("mylist")}
          >
            내 여행 담은 목록
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="sheet-content">
        {places.map((place) => (
          <div className="place-card" key={place.id}>
            <div className="place-info">
              <span className="tag">#{place.category}</span>
              <h3>{place.name}</h3>
              <div className="btn-group">
                <button className="btn-outline" onClick={() => handleDetail(place.id)}>
                  상세 정보
                </button>
                <button className="btn-filled" onClick={() => handleAdd(place.id)}>
                  관광지 담기
                </button>
              </div>
            </div>
            <img src={place.imageUrl} alt={place.name} />
          </div>
        ))}
      </div>

      <div className="sheet-footer">
        <button className="btn-primary">경로 최적화 →</button>
      </div>
    </div>
  );
};

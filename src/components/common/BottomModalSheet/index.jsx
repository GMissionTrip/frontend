import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

const MIN_HEIGHT = 100;

export const BottomModalSheet = () => {
  const sheetRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [MAX_HEIGHT, setMaxHeight] = useState(0);

  useEffect(() => {
    const max = window.innerHeight * 0.8;
    setMaxHeight(max);

    setCurrentHeight(max);
  }, []);

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
      <div className="sheet-header">
        <h2>모달 제목</h2>
      </div>
      <div className="sheet-content">
        <p>모달 내용 여기에 작성</p>
      </div>
    </div>
  );
};

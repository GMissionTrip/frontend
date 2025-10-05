"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./styles.css";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  initialHeight?: number; // 초기 높이 (%)
  maxHeight?: number; // 최대 높이 (%)
  minHeight?: number; // 최소 높이 (%)
  showHandle?: boolean; // 핸들 표시 여부
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  initialHeight = 40,
  maxHeight = 80,
  minHeight = 20,
  showHandle = true,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(initialHeight);
  const sheetRef = useRef<HTMLDivElement>(null);

  // 드래그 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(height);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  // 드래그 중
  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDragging) return;

      const deltaY = startY - clientY;
      const deltaHeight = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + deltaHeight));
      setHeight(newHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY);
    };

    const handleEnd = () => {
      setIsDragging(false);

      // 스냅 효과
      if (height < (minHeight + initialHeight) / 2) {
        setHeight(minHeight);
      } else if (height > (initialHeight + maxHeight) / 2) {
        setHeight(maxHeight);
      } else {
        setHeight(initialHeight);
      }
    };

    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchend", handleEnd);
      window.addEventListener("mouseup", handleEnd);
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [isDragging, startY, startHeight, height, minHeight, initialHeight, maxHeight]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="bottom-sheet-overlay" onClick={onClose} />

      {/* 바텀 시트 */}
      <div
        ref={sheetRef}
        className={`bottom-sheet ${isDragging ? "dragging" : ""}`}
        style={{
          height: `${height}vh`,
          transition: isDragging ? "none" : "height 0.3s ease",
        }}
      >
        {/* 드래그 핸들 */}
        {showHandle && (
          <div
            className="bottom-sheet-handle"
            onTouchStart={handleTouchStart}
            onMouseDown={handleMouseDown}
          >
            <div className="handle-bar" />
            {height < maxHeight ? (
              <FaChevronUp className="handle-icon" />
            ) : (
              <FaChevronDown className="handle-icon" />
            )}
          </div>
        )}

        {/* 헤더 */}
        {title && (
          <div className="bottom-sheet-header">
            <h3 className="bottom-sheet-title">{title}</h3>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="bottom-sheet-content">{children}</div>
      </div>
    </>
  );
};


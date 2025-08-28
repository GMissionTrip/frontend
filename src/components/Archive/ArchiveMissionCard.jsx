import React, { useState } from "react";
import { MissionPhotos } from "@/components/Archive/MissionPhotos";
import "./ArchiveMissionCard.css";

export const ArchiveMissionCard = ({ mission }) => {
  const [isOpen, setIsOpen] = useState(false); // 미션 상세 토글
  const [isPhotoOpen, setIsPhotoOpen] = useState(false); // 사진 영역 토글
  const [photos, setPhotos] = useState([]); // 해당 미션 사진

  const toggleExpand = () => setIsOpen((prev) => !prev);
  const togglePhoto = () => setIsPhotoOpen((prev) => !prev);

  return (
    <div className="mission-card">
      <div className="mission-row">
        <div className="time-line">
          <span className="time-dot" />
          <span className="time">{mission.time}</span>
        </div>

        <div className="mission-bubble">
          <div className="mission-header">
            <span className="mission-title">{mission.title}</span>
            <button className="detail-link" onClick={toggleExpand}>
              {isOpen ? "접기" : "자세히 보기"}
            </button>
          </div>

          <div className="mission-sub">† {mission.place}</div>

          {isOpen && (
            <div className="collapse open">
              {mission.img && (
                <div className="mission-img">
                  <img src={mission.img} alt={mission.title} />
                </div>
              )}
              {mission.description && <p className="desc">{mission.description}</p>}
            </div>
          )}
        </div>
      </div>

      <button className="toggle-photo-btn" onClick={togglePhoto}>
        {isPhotoOpen ? "사진 숨기기" : "사진 추가/보기"}
      </button>

      {isPhotoOpen && (
        <MissionPhotos missionId={mission.id} photos={photos} setPhotos={setPhotos} />
      )}
    </div>
  );
};

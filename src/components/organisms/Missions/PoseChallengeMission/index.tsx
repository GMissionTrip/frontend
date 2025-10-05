"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import { Mission, MissionSubmission } from "@/types/mission";
import "./styles.css";

interface PoseChallengeMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

export default function PoseChallengeMission({ mission, onSubmit }: PoseChallengeMissionProps) {
  const [photo, setPhoto] = useState<string | null>(mission.submittedData?.photos?.[0] || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhoto(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!photo) {
      alert("사진을 업로드해주세요.");
      return;
    }
    onSubmit({ photos: [photo] });
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="pose-challenge-mission">
      <h3 className="mission-subtitle">따라할 포즈</h3>
      <p className="mission-description-small">
        위 포즈를 따라한 사진을 올려주세요!
      </p>

      {/* 예시 포즈 이미지 */}
      <div className="pose-example">
        <div className="pose-image-container">
          {mission.requirements?.poseImage && (
            <Image
              src={mission.requirements.poseImage}
              alt="예시 포즈"
              fill
              className="pose-image"
            />
          )}
        </div>
        <p className="pose-label">Y자 포즈</p>
      </div>

      {/* 사진 업로드 영역 */}
      <div className="photo-upload-area">
        {photo ? (
          <div className="uploaded-photo">
            <Image src={photo} alt="업로드된 사진" fill className="uploaded-image" />
            <button className="retake-button" onClick={openCamera}>
              다시 찍기
            </button>
          </div>
        ) : (
          <button className="upload-placeholder" onClick={openCamera}>
            <FaCamera className="camera-icon-large" />
            <span>포즈 사진 업로드</span>
            <p className="upload-hint">위 포즈를 따라한 사진을 올려주세요!</p>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!photo}
      >
        포즈 완료!
      </button>
    </div>
  );
}


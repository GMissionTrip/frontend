"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import { Mission, MissionSubmission } from "@/types/mission";
import "./styles.css";

interface RandomChallengeMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

export default function RandomChallengeMission({ mission, onSubmit }: RandomChallengeMissionProps) {
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
    <div className="random-challenge-mission">
      <h3 className="mission-subtitle">오늘의 랜덤 챌린지</h3>
      <p className="mission-description-small">
        현재위치와 사진 찍기
      </p>

      {/* 사진 업로드 영역 */}
      <div className="challenge-photo-area">
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
            <span>현재 위치 사진 업로드</span>
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
        챌린지 완료!
      </button>
    </div>
  );
}


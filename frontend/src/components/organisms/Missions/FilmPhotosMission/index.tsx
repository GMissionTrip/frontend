"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import { Mission, MissionSubmission } from "@/types/mission";
import "./styles.css";

interface FilmPhotosMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

export default function FilmPhotosMission({ mission, onSubmit }: FilmPhotosMissionProps) {
  const [photos, setPhotos] = useState<string[]>(mission.submittedData?.photos || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requiredCount = mission.requirements?.photoCount || 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string);
          if (newPhotos.length === files.length) {
            setPhotos((prev) => [...prev, ...newPhotos].slice(0, requiredCount));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (photos.length < requiredCount) {
      alert(`${requiredCount}장의 사진을 모두 업로드해주세요.`);
      return;
    }
    onSubmit({ photos });
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="film-photos-mission">
      <h3 className="mission-subtitle">여행 베컷 요약</h3>

      {/* 필름 프레임 */}
      <div className="film-strip">
        {/* 필름 홀 (왼쪽) */}
        <div className="film-holes film-holes-left">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`left-${i}`} className="film-hole" />
          ))}
        </div>

        {/* 사진 프레임들 */}
        <div className="film-frames">
          {Array.from({ length: requiredCount }).map((_, index) => (
            <div key={index} className="film-frame">
              {photos[index] ? (
                <Image
                  src={photos[index]}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="film-photo"
                />
              ) : (
                <div className="film-frame-empty">
                  <span className="frame-placeholder">사진업로드</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 필름 홀 (오른쪽) */}
        <div className="film-holes film-holes-right">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`right-${i}`} className="film-hole" />
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="film-actions">
        <button className="add-photos-button" onClick={openCamera}>
          <FaCamera /> 사진 추가하기
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={photos.length < requiredCount}
        >
          필름 완성!
        </button>
      </div>
    </div>
  );
}


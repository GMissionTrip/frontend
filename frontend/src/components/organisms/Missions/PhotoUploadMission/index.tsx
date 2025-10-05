"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaCamera, FaPlus } from "react-icons/fa";
import { Mission, MissionSubmission } from "@/types/mission";
import "./styles.css";

interface PhotoUploadMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

export default function PhotoUploadMission({ mission, onSubmit }: PhotoUploadMissionProps) {
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

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
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
    <div className="photo-upload-mission">
      <h3 className="mission-subtitle">{mission.title}</h3>
      <p className="mission-description-small">
        {mission.description}
      </p>

      <div className="photo-grid">
        {Array.from({ length: requiredCount }).map((_, index) => (
          <div key={index} className="photo-slot">
            {photos[index] ? (
              <div className="photo-preview">
                <Image
                  src={photos[index]}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="photo-image"
                />
                <button
                  className="remove-photo-btn"
                  onClick={() => handleRemovePhoto(index)}
                >
                  ×
                </button>
              </div>
            ) : (
              <button className="add-photo-btn" onClick={openCamera}>
                <FaPlus />
              </button>
            )}
          </div>
        ))}
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

      <div className="mission-actions">
        <button
          className="camera-button"
          onClick={openCamera}
        >
          <FaCamera /> 사진 업로드
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={photos.length < requiredCount}
        >
          가족과 함께 찍은 사진을 올려주세요!
        </button>
      </div>
    </div>
  );
}


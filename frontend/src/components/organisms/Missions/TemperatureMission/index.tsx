"use client";

import React, { useState } from "react";
import { Mission, MissionSubmission } from "@/types/mission";
import "./styles.css";

interface TemperatureMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

const temperatureOptions = [
  { value: 20, label: "20도 - 아쉬워요" },
  { value: 40, label: "40도 - 보통이에요" },
  { value: 60, label: "60도 - 좋아요" },
  { value: 80, label: "80도 - 정말 좋아요" },
  { value: 100, label: "100도 - 최고예요!" },
];

export default function TemperatureMission({ mission, onSubmit }: TemperatureMissionProps) {
  const [selectedTemp, setSelectedTemp] = useState<number | null>(
    mission.submittedData?.temperature || null
  );

  const handleSubmit = () => {
    if (selectedTemp === null) {
      alert("온도를 선택해주세요.");
      return;
    }
    onSubmit({ temperature: selectedTemp });
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 40) return "#7EA8BE";
    if (temp <= 60) return "#5B8BA0";
    if (temp <= 80) return "#FF6B6B";
    return "#FF4757";
  };

  return (
    <div className="temperature-mission">
      <h3 className="mission-subtitle">여행 만족도 온도계</h3>
      <p className="mission-description-small">
        지금 당신의 여행 기분을 온도로 표현해보세요!
      </p>

      {/* 온도계 시각화 */}
      <div className="thermometer-container">
        <div className="thermometer">
          <div
            className="thermometer-fill"
            style={{
              height: `${selectedTemp || 0}%`,
              backgroundColor: selectedTemp ? getTemperatureColor(selectedTemp) : "#E0E0E0",
            }}
          />
          <div className="thermometer-bulb">
            <div
              className="thermometer-bulb-fill"
              style={{
                backgroundColor: selectedTemp ? getTemperatureColor(selectedTemp) : "#E0E0E0",
              }}
            />
          </div>
        </div>
      </div>

      {/* 온도 선택 버튼들 */}
      <div className="temperature-options">
        {temperatureOptions.map((option) => (
          <button
            key={option.value}
            className={`temperature-option ${
              selectedTemp === option.value ? "selected" : ""
            }`}
            onClick={() => setSelectedTemp(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={selectedTemp === null}
      >
        온도 선택 완료
      </button>
    </div>
  );
}


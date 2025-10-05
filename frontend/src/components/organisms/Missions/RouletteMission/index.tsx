"use client";

import React, { useState } from "react";
import { Mission, MissionSubmission, RouletteOption } from "@/types/mission";
import "./styles.css";

interface RouletteMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

const rouletteOptions: RouletteOption[] = [
  { id: "1", text: "선택림미션", color: "#2C5F7C", percentage: 25 },
  { id: "2", text: "5초간 춤추기", color: "#4A7C8C", percentage: 25 },
  { id: "3", text: "다음 챌린지 뽑기", color: "#6B99A0", percentage: 25 },
  { id: "4", text: "미션 수행", color: "#8CB6B4", percentage: 25 },
];

export default function RouletteMission({ mission, onSubmit }: RouletteMissionProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RouletteOption | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * rouletteOptions.length);
    const selected = rouletteOptions[randomIndex];

    // 5회전 + 랜덤 각도
    const spins = 5;
    const baseRotation = 360 * spins;
    const optionAngle = 360 / rouletteOptions.length;
    const targetAngle = optionAngle * randomIndex;
    const finalRotation = baseRotation + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setSelectedOption(selected);
      setIsSpinning(false);
    }, 3000);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      alert("룰렛을 먼저 돌려주세요!");
      return;
    }
    onSubmit({ selectedOption: selectedOption.text });
  };

  return (
    <div className="roulette-mission">
      <h3 className="mission-subtitle">오늘의 랜덤 챌린지</h3>
      
      {/* 룰렛 차트 */}
      <div className="roulette-container">
        <div className="roulette-pointer">▼</div>
        <svg
          className="roulette-wheel"
          viewBox="0 0 200 200"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {rouletteOptions.map((option, index) => {
            const startAngle = (index * 360) / rouletteOptions.length;
            const endAngle = ((index + 1) * 360) / rouletteOptions.length;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 + 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 + 80 * Math.sin(endRad);
            
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            
            const path = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`,
            ].join(" ");

            return (
              <path key={option.id} d={path} fill={option.color} stroke="#fff" strokeWidth="2" />
            );
          })}
          {/* 중앙 원 */}
          <circle cx="100" cy="100" r="30" fill="#fff" />
        </svg>
      </div>

      {selectedOption && !isSpinning && (
        <div className="selected-option">
          <h4>선택된 미션</h4>
          <p>{selectedOption.text}</p>
        </div>
      )}

      <div className="roulette-actions">
        <button
          className="spin-button"
          onClick={spinRoulette}
          disabled={isSpinning}
        >
          {isSpinning ? "돌리는 중..." : "현재위험 사진 찍기"}
        </button>
        {selectedOption && !isSpinning && (
          <button className="submit-button" onClick={handleSubmit}>
            다른 챌린지 뽑기
          </button>
        )}
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { Mission, MissionSubmission } from "@/types/mission";
import "./styles.css";

interface TextInputMissionProps {
  mission: Mission;
  onSubmit: (data: Omit<MissionSubmission, "submittedAt">) => void;
}

export default function TextInputMission({ mission, onSubmit }: TextInputMissionProps) {
  const [text, setText] = useState(mission.submittedData?.text || "");
  const minLength = mission.requirements?.minTextLength || 10;
  const maxLength = mission.requirements?.maxTextLength || 500;

  const handleSubmit = () => {
    if (text.length < minLength) {
      alert(`최소 ${minLength}자 이상 입력해주세요.`);
      return;
    }
    onSubmit({ text });
  };

  return (
    <div className="text-input-mission">
      <h3 className="mission-subtitle">여행 하루 요약</h3>

      <textarea
        className="mission-textarea"
        placeholder="여행 중 있었던 기억 나는 일들을 요약해보세요!"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={maxLength}
      />

      <div className="char-count">
        {text.length}/{maxLength}자
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={text.length < minLength}
      >
        작성 완료
      </button>
    </div>
  );
}


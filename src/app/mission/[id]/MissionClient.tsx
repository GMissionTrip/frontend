"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaInfoCircle, FaCamera } from "react-icons/fa";
import { missionService } from "@/services/missionService";
import { Mission, MissionSubmission } from "@/types/mission";
import PhotoUploadMission from "@/components/organisms/Missions/PhotoUploadMission";
import TemperatureMission from "@/components/organisms/Missions/TemperatureMission";
import TextInputMission from "@/components/organisms/Missions/TextInputMission";
import PoseChallengeMission from "@/components/organisms/Missions/PoseChallengeMission";
import RouletteMission from "@/components/organisms/Missions/RouletteMission";
import FilmPhotosMission from "@/components/organisms/Missions/FilmPhotosMission";
import RandomChallengeMission from "@/components/organisms/Missions/RandomChallengeMission";

export default function MissionClient() {
  const params = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    loadMission();
  }, [params.id]);

  const loadMission = async () => {
    try {
      setIsLoading(true);
      const data = await missionService.getMission(params.id as string);
      setMission(data);
    } catch (error) {
      alert("미션을 불러올 수 없습니다.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<MissionSubmission, "submittedAt">) => {
    try {
      await missionService.submitMission(params.id as string, data);
      alert("미션이 완료되었습니다! 🎉");
      router.push("/current-trip");
    } catch (error) {
      alert("미션 완료에 실패했습니다.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>미션 로딩 중...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="error-container">
        <p>미션을 찾을 수 없습니다.</p>
        <button onClick={handleBack}>돌아가기</button>
      </div>
    );
  }

  const renderMissionContent = () => {
    switch (mission.type) {
      case "photo_upload":
        return <PhotoUploadMission mission={mission} onSubmit={handleSubmit} />;
      case "temperature":
        return <TemperatureMission mission={mission} onSubmit={handleSubmit} />;
      case "text_input":
        return <TextInputMission mission={mission} onSubmit={handleSubmit} />;
      case "pose_challenge":
        return <PoseChallengeMission mission={mission} onSubmit={handleSubmit} />;
      case "roulette":
        return <RouletteMission mission={mission} onSubmit={handleSubmit} />;
      case "film_photos":
        return <FilmPhotosMission mission={mission} onSubmit={handleSubmit} />;
      case "random_challenge":
        return <RandomChallengeMission mission={mission} onSubmit={handleSubmit} />;
      default:
        return <div>알 수 없는 미션 타입입니다.</div>;
    }
  };

  return (
    <div className="mission-detail-page">
      <div className="mission-header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1 className="mission-title">{mission.title}</h1>
        <button className="info-btn" onClick={() => setShowInfo(!showInfo)}>
          <FaInfoCircle />
        </button>
      </div>

      {showInfo && (
        <div className="mission-info-card">
          <p className="mission-description">{mission.description}</p>
          <div className="mission-points">
            <span>획득 포인트: {mission.points}P</span>
          </div>
        </div>
      )}

      <div className="mission-content">{renderMissionContent()}</div>
    </div>
  );
}


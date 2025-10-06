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
import "./styles.css";

// ✅ AWS 정적 export용 - 동적 라우팅 허용
export const dynamicParams = true;

export default function MissionDetailPage() {
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
      console.error("미션 로드 실패:", error);
      alert("미션을 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (submissionData: Omit<MissionSubmission, "submittedAt">) => {
    if (!mission) return;

    try {
      await missionService.submitMission(mission.id, submissionData);
      alert(`${mission.points}P 획득!`);
      router.push("/current-trip");
    } catch (error) {
      console.error("미션 제출 실패:", error);
      alert("미션 제출에 실패했습니다");
    }
  };

  const handleUnlock = async () => {
    if (!mission) return;

    try {
      const unlockedMission = await missionService.unlockMission(mission.id);
      setMission(unlockedMission);
      alert("미션이 공개되었습니다!");
    } catch (error) {
      console.error("미션 잠금 해제 실패:", error);
      alert("미션 잠금 해제에 실패했습니다");
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        미션 로딩 중...
      </div>
    );
  }

  if (!mission) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        미션을 찾을 수 없습니다
      </div>
    );
  }

  // 잠긴 미션 (반전 미션)
  if (mission.status === "locked") {
    return (
      <div className="mission-page">
        <div
          className="mission-header"
          style={{ background: mission.gradient }}
        >
          <button className="back-button" onClick={() => router.back()}>
            <FaArrowLeft />
          </button>
          <div className="mission-header-content">
            <h1 className="mission-title">반전 미션</h1>
            <p className="mission-category">{mission.category}</p>
          </div>
        </div>

        <div className="locked-mission-content">
          <div className="locked-card">
            <div className="locked-icon">🔒</div>
            <h2>넘성 풀경 1번등과<br />가만히 바라보기</h2>
            <button className="unlock-button" onClick={handleUnlock}>
              넘성 뜯켜 정알 바라보기!
            </button>
            <p className="unlock-hint">제한 {mission.points}P</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mission-page">
      {/* 헤더 */}
      <div
        className="mission-header"
        style={{ background: mission.gradient }}
      >
        <button className="back-button" onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
        <div className="mission-header-content">
          <div className="mission-icon-large">{mission.icon}</div>
          <h1 className="mission-title">{mission.title}</h1>
          <p className="mission-category">{mission.category}</p>
          <p className="mission-description">{mission.description}</p>
        </div>
        {mission.type !== "roulette" && (
          <button
            className="info-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            <FaInfoCircle />
          </button>
        )}
      </div>

      {/* 미션 타입별 컴포넌트 */}
      <div className="mission-content">
        <div className="mission-points-badge">
          <span className="points-label">미션 수행</span>
          <span className="points-value">{mission.points} 포인트</span>
        </div>

        {mission.type === "photo_upload" && (
          <PhotoUploadMission mission={mission} onSubmit={handleSubmit} />
        )}
        {mission.type === "temperature" && (
          <TemperatureMission mission={mission} onSubmit={handleSubmit} />
        )}
        {mission.type === "text_input" && (
          <TextInputMission mission={mission} onSubmit={handleSubmit} />
        )}
        {mission.type === "pose_challenge" && (
          <PoseChallengeMission mission={mission} onSubmit={handleSubmit} />
        )}
        {mission.type === "roulette" && (
          <RouletteMission mission={mission} onSubmit={handleSubmit} />
        )}
        {mission.type === "film_photos" && (
          <FilmPhotosMission mission={mission} onSubmit={handleSubmit} />
        )}
        {mission.type === "random_challenge" && (
          <RandomChallengeMission mission={mission} onSubmit={handleSubmit} />
        )}
      </div>

      {/* 정보 모달 */}
      {showInfo && (
        <div className="info-modal" onClick={() => setShowInfo(false)}>
          <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>미션 안내</h3>
            <p>{mission.description}</p>
            {mission.requirements?.photoCount && (
              <p>📸 필요한 사진 수: {mission.requirements.photoCount}장</p>
            )}
            {mission.requirements?.minTextLength && (
              <p>✍️ 최소 글자 수: {mission.requirements.minTextLength}자</p>
            )}
            <button className="close-button" onClick={() => setShowInfo(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


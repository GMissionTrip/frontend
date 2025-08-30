import React from "react";
import "./styles.css";

export const InProgressTrip = () => {
  const date = new Date().toLocaleDateString();
  const withPerson = "2명과 함께";
  const missionInfo = [
    {
      date: date,
      title: "해변에서 조개 줍기",
      description: "아침 일찍 일어나기",
      isCompleted: false,
      imageUrl: "https://picsum.photos/300/200?random=1",
      missionDetail: {
        type: "일상",
        location: "해변",
        person: "김민지",
        activity: "조개 줍기",
        date: date,
      },
    },
    {
      date: date,
      title: "짐 싸기",
      description: "짐을 빠짐없이 챙기기",
      isCompleted: true,
      imageUrl: "https://picsum.photos/300/200?random=2",
      missionDetail: {
        type: "일상",
        location: "집",
        person: "김민지",
        activity: "짐 싸기",
        date: date,
      },
    },
    {
      date: date,
      title: "공항 가기",
      description: "공항으로 가기",
      isCompleted: false,
      imageUrl: "https://picsum.photos/300/200?random=3",
      missionDetail: {
        type: "일상",
        location: "공항",
        person: "김민지",
        activity: "공항 가기",
        date: date,
      },
    },
  ];

  return (
    <div className="in-progress-trip">
      <div className="in-progress-trip-header">
        <p>
          {date} ~ {date}
        </p>
        <p>{withPerson} 여행중</p>
        <h2>미션 진행 상황</h2>
      </div>

      <div className="mission-list">
        {missionInfo.map((mission) => (
          <div
            key={mission.title}
            className={`mission-card ${mission.isCompleted ? "completed" : ""}`}
          >
            <img src={mission.imageUrl} alt={mission.title} />
            <div className="mission-card-content">
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <span className={`mission-status ${mission.isCompleted ? "completed" : "pending"}`}>
                {mission.isCompleted ? "완료됨 ✅" : "진행중 ⏳"}
              </span>
            </div>
            <button>기록 추가</button>
          </div>
        ))}
      </div>
      <div className="button-bar">
        <button className="edit-btn">여행 종료</button>
      </div>
    </div>
  );
};

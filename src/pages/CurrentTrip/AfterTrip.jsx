import React from "react";
import "./styles.css";

export const AfterTrip = () => {
  const missionInfo = {
    location: "제주도 여행",
    title: "해변에서 조개 줍기",
    imageUrl: "https://picsum.photos/800/400?random=1",
    startDate: "2023-10-10",
    endDate: "2023-10-12",
    participant: "3명",
    status: "완료",
    missionInfo: [
      {
        location: "제주도 해변",
        title: "해변에서 조개 줍기",
        imageUrl: "https://picsum.photos/300/200?random=1",
        startDate: "2023-10-10",
      },
      {
        location: "제주도 해변",
        title: "해변에서 조개 줍기",
        imageUrl: "https://picsum.photos/300/200?random=2",
        startDate: "2023-10-10",
      },
      {
        location: "제주도 해변",
        title: "해변에서 조개 줍기",
        imageUrl: "https://picsum.photos/300/200?random=3",
        startDate: "2023-10-10",
      },
    ],
  };

  return (
    <div className="after-trip">
      <img src={missionInfo.imageUrl} alt={missionInfo.title} />
      <h2>{missionInfo.title}</h2>
      <p>{missionInfo.location}</p>
      <p>
        {missionInfo.startDate} - {missionInfo.endDate}
      </p>
      <p>{missionInfo.participant}</p>

      <h3>미션 요약</h3>
      <ul>
        {missionInfo.missionInfo.map((info, index) => (
          <li key={index}>
            <h4>{info.title}</h4>
            <p>{info.location}</p>
            <p>{info.startDate}</p>
          </li>
        ))}
      </ul>

      <button>기록 모아보기</button>

      <h3>공유하기</h3>
      <button
        className="copy-btn"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        링크 복사
      </button>
      <div className="button-bar">
        <button className="edit-btn">아카이브에 저장하기</button>
        <button className="edit-btn">새로운 여행 시작하기</button>
      </div>
    </div>
  );
};

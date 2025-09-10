// import React from "react";
// import "./styles.css";

// export const InProgressTrip = () => {
//   const date = new Date().toLocaleDateString();
//   const withPerson = "2명과 함께";
//   const missionInfo = [
//     {
//       date: date,
//       title: "해변에서 조개 줍기",
//       description: "아침 일찍 일어나기",
//       isCompleted: false,
//       imageUrl: "https://picsum.photos/300/200?random=1",
//       missionDetail: {
//         type: "일상",
//         location: "해변",
//         person: "김민지",
//         activity: "조개 줍기",
//         date: date,
//       },
//     },
//     {
//       date: date,
//       title: "짐 싸기",
//       description: "짐을 빠짐없이 챙기기",
//       isCompleted: true,
//       imageUrl: "https://picsum.photos/300/200?random=2",
//       missionDetail: {
//         type: "일상",
//         location: "집",
//         person: "김민지",
//         activity: "짐 싸기",
//         date: date,
//       },
//     },
//     {
//       date: date,
//       title: "공항 가기",
//       description: "공항으로 가기",
//       isCompleted: false,
//       imageUrl: "https://picsum.photos/300/200?random=3",
//       missionDetail: {
//         type: "일상",
//         location: "공항",
//         person: "김민지",
//         activity: "공항 가기",
//         date: date,
//       },
//     },
//   ];

//   return (
//     <div className="in-progress-trip">
//       <div className="in-progress-trip-header">
//         <p>
//           {date} ~ {date}
//         </p>
//         <p>{withPerson} 여행중</p>
//         <h2>미션 진행 상황</h2>
//       </div>

//       <div className="mission-list">
//         {missionInfo.map((mission) => (
//           <div
//             key={mission.title}
//             className={`mission-card ${mission.isCompleted ? "completed" : ""}`}
//           >
//             <img src={mission.imageUrl} alt={mission.title} />
//             <div className="mission-card-content">
//               <h3>{mission.title}</h3>
//               <p>{mission.description}</p>
//               <span className={`mission-status ${mission.isCompleted ? "completed" : "pending"}`}>
//                 {mission.isCompleted ? "완료됨 ✅" : "진행중 ⏳"}
//               </span>
//             </div>
//             <button>기록 추가</button>
//           </div>
//         ))}
//       </div>
//       <div className="button-bar">
//         <button className="edit-btn">여행 종료</button>
//       </div>
//     </div>
//   );
// };
import React from "react";
import { FaCalendarAlt, FaStar } from "react-icons/fa";
import "./styles.css";

export const InProgressTrip = () => {
  const trip = {
    title: "가평의 여름!",
    location: "가평, 경기도",
    days: 3,
    status: "진행중",
    progress: 65,
    start: "2025.06.28",
    end: "2025.06.30",
    imageUrl: "https://picsum.photos/600/400?random=10",
  };

  const missions = [
    { title: "같이찍Go", point: 150, completed: false },
    { title: "닮은꼴 포즈 챌린지", point: 200, completed: false },
    { title: "나의 하루 요약하기", point: 100, completed: false },
    { title: "감정 온도계", point: 120, completed: false },
    { title: "랜덤 챌린지", point: 180, completed: false },
    { title: "3컷 여행 요약", point: 250, completed: false },
  ];

  return (
    <div className="ipt-root">
      {/* 상단 이미지 */}
      <div className="ipt-hero" style={{ backgroundImage: `url(${trip.imageUrl})` }}>
        <span className="ipt-badge">{trip.status}</span>
        <div className="gradient-overlay" />

        <div className="ipt-hero-text">
          <span className="ipt-days">{trip.days}일</span>
          <h2>{trip.title}</h2>
          <p>{trip.location}</p>
          <span className="ipt-date">
            {trip.start} - {trip.end}
          </span>
        </div>
      </div>

      <main className="ipt-content">
        {/* 기간 / 상태 카드 */}
        <div className="ipt-info-cards">
          <div className="ipt-info-card">
            <FaCalendarAlt />
            <div>
              <p>기간</p>
              <strong>{trip.days}일</strong>
            </div>
          </div>
          <div className="ipt-info-card">
            <FaStar />
            <div>
              <p>상태</p>
              <strong>{trip.status}</strong>
            </div>
          </div>
        </div>

        {/* 진행률 */}
        <div className="ipt-progress-card">
          <div className="ipt-progress-top">
            <span>여행 진행률</span>
            <strong>{trip.progress}%</strong>
          </div>
          <div className="ipt-progress-bar">
            <div style={{ width: `${trip.progress}%` }} />
          </div>
          <p>멋진 여행을 즐기고 계시네요! </p>
        </div>

        {/* 미션 리스트 */}
        <div className="ipt-mission-header">
          <h3>미션 수행</h3>
          <span>
            0 / {missions.length} <span className="point">0P</span>
          </span>
        </div>
        <div className="ipt-mission-list">
          {missions.map((m, idx) => (
            <div key={idx} className="ipt-mission-item">
              <div className="ipt-thumb" />
              <div className="ipt-mission-texts">
                <h4>{m.title}</h4>
                <p>가평</p>
                <span className="ipt-point">{m.point}P 미완료</span>
              </div>
              <span className="ipt-arrow">›</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

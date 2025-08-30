import "./styles.css";

export const BeforeTrip = () => {
  const date = new Date().toLocaleDateString();
  const withPerson = "민석 외 2명과 함께";
  const interests = ["자연", "감성"];
  const travelInfo = [
    {
      title: "아침 동산",
      day: 1,
      description: "아침에 일출을 보기 위한 동산",
      imageUrl: "https://picsum.photos/300/200?random=1",
    },
    {
      title: "점심 식사",
      day: 1,
      description: "점심에 맛있는 음식을 먹기 위한 장소",
      imageUrl: "https://picsum.photos/300/200?random=2",
    },
    {
      title: "저녁 동산",
      day: 1,
      description: "저녁에 일몰을 보기 위한 동산",
      imageUrl: "https://picsum.photos/300/200?random=3",
    },
  ];

  return (
    <div className="before-trip">
      <div className="before-trip-header">
        <p>{date}</p>
        <p>{withPerson}</p>
        <div className="interests">
          {interests.map((interest) => (
            <span key={interest}>#{interest}</span>
          ))}
        </div>
        <h2>여행 준비 (출발 전)</h2>
      </div>

      {travelInfo.map((info) => (
        <div className="travel-card" key={info.title}>
          <img src={info.imageUrl} alt={info.title} />
          <div className="travel-card-content">
            <p>{info.day}일차</p>
            <h3>{info.title}</h3>
            <p>{info.description}</p>
          </div>
        </div>
      ))}

      <div className="button-bar">
        <button
          className="copy-btn"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          링크 복사
        </button>
        <button className="edit-btn">여행 수정</button>
      </div>
    </div>
  );
};

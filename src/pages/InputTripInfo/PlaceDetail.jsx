import React, { useState } from "react";
import {
  FaClock,
  FaMoneyBill,
  FaCreditCard,
  FaPhone,
  FaMapMarkerAlt,
  FaWifi,
  FaDog,
  FaCar,
  FaUmbrellaBeach,
  FaStar,
} from "react-icons/fa";
import "./PlaceDetail.css";

export const PlaceDetail = () => {
  const place = {
    category: "카페",
    name: "아라이리오 카페",
    rating: 4.2,
    reviews: 127,
    address: "서울특별시 종로구 인사동길 12",
    operating: "매일 09:00 - 22:00",
    price: "음료 5,000원 - 8,000원",
    payment: "카드, 현금, 계좌이체",
    contact: "02-1234-5678",
    description:
      "인사동 중심가에 위치한 아라이리오 카페는 전통과 현대가 조화를 이루는 특별한 공간입니다. 한옥의 아름다움을 현대적으로 재해석한 인테리어와 정성스럽게 내린 커피로 많은 사랑을 받고 있습니다. 특히 2층에서 바라보는 인사동 거리의 풍경이 일품이며, 사진 촬영 명소로도 유명합니다.",
    facilities: ["WiFi", "주차 가능", "반려동물 동반", "테라스"],
    reviewsList: [
      {
        reviewId: 1,
        user: "김민수",
        date: "2024.01.15",
        content:
          "정말 아름다운 곳이에요! 사진 찍기 좋고 분위기도 너무 좋았습니다. 특히 석양 시간대에 가시는 걸 추천해요.",
        rating: 5,
      },
      {
        reviewId: 2,
        user: "이지영",
        date: "2024.01.10",
        content: "카페 음료도 맛있고 인테리어가 예뻐요. 다만 사람이 많아서 조금 시끄러웠어요.",
        rating: 4,
      },
      {
        reviewId: 3,
        user: "박철수",
        date: "2024.01.08",
        content: "분위기는 좋은데 좌석이 조금 불편했어요.",
        rating: 3,
      },
      {
        reviewId: 4,
        user: "최은지",
        date: "2024.01.05",
        content: "친구랑 가기 딱 좋은 곳이에요. 또 방문하고 싶습니다!",
        rating: 5,
      },
    ],
  };

  const [visibleReviews, setVisibleReviews] = useState(3); // 처음 3개만 표시
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleReviews((prev) => prev + 2); // 2개씩 더 보여주기
      setLoading(false);
    }, 1200); // 로딩 시뮬레이션 (1.2초)
  };

  return (
    <div className="place-detail">
      {/* Header */}
      <div className="header">
        <button className="back-btn">←</button>
        <h2>상세 정보</h2>
        <div className="header-actions">
          <button>♡</button>
          <button>⤴</button>
        </div>
      </div>

      {/* 이미지 섹션 */}
      <div className="image-section">
        <div className="image-placeholder"></div>
        <div className="thumbs">
          <div className="thumb"></div>
          <div className="thumb"></div>
          <div className="thumb more">+5</div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="basic-info">
        <span className="tag">#{place.category}</span>
        <h3>{place.name}</h3>
        <div className="rating">
          <FaStar className="star" />
          <span>{place.rating}</span>
          <span className="review-count">({place.reviews})</span>
        </div>
        <p className="address">
          <FaMapMarkerAlt /> {place.address}
        </p>
      </div>

      {/* 운영 정보 */}
      <div className="section">
        <h4>운영 정보</h4>
        <ul>
          <li>
            <FaClock /> {place.operating}
          </li>
          <li>
            <FaMoneyBill /> {place.price}
          </li>
          <li>
            <FaCreditCard /> {place.payment}
          </li>
          <li>
            <FaPhone /> {place.contact}
          </li>
        </ul>
      </div>

      {/* 소개 */}
      <div className="section">
        <h4>소개</h4>
        <p>{place.description}</p>
      </div>

      {/* 편의시설 */}
      <div className="section">
        <h4>편의시설</h4>
        <div className="facilities">
          <span>
            <FaWifi /> WiFi
          </span>
          <span>
            <FaCar /> 주차 가능
          </span>
          <span>
            <FaDog /> 반려동물 동반
          </span>
          <span>
            <FaUmbrellaBeach /> 테라스
          </span>
        </div>
      </div>

      {/* 리뷰 */}
      <div className="section">
        <h4>리뷰</h4>
        {place.reviewsList.slice(0, visibleReviews).map((r) => (
          <div key={r.reviewId} className="review">
            <div className="review-header">
              <span className="avatar">{r.user[0]}</span>
              <div>
                <strong>{r.user}</strong>
                <span className="date">{r.date}</span>
              </div>
              <span className="rating">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>
            <p>{r.content}</p>
          </div>
        ))}

        {/* 더보기 버튼 */}
        {visibleReviews < place.reviewsList.length && (
          <div className="load-more">
            {loading ? (
              <span className="loading"> 로딩중..</span>
            ) : (
              <button onClick={handleLoadMore}>리뷰 더보기</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

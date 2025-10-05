"use client";

import React, { useState } from "react";
import "./styles.css";
import { FaHeart, FaEye, FaRegHeart } from "react-icons/fa";

interface OtherTravelData {
  imageUrl: string;
  title: string;
  subtitle: string;
  view: number;
  like: number;
}

interface OtherTravelCardProps {
  data: OtherTravelData;
}

const OtherTravelCard: React.FC<OtherTravelCardProps> = ({ data }) => {
  const [isLiked, setIsLiked] = useState(false);

  const onClickLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="other-travel-card">
      <img src={data.imageUrl} alt={data.title} />
      <div className="other-travel-card-content">
        <div className="other-travel-card-info">
          <h3>{data.title}</h3>
          <p>{data.subtitle}</p>
        </div>
        <div className="other-travel-card-stats">
          <span>
            <FaEye /> {data.view}
          </span>
          <span onClick={onClickLike} className="like-icon">
            {isLiked ? <FaHeart /> : <FaRegHeart />} {data.like}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OtherTravelCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegUser,
  FaHeart,
  FaRegCommentDots,
  FaShareAlt,
  FaBookmark,
} from "react-icons/fa";
import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import "./styles.css";

export const OthersJourneyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("피드");

  const dummyPosts = [
    {
      id: 1,
      user: "Liam",
      location: "제주도 성산일출봉",
      timeAgo: "2시간 전",
      title: "제주도 3박 4일 완벽 가이드",
      tags: ["#제주도", "#성산일출봉", "#일출"],
      likes: 127,
      comments: 23,
      imageUrl: "",
    },
    {
      id: 2,
      user: "Liam",
      location: "제주도 성산일출봉",
      timeAgo: "2시간 전",
      title: "제주도 3박 4일 완벽 가이드",
      tags: ["#제주도", "#성산일출봉", "#일출"],
      likes: 127,
      comments: 23,
      imageUrl: "",
    },
  ];

  return (
    <LayoutTitleWithActions
      title="둘러보기"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => navigate("/main")}
      icon={<FaRegUser />}
      onIconClick={() => navigate("/login")}
    >
      {/* 탭 */}
      <div className="tabs">
        {["피드", "인기"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 게시글 카드 */}
      <div className="feed-list">
        {dummyPosts.map((post) => (
          <div key={post.id} className="feed-card">
            <div className="feed-header">
              <div className="profile-circle">{post.user.charAt(0)}</div>
              <div className="feed-info">
                <span className="username">{post.user} ★127</span>
                <span className="meta">
                  {post.location} · {post.timeAgo}
                </span>
              </div>
              <button className="more-btn">⋮</button>
            </div>

            <h3 className="feed-title">{post.title}</h3>

            <div className="tags">
              {post.tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="feed-image">
              {post.imageUrl ? (
                <img src={post.imageUrl} alt="여행사진" />
              ) : (
                <div className="image-placeholder" />
              )}
              <button className="bookmark-btn">
                <FaBookmark />
              </button>
            </div>

            <div className="feed-actions">
              <div className="left">
                <span>
                  <FaHeart /> {post.likes}
                </span>
                <span>
                  <FaRegCommentDots /> {post.comments}
                </span>
              </div>
              <div>
                <FaShareAlt />
              </div>
            </div>
          </div>
        ))}
      </div>
    </LayoutTitleWithActions>
  );
};

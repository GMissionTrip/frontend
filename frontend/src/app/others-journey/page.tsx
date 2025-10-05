"use client";

import React, { useState } from "react";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Sidebar } from "@/components/organisms/Landing/Sidebar";
import { Modal } from "@/components/atoms/Modal";
import { Button } from "@/components/atoms/Button";
import { Loading } from "@/components/atoms/Loading";
import { 
  FaBars, 
  FaHeart, 
  FaComment, 
  FaShareAlt, 
  FaBookmark, 
  FaEllipsisV,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import Image from "next/image";
import { useToast } from "@/components/ToastProvider";
import { useKakaoShare } from "@/hooks/useKakaoShare";
import {
  useJourneyPosts,
  useToggleLike,
  useToggleBookmark,
  useReportPost,
  useAddToArchive,
  useComments,
  useCreateComment,
} from "@/hooks/queries/useJourneyQuery";
import { JourneyPost } from "@/types/journey";
import "./styles.css";

type ModalType = "menu" | "report" | "share" | "comments" | null;

export default function OthersJourneyPage() {
  const { showToast } = useToast();
  const { shareToKakao } = useKakaoShare();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "popular">("feed");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedPost, setSelectedPost] = useState<JourneyPost | null>(null);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDescription, setReportDescription] = useState("");
  const [commentText, setCommentText] = useState("");

  // Data fetching
  const { data: posts = [], isLoading } = useJourneyPosts(activeTab);
  const { data: comments = [] } = useComments(selectedPost?.id || "");
  
  // Mutations
  const toggleLikeMutation = useToggleLike();
  const toggleBookmarkMutation = useToggleBookmark();
  const reportPostMutation = useReportPost();
  const addToArchiveMutation = useAddToArchive();
  const createCommentMutation = useCreateComment();

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLike = async (postId: string) => {
    try {
      await toggleLikeMutation.mutateAsync(postId);
    } catch (error) {
      showToast("좋아요 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      await toggleBookmarkMutation.mutateAsync(postId);
      showToast("북마크가 업데이트되었습니다.", "success");
    } catch (error) {
      showToast("북마크 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const openMenu = (post: JourneyPost) => {
    setSelectedPost(post);
    setActiveModal("menu");
  };

  const openReportModal = () => {
    setActiveModal("report");
    setReportReason("");
    setReportDescription("");
  };

  const openShareModal = () => {
    setActiveModal("share");
  };

  const openCommentsModal = (post: JourneyPost) => {
    setSelectedPost(post);
    setActiveModal("comments");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPost(null);
    setReportReason("");
    setReportDescription("");
    setCommentText("");
  };

  const handleReport = async () => {
    if (!selectedPost || !reportReason) {
      showToast("신고 사유를 선택해주세요.", "warning");
      return;
    }

    try {
      await reportPostMutation.mutateAsync({
        postId: selectedPost.id,
        reason: reportReason as any,
        description: reportDescription,
      });
      showToast("신고가 접수되었습니다.", "success");
      closeModal();
    } catch (error) {
      showToast("신고 처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleShareKakao = () => {
    if (!selectedPost) return;

    shareToKakao({
      title: selectedPost.title,
      description: selectedPost.content,
      imageUrl: selectedPost.images[0] || "",
      link: `${window.location.origin}/journey/${selectedPost.id}`,
    });

    closeModal();
    showToast("카카오톡으로 공유되었습니다!", "success");
  };

  const handleAddToArchive = async () => {
    if (!selectedPost) return;

    try {
      await addToArchiveMutation.mutateAsync({
        postId: selectedPost.id,
      });
      showToast("내 아카이브에 추가되었습니다!", "success");
      closeModal();
    } catch (error) {
      showToast("아카이브 추가 중 오류가 발생했습니다.", "error");
    }
  };

  const handleCreateComment = async () => {
    if (!selectedPost || !commentText.trim()) {
      showToast("댓글 내용을 입력해주세요.", "warning");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId: selectedPost.id,
        content: commentText,
      });
      setCommentText("");
      showToast("댓글이 작성되었습니다.", "success");
    } catch (error) {
      showToast("댓글 작성 중 오류가 발생했습니다.", "error");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays === 1) return "1일 전";
    return `${diffInDays}일 전`;
  };

  if (isLoading) {
    return <Loading fullScreen text="게시물을 불러오는 중..." />;
  }

  return (
    <div className="others-journey-page">
      <LayoutTitleWithActions
        title="둘러보기"
        showBack
        icon={<FaBars />}
        onIconClick={handleSidebar}
      >
        <div className="journey-content">
          {/* 탭 네비게이션 */}
          <div className="journey-tabs">
            <button
              className={`tab ${activeTab === "feed" ? "active" : ""}`}
              onClick={() => setActiveTab("feed")}
            >
              피드
            </button>
            <button
              className={`tab ${activeTab === "popular" ? "active" : ""}`}
              onClick={() => setActiveTab("popular")}
            >
              인기
            </button>
          </div>

          {/* 섹션 헤더 */}
          <div className="section-header">
            <div className="section-info">
              <div className="section-icon">
                <div className="icon-circle">🗺️</div>
              </div>
              <div className="section-text">
                <h3>여행 피드</h3>
                <p>다른 사람들의 이야기</p>
              </div>
            </div>
          </div>

          {/* 게시물 리스트 */}
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                {/* 사용자 정보 */}
                <div className="post-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {post.user.profileImage ? (
                        <Image
                          src={post.user.profileImage}
                          alt={post.user.nickname}
                          width={40}
                          height={40}
                        />
                      ) : (
                        post.user.nickname[0].toUpperCase()
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {post.user.nickname}{" "}
                        {post.user.gender === "male" ? "♂" : post.user.gender === "female" ? "♀" : ""}{" "}
                        #{post.user.level}
                      </div>
                      <div className="post-meta">
                        <span className="location">{post.location}</span>
                        <span className="separator">•</span>
                        <span className="time">{formatTimeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="post-menu" onClick={() => openMenu(post)}>
                    <FaEllipsisV />
                  </button>
                </div>

                {/* 게시물 제목 */}
                <h4 className="post-title">{post.title}</h4>

                {/* 해시태그 */}
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 이미지 */}
                {post.images.length > 0 && (
                  <div className="post-image-container">
                    <Image
                      src={post.images[0]}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="post-image"
                    />
                    <button
                      className={`bookmark-button ${post.isBookmarked ? "active" : ""}`}
                      onClick={() => handleBookmark(post.id)}
                    >
                      <FaBookmark />
                    </button>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="post-actions">
                  <button
                    className={`action-button ${post.isLiked ? "liked" : ""}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <FaHeart className={post.isLiked ? "filled" : ""} />
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => openCommentsModal(post)}
                  >
                    <FaComment />
                    <span>{post.comments}</span>
                  </button>
                  <div className="views-count">
                    <span>👁 {post.views.toLocaleString()}</span>
                  </div>
                  <button 
                    className="action-button share-button"
                    onClick={() => {
                      setSelectedPost(post);
                      openShareModal();
                    }}
                  >
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutTitleWithActions>

      {isSidebarOpen && <Sidebar onClose={handleSidebar} />}

      {/* 메뉴 모달 */}
      <Modal
        isOpen={activeModal === "menu"}
        onClose={closeModal}
        title="게시물 옵션"
        size="small"
      >
        <div className="menu-options">
          <button className="menu-option" onClick={openShareModal}>
            <FaShareAlt />
            <span>공유하기</span>
          </button>
          <button className="menu-option danger" onClick={openReportModal}>
            <FaExclamationTriangle />
            <span>신고하기</span>
          </button>
        </div>
      </Modal>

      {/* 신고 모달 */}
      <Modal
        isOpen={activeModal === "report"}
        onClose={closeModal}
        title="게시물 신고"
        size="medium"
      >
        <div className="report-modal">
          <p className="report-description">
            부적절한 콘텐츠를 신고해주시면 검토 후 조치하겠습니다.
          </p>

          <div className="report-reasons">
            {[
              { value: "inappropriate", label: "부적절한 콘텐츠" },
              { value: "spam", label: "스팸 또는 광고" },
              { value: "harassment", label: "괴롭힘 또는 혐오 발언" },
              { value: "fake", label: "거짓 정보" },
              { value: "other", label: "기타" },
            ].map((reason) => (
              <label key={reason.value} className="reason-option">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason.value}
                  checked={reportReason === reason.value}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <span>{reason.label}</span>
              </label>
            ))}
          </div>

          {reportReason && (
            <textarea
              className="report-textarea"
              placeholder="추가 설명 (선택사항)"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={4}
            />
          )}

          <div className="modal-actions">
            <Button variant="outline" onClick={closeModal}>
              취소
            </Button>
            <Button 
              variant="primary" 
              onClick={handleReport}
              disabled={!reportReason || reportPostMutation.isPending}
            >
              {reportPostMutation.isPending ? "신고 중..." : "신고하기"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 공유 모달 */}
      <Modal
        isOpen={activeModal === "share"}
        onClose={closeModal}
        title="공유하기"
        size="small"
      >
        <div className="share-modal">
          <button className="share-option kakao" onClick={handleShareKakao}>
            <RiKakaoTalkFill className="kakao-icon" />
            <span>카카오톡으로 공유</span>
          </button>
          <button className="share-option archive" onClick={handleAddToArchive}>
            <FaBookmark />
            <span>내 아카이브에 추가</span>
          </button>
        </div>
      </Modal>

      {/* 댓글 모달 */}
      <Modal
        isOpen={activeModal === "comments"}
        onClose={closeModal}
        title={`댓글 ${comments.length}개`}
        size="medium"
      >
        <div className="comments-modal">
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="empty-comments">
                <p>첫 댓글을 작성해보세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.user.profileImage ? (
                      <Image
                        src={comment.user.profileImage}
                        alt={comment.user.nickname}
                        width={32}
                        height={32}
                      />
                    ) : (
                      comment.user.nickname[0].toUpperCase()
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.user.nickname}</span>
                      <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="comment-input-container">
            <input
              type="text"
              className="comment-input"
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateComment();
                }
              }}
            />
            <Button
              variant="primary"
              onClick={handleCreateComment}
              disabled={!commentText.trim() || createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? "..." : "등록"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

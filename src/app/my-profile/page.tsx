"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Loading } from "@/components/atoms/Loading";
import { Modal } from "@/components/atoms/Modal";
import { FaArrowLeft, FaCamera, FaSave, FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { useUserProfile, useUpdateProfile } from "@/hooks/queries/useMypageQuery";
import { authService } from "@/services/authService";
import useUserStore from "@/stores/userStore";
import "./styles.css";

export default function MyProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { logout } = useUserStore();
  
  const { data: profile, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isEdited, setIsEdited] = useState(false);
  
  // 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // 회원 탈퇴 상태
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 프로필 데이터 로드 시 상태 초기화
  React.useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setEmail(profile.email || "");
      setBio(profile.bio || "");
      setProfileImagePreview(profile.profileImage || null);
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
        setIsEdited(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        nickname,
        email,
        bio,
        profileImage: profileImagePreview || undefined,
      });
      
      showToast("프로필이 수정되었습니다", "success");
      setIsEdited(false);
    } catch (error) {
      showToast("프로필 수정에 실패했습니다", "error");
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      setIsEdited(true);
    };

  // 비밀번호 변경
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("모든 필드를 입력해주세요", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("새 비밀번호가 일치하지 않습니다", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("비밀번호는 8자 이상이어야 합니다", "error");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast("비밀번호가 변경되었습니다", "success");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showToast(error.response?.data?.message || "비밀번호 변경에 실패했습니다", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      // 카카오 SDK 로그아웃
      if (typeof window !== "undefined" && window.Kakao && window.Kakao.Auth) {
        try {
          await new Promise<void>((resolve) => {
            window.Kakao.Auth.logout(() => {
              resolve();
            });
          });
        } catch (kakaoError) {
          // 카카오 로그아웃 실패해도 계속 진행
        }
      }

      // 백엔드 로그아웃 API 호출 (토큰 무효화)
      try {
        await authService.logout();
      } catch (apiError) {
        // API 오류가 있어도 계속 진행
      }

      // 로컬 상태 및 쿠키 초기화
      logout();
      
      // localStorage 모든 데이터 삭제
      if (typeof window !== "undefined") {
        localStorage.removeItem("user-storage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("currentTravel");
        localStorage.removeItem("userPoints");
        localStorage.removeItem("completedMissions");
      }
      
      showToast("로그아웃되었습니다", "success");
      
      // 랜딩 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      showToast("로그아웃에 실패했습니다", "error");
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "회원탈퇴") {
      showToast("'회원탈퇴'를 정확히 입력해주세요", "error");
      return;
    }

    setIsDeletingAccount(true);
    try {
      // 카카오 연결 해제
      if (typeof window !== "undefined" && window.Kakao && window.Kakao.Auth) {
        try {
          await authService.unlink();
        } catch (unlinkError) {
          // 실패해도 계속 진행
        }
      }

      // 로컬 상태 및 모든 데이터 삭제
      logout();
      
      if (typeof window !== "undefined") {
        localStorage.clear(); // 모든 localStorage 데이터 삭제
        sessionStorage.clear(); // 모든 sessionStorage 데이터 삭제
      }
      
      showToast("회원 탈퇴가 완료되었습니다", "success");
      
      // 랜딩 페이지로 리다이렉트
      router.push("/");
    } catch (error: any) {
      showToast(error.response?.data?.message || "회원 탈퇴에 실패했습니다", "error");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="프로필을 불러오는 중..." />;
  }

  if (!profile) {
    return null;
  }

  return (
    <LayoutTitleWithActions
      title="내 정보"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => router.back()}
    >
      <div className="my-profile-page">
        {/* 프로필 이미지 */}
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <Image
              src={profileImagePreview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"}
              alt="프로필 이미지"
              width={120}
              height={120}
              className="profile-image"
            />
            <label htmlFor="profile-image-input" className="image-edit-button">
              <FaCamera />
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
            </label>
          </div>
          <p className="image-hint">프로필 사진을 변경하려면 클릭하세요</p>
        </div>

        {/* 프로필 정보 폼 */}
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="nickname" className="form-label">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleInputChange(setNickname)}
              className="form-input"
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
            <span className="form-hint">{nickname.length}/20</span>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className="form-input"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="form-label">
              소개
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={handleInputChange(setBio)}
              className="form-textarea"
              placeholder="자기소개를 입력하세요"
              rows={4}
              maxLength={200}
            />
            <span className="form-hint">{bio.length}/200</span>
          </div>

          {/* 계정 정보 (읽기 전용) */}
          <div className="account-info">
            <h3 className="account-info-title">계정 정보</h3>
            <div className="info-row">
              <span className="info-label">레벨</span>
              <span className="info-value">Lv. {profile.level}</span>
            </div>
            <div className="info-row">
              <span className="info-label">보유 포인트</span>
              <span className="info-value">{profile.totalPoints.toLocaleString()} P</span>
            </div>
            <div className="info-row">
              <span className="info-label">가입일</span>
              <span className="info-value">
                {new Date(profile.createdAt || Date.now()).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="form-actions">
            <Button
              onClick={handleSave}
              disabled={!isEdited || updateProfileMutation.isPending}
              className="save-button"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loading size="small" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>저장하기</span>
                </>
              )}
            </Button>
          </div>

          {/* 계정 관리 */}
          <div className="account-actions">
            <button 
              className="account-action-button" 
              onClick={() => setShowPasswordModal(true)}
            >
              비밀번호 변경
            </button>
            <button 
              className="account-action-button danger" 
              onClick={handleLogout}
            >
              로그아웃
            </button>
            <button 
              className="account-action-button danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              회원 탈퇴
            </button>
          </div>
        </div>

        {/* 비밀번호 변경 모달 */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          title="비밀번호 변경"
        >
          <div className="password-change-modal">
            <div className="form-group">
              <label className="form-label">현재 비밀번호</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>
            <div className="form-group">
              <label className="form-label">새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="새 비밀번호 (8자 이상)"
              />
            </div>
            <div className="form-group">
              <label className="form-label">새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>
            <div className="modal-actions">
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                variant="secondary"
              >
                취소
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                variant="primary"
              >
                {isChangingPassword ? "변경 중..." : "변경하기"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* 회원 탈퇴 모달 */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteConfirmText("");
          }}
          title="회원 탈퇴"
        >
          <div className="delete-account-modal">
            <div className="warning-box">
              <FaExclamationTriangle className="warning-icon" />
              <p className="warning-text">
                회원 탈퇴 시 모든 데이터가 삭제되며<br />
                복구할 수 없습니다.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">
                탈퇴를 진행하시려면 <strong>'회원탈퇴'</strong>를 입력해주세요
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="form-input"
                placeholder="회원탈퇴"
              />
            </div>
            <div className="modal-actions">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                variant="secondary"
              >
                취소
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText !== "회원탈퇴"}
                className="danger"
              >
                {isDeletingAccount ? "탈퇴 중..." : "탈퇴하기"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </LayoutTitleWithActions>
  );
}


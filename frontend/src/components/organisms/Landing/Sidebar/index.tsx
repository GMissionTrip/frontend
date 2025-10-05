"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";
import { FaSignInAlt, FaSuitcaseRolling, FaMapMarkedAlt, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import useUser from "@/hooks/useUser";
import useUserStore from "@/stores/userStore";
import { authService } from "@/services/authService";
import { useToast } from "@/components/ToastProvider";

interface SidebarProps {
  onClose: () => void;
  isLoggedIn?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, isLoggedIn = false }) => {
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useUserStore();
  const { showToast } = useToast();

  const [isClosing, setIsClosing] = useState(false);
  
  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleClose = () => {
    setIsClosing(true);
  };

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

      // 백엔드 로그아웃 API 호출
      try {
        await authService.logout();
      } catch (apiError) {
        // API 오류가 있어도 계속 진행
      }

      // 로컬 상태 초기화
      logout();
      
      // localStorage 삭제
      if (typeof window !== "undefined") {
        localStorage.removeItem("user-storage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("currentTravel");
        localStorage.removeItem("userPoints");
        localStorage.removeItem("completedMissions");
      }
      
      showToast("로그아웃되었습니다", "success");
      onClose();
      router.push("/");
    } catch (error) {
      showToast("로그아웃에 실패했습니다", "error");
    }
  };

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        onClose();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isClosing, onClose]);

  return (
    <div className={`sidebar ${isClosing ? "slide-out" : "slide-in"}`}>
      <button className="close-btn" onClick={handleClose}>
        <FaTimes />
      </button>
      <nav className="menu">
        {user ? (
          <>
            <button onClick={() => handleNavigate("/my-page")}>
              <FaUser style={{ marginRight: 8 }} />
              마이페이지
            </button>
            <button onClick={() => handleNavigate(isLoggedIn ? "/current-trip" : "/login")}>
              <FaSuitcaseRolling style={{ marginRight: 8 }} />내 여행
            </button>
            <button onClick={() => handleNavigate("/select-places")}>
              <FaMapMarkedAlt style={{ marginRight: 8 }} />
              관광지 둘러보기
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt style={{ marginRight: 8 }} />
              로그아웃
            </button>
          </>
        ) : (
          <button onClick={() => handleNavigate("/login")}>
            <FaSignInAlt style={{ marginRight: 8 }} />
            로그인/회원가입
          </button>
        )}
      </nav>
    </div>
  );
};

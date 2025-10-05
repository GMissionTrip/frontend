"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import "./styles.css";

interface LayoutTitleWithActionsProps {
  title: string | React.ReactNode;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  leftIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  children: React.ReactNode;
  // 자동 네비게이션 옵션
  showBack?: boolean; // 뒤로가기 버튼 표시
  showHome?: boolean; // 홈 버튼 표시
  backTo?: string; // 뒤로가기 버튼 클릭 시 이동할 경로 (기본: 브라우저 뒤로가기)
  homeTo?: string; // 홈 버튼 클릭 시 이동할 경로 (기본: /main)
}

export const LayoutTitleWithActions: React.FC<LayoutTitleWithActionsProps> = ({
  title,
  icon,
  onIconClick,
  leftIcon,
  onLeftIconClick,
  rightIcon,
  onRightIconClick,
  children,
  showBack = false,
  showHome = false,
  backTo,
  homeTo = "/main",
}) => {
  const router = useRouter();

  // 뒤로가기 핸들러
  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  // 홈 핸들러
  const handleHome = () => {
    router.push(homeTo);
  };

  // leftIcon 우선순위: 직접 전달된 leftIcon > showBack > showHome
  const renderLeftIcon = () => {
    if (leftIcon) {
      return (
        <div className="left-icon" onClick={onLeftIconClick}>
          {leftIcon}
        </div>
      );
    }
    
    if (showBack) {
      return (
        <div className="left-icon nav-icon" onClick={handleBack} title="뒤로가기">
          <FaArrowLeft />
        </div>
      );
    }
    
    if (showHome) {
      return (
        <div className="left-icon nav-icon" onClick={handleHome} title="홈으로">
          <FaHome />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div>
      <div className="app-bar">
        {renderLeftIcon()}
        <div className="title">{title}</div>
        {rightIcon && (
          <div className="right-icon" onClick={onRightIconClick}>
            {rightIcon}
          </div>
        )}
        {icon && (
          <div className="title-btn" onClick={onIconClick}>
            {icon}
          </div>
        )}
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

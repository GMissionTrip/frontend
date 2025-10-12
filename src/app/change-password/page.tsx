"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Loading } from "@/components/atoms/Loading";
import { useToast } from "@/components/ToastProvider";
import { authService } from "@/services/authService";
import useUser from "@/hooks/useUser";
import "./styles.css";

export default function ChangePasswordPage() {
  const { user } = useUser();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (!formData.username || !formData.currentPassword || !formData.newPassword) {
      showToast("모든 필드를 입력해주세요.", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast("새 비밀번호는 6자 이상이어야 합니다.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.changePassword(
        formData.username,
        formData.currentPassword,
        formData.newPassword
      );
      
      if (response.success) {
        showToast("비밀번호가 성공적으로 변경되었습니다!", "success");
        router.push("/my-profile");
      } else {
        showToast(response.message || "비밀번호 변경에 실패했습니다.", "error");
      }
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      showToast("비밀번호 변경 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutTitleWithActions
      title="비밀번호 변경"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => handleNavigate("/my-profile")}
    >
      <div className="change-password-page-wrapper">
        <div className="change-password-header">
          <h1>비밀번호 변경</h1>
          <p>보안을 위해 정기적으로 비밀번호를 변경해주세요</p>
        </div>
        
        <div className="change-password-form">
          <div className="form-group">
            <label className="form-label">아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">현재 비밀번호</label>
            <input
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">새 비밀번호</label>
            <input
              type="password"
              placeholder="새 비밀번호를 입력하세요 (6자 이상)"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">새 비밀번호 확인</label>
            <input
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <Button 
              variant="primary" 
              size="large" 
              onClick={handleChangePassword}
              disabled={isLoading}
              className="change-password-button"
            >
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </Button>
            
            <Button 
              variant="outline" 
              size="large" 
              onClick={() => handleNavigate("/my-profile")}
              disabled={isLoading}
              className="cancel-button"
            >
              취소
            </Button>
          </div>
          
          <div className="password-tips">
            <h3>비밀번호 보안 팁</h3>
            <ul>
              <li>8자 이상의 길이를 사용하세요</li>
              <li>대소문자, 숫자, 특수문자를 조합하세요</li>
              <li>개인정보나 쉬운 단어는 피하세요</li>
              <li>정기적으로 비밀번호를 변경하세요</li>
            </ul>
          </div>
        </div>

        {isLoading && <Loading fullScreen text="비밀번호 변경 중..." />}
      </div>
    </LayoutTitleWithActions>
  );
}

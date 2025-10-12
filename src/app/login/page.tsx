"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { LayoutTitleWithActions } from "@/components/blocks/LayoutTitleWithActions";
import { Button } from "@/components/atoms/Button";
import { Loading } from "@/components/atoms/Loading";
import { useToast } from "@/components/ToastProvider";
import useKakaoLogin from "@/hooks/useKakaoLogin";
import useUser from "@/hooks/useUser";
import useUserStore from "@/stores/userStore";
import { authService } from "@/services/authService";
import kakaoLogo from "@/assets/kakaoLogo.png";
import logo from "@/assets/logo.png";
import "./styles.css";

export default function LoginPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const { handleKakaoLogin } = useKakaoLogin();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'kakao' | 'password'>('kakao');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: ''
  });

  // 카카오 리다이렉트 후 code 처리 (한 번만 실행)
  useEffect(() => {
    let isMounted = true; // cleanup을 위한 flag
    
    const handleKakaoCallback = async () => {
      // URL에서 code 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code || !isMounted) return; // code가 없거나 unmount되면 실행하지 않음
      
      setIsLoading(true);
      
      try {
        // 카카오 SDK 로드
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js';
        script.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        
        // SDK 초기화
        const kakao = window.Kakao;
        if (!kakao.isInitialized()) {
          const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "d9d6f7271162bd0576c5b0d0baa9de5c";
          kakao.init(kakaoKey);
        }
        
        // code로 토큰 요청
        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
            redirect_uri: window.location.origin + "/login/kakao",
            code: code,
          }),
        });
        
        if (!tokenResponse.ok) {
          throw new Error('토큰 요청 실패');
        }
        
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        
        // 백엔드로 토큰 전송
        let userData;
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/kakao`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken }),
          });
          
          if (!response.ok) {
            throw new Error('Backend response not OK');
          }
          
          const backendData = await response.json();
          userData = {
            ...backendData,
            access_token: accessToken,
          };
        } catch (backendError) {
          // 백엔드 연결 실패 시 데모 사용자 사용
          userData = {
            id: "demo_user_001",
            name: "데모 사용자",
            nickname: "여행러",
            email: "demo@example.com",
            profileImage: "https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=Demo",
            access_token: accessToken,
          };
        }
        
        // Zustand store에 저장
        const { setUser } = useUserStore.getState();
        setUser(userData);
        
        showToast("로그인에 성공했습니다!", "success");
        
        // URL에서 code 파라미터 제거하고 메인으로 이동
        router.push("/main");
      } catch (error) {
        showToast("로그인 처리 중 오류가 발생했습니다.", "error");
        setIsLoading(false);
        
        // code 파라미터 제거
        router.replace("/login");
      }
    };
    
    handleKakaoCallback();
    
    // cleanup: 컴포넌트 unmount 시
    return () => {
      isMounted = false;
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // 이미 로그인한 사용자는 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/main");
    }
  }, [user, isUserLoading, router]);

  // 사용자 정보 로딩 중
  if (isUserLoading) {
    return <Loading fullScreen text="사용자 정보 확인 중..." />;
  }

  // 이미 로그인된 경우
  if (user) {
    return <Loading fullScreen text="메인 페이지로 이동 중..." />;
  }

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  const handleKakaoLoginWithLoading = async () => {
    setIsLoading(true);
    try {
      await handleKakaoLogin();
      showToast("로그인에 성공했습니다!", "success");
    } catch (error) {
      console.error("카카오 로그인 에러:", error);
      let errorMessage = "로그인 중 오류가 발생했습니다.";
      
      if (error instanceof Error) {
        if (error.message.includes("카카오 SDK가 로드되지 않았습니다")) {
          errorMessage = "카카오 로그인 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.";
        } else if (error.message.includes("카카오 앱 키가 설정되지 않았습니다")) {
          errorMessage = "카카오 로그인 설정이 필요합니다.";
        } else if (error.message.includes("백엔드 인증 실패")) {
          errorMessage = "서버와의 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.";
        }
      }
      
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestBrowse = () => {
    showToast("비회원 모드로 둘러보기를 시작합니다.", "info");
    handleNavigate("/others-journey");
  };

  const handlePasswordLogin = async () => {
    if (!formData.username || !formData.password) {
      showToast("아이디와 비밀번호를 입력해주세요.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.loginWithPassword(formData.username, formData.password);
      
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;
        
        // 사용자 정보를 store에 저장
        const { setUser } = useUserStore.getState();
        setUser({
          ...user,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        showToast("로그인에 성공했습니다!", "success");
        router.push("/main");
      } else {
        showToast(response.message || "로그인에 실패했습니다.", "error");
      }
    } catch (error) {
      console.error("아이디/비밀번호 로그인 에러:", error);
      showToast("로그인 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.nickname || !formData.email) {
      showToast("모든 필드를 입력해주세요.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register(
        formData.username,
        formData.password,
        formData.nickname,
        formData.email
      );
      
      if (response.success) {
        showToast("회원가입이 완료되었습니다. 로그인해주세요.", "success");
        setLoginMode('password');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        showToast(response.message || "회원가입에 실패했습니다.", "error");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      showToast("회원가입 중 오류가 발생했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LayoutTitleWithActions
      title="로그인/회원가입"
      leftIcon={<FaArrowLeft />}
      onLeftIconClick={() => handleNavigate("/")}
    >
      <div className="login-page-wrapper">
        <div className="login-header">
          <Image src={logo} alt="로고" className="page-logo" />
          <h1>GMTrip에 오신 것을 환영합니다</h1>
          <p>여행의 모든 순간을 기록하고 공유해보세요</p>
        </div>
        
        <div className="login-container">
          {/* 로그인 모드 선택 */}
          <div className="login-mode-selector">
            <button 
              className={`mode-button ${loginMode === 'kakao' ? 'active' : ''}`}
              onClick={() => setLoginMode('kakao')}
            >
              카카오 로그인
            </button>
            <button 
              className={`mode-button ${loginMode === 'password' ? 'active' : ''}`}
              onClick={() => setLoginMode('password')}
            >
              아이디/비밀번호
            </button>
          </div>

          {loginMode === 'kakao' ? (
            <>
              <Button 
                variant="outline" 
                size="large" 
                onClick={handleGuestBrowse}
                className="guest-button"
              >
                비회원으로 둘러보기
              </Button>
              
              <Button 
                variant="primary" 
                size="large" 
                onClick={handleKakaoLoginWithLoading}
                disabled={isLoading}
                className="kakao-button"
                leftIcon={<Image src={kakaoLogo} alt="카카오 로고" className="kakao-logo" />}
              >
                {isLoading ? "로그인 중..." : "카카오로 3초만에 시작하기"}
              </Button>
            </>
          ) : (
            <div className="password-login-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="아이디"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="닉네임"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-actions">
                <Button 
                  variant="primary" 
                  size="large" 
                  onClick={handlePasswordLogin}
                  disabled={isLoading}
                  className="login-button"
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="large" 
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="register-button"
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </Button>
              </div>
              
              <div className="test-account-info">
                <p>테스트 계정:</p>
                <p>아이디: test1, 비밀번호: gangchutest1234@</p>
              </div>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p>로그인 시 <a href="#" className="terms-link">이용약관</a> 및 <a href="#" className="terms-link">개인정보처리방침</a>에 동의하게 됩니다.</p>
        </div>

        {isLoading && <Loading fullScreen text="로그인 중..." />}
      </div>
    </LayoutTitleWithActions>
  );
}

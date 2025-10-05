"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo.png";
import kakaoLogo from "@/assets/kakaoLogo.png";
import landingBg from "@/assets/landingBackground.png";
import { FaMapMarkedAlt, FaCamera, FaUsers, FaRoute, FaStar, FaHeart } from "react-icons/fa";
import useKakaoLogin from "@/hooks/useKakaoLogin";
import useUser from "@/hooks/useUser";
import "./landing.css";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { login, isLoading } = useKakaoLogin();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
    
    // 이미 로그인되어 있으면 메인으로 이동
    if (user) {
      router.push("/main");
    }
  }, [user, router]);

  const handleKakaoLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        메인 페이지로 이동 중...
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <Image 
            src={landingBg} 
            alt="Background" 
            fill 
            className="hero-bg-img"
            priority
          />
          <div className="hero-overlay" />
        </div>
        
        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          <div className="logo-container">
            <Image src={logo} alt="GMTrip Logo" className="hero-logo" priority />
          </div>
          
          <h1 className="hero-title">
            강원도의 모든 순간을
            <br />
            <span className="gradient-text">특별한 이야기로</span>
          </h1>
          
          <p className="hero-description">
            여행 계획부터 추억 기록까지,
            <br />
            당신만의 여행 이야기를 만들어보세요
          </p>

          <div className="cta-container">
            <button 
              className="kakao-login-btn"
              onClick={handleKakaoLogin}
              disabled={isLoading}
            >
              <Image src={kakaoLogo} alt="Kakao" width={24} height={24} />
              <span>{isLoading ? "로그인 중..." : "카카오로 3초만에 시작하기"}</span>
            </button>
            <button 
              className="browse-btn"
              onClick={() => router.push("/others-journey")}
            >
              <span>비로그인으로 둘러보기</span>
            </button>
            <p className="login-info">
              간편하게 시작하고 무료로 모든 기능을 사용하세요
            </p>
            
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">여행 기록</span>
            </div>
            
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">추천 명소</span>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>스크롤하여 더 알아보기</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">FEATURES</span>
            <h2 className="section-title">
              <span>왜 <span className="gradient-text">GMTrip</span>을</span>
              <span>선택해야 할까요?</span>
            </h2>
            <p className="section-description">
              여행 계획부터 추억 공유까지, 모든 것을 한 곳에서
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon primary">
                <FaMapMarkedAlt />
              </div>
              <h3 className="feature-title">스마트 여행 계획</h3>
              <p className="feature-description">
                강원도의 숨은 명소와 최적의 여행 경로를 추천받아보세요
              </p>
              <ul className="feature-list">
                <li>✓ 테마별 맞춤 일정 생성</li>
                <li>✓ 장소 기반 경로 최적화</li>
                <li>✓ 여행 스타일별 추천</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon secondary">
                <FaCamera />
              </div>
              <h3 className="feature-title">미션 & 추억 기록</h3>
              <p className="feature-description">
                재미있는 미션을 완료하며 특별한 추억을 만들어보세요
              </p>
              <ul className="feature-list">
                <li>✓ 다양한 여행 미션</li>
                <li>✓ 사진 & 일기 기록</li>
                <li>✓ 타임라인 자동 생성</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon accent">
                <FaUsers />
              </div>
              <h3 className="feature-title">커뮤니티</h3>
              <p className="feature-description">
                다른 여행자들과 경험을 공유하고 영감을 얻어보세요
              </p>
              <ul className="feature-list">
                <li>✓ 여행 일정 공유</li>
                <li>✓ 실시간 소통</li>
                <li>✓ 베스트 여행지 추천</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon success">
                <FaRoute />
              </div>
              <h3 className="feature-title">경로 최적화</h3>
              <p className="feature-description">
                가장 효율적인 여행 동선을 자동으로 계산해드려요
              </p>
              <ul className="feature-list">
                <li>✓ 실시간 길 안내</li>
                <li>✓ 시간/비용 절약</li>
                <li>✓ 대중교통 연계</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon warning">
                <FaStar />
              </div>
              <h3 className="feature-title">포인트 & 보상</h3>
              <p className="feature-description">
                여행하며 포인트를 모으고 다양한 혜택을 받아보세요
              </p>
              <ul className="feature-list">
                <li>✓ 미션 완료 보상</li>
                <li>✓ 리뷰 작성 포인트</li>
                <li>✓ 레벨업 시스템</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon error">
                <FaHeart />
              </div>
              <h3 className="feature-title">아카이브</h3>
              <p className="feature-description">
                소중한 여행 추억을 영원히 간직하고 언제든 다시 보세요
              </p>
              <ul className="feature-list">
                <li>✓ 무제한 저장공간</li>
                <li>✓ 자동 정리 & 분류</li>
                <li>✓ 카카오톡 공유</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            지금 바로 시작해보세요
          </h2>
          <p className="cta-description">
            3초만에 가입하고 무료로 모든 기능을 경험해보세요
          </p>
          <div className="cta-buttons">
            <button 
              className="kakao-login-btn large"
              onClick={handleKakaoLogin}
              disabled={isLoading}
            >
              <Image src={kakaoLogo} alt="Kakao" width={28} height={28} />
              <span>{isLoading ? "로그인 중..." : "카카오로 시작하기"}</span>
            </button>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>© 2025 GMTrip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

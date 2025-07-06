import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import React from "react";
import { FaTimes } from "react-icons/fa";
import kakaoLogo from "../assets/kakaoLogo.png";
import logo from "../assets/logo.png";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    alert("카카오 로그인!");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <LayoutTitleWithActions title="로그인/회원가입" icon={<FaTimes />} onIconClick={handleClose}>
      <div className="login-page-wrapper">
        <img src={logo} alt="로고" className="page-logo" />
        <div className="login-container">
          <button className="browse-as-guest">비회원으로 둘러보기</button>
          <button className="login-kakao" onClick={handleKakaoLogin}>
            <img src={kakaoLogo} alt="카카오 로고" className="kakao-logo" />
            카카오로 3초만에 시작하기
          </button>
        </div>
      </div>
    </LayoutTitleWithActions>
  );
};

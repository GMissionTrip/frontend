import { useNavigate } from "react-router-dom";

const useKakaoLogin = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    const kakao = window.Kakao;

    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }

    kakao.Auth.login({
      success: (authObj) => {
        console.log("카카오 로그인 성공", authObj);
        // access_token -> 백엔드로 보내서 JWT 발급 요청 등 처리
        navigate("/main");
      },
      fail: (err) => {
        console.error("카카오 로그인 실패", err);
      },
    });
  };

  return { handleKakaoLogin };
};

export default useKakaoLogin;

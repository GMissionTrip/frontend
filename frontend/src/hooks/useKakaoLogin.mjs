import { useNavigate } from "react-router-dom";
import useUser from "./useUser.mjs";

const useKakaoLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleKakaoLogin = () => {
    const kakao = window.Kakao;

    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }

    kakao.Auth.login({
      success: async (authObj) => {
        const accessToken = authObj.access_token;

        try {
          const res = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const userData = await res.json();
          setUser(userData);
          navigate("/main");
        } catch (err) {
          console.error("백엔드 인증 실패", err);
        }
      },
      fail: (err) => {
        console.error("카카오 로그인 실패", err);
      },
    });
  };

  return { handleKakaoLogin };
};

export default useKakaoLogin;

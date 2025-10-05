import { useRouter } from "next/navigation";
import useUser from "./useUser";
import { useKakaoLoginMutation } from "./queries/useAuthQuery";
import "@/types/kakao";

// 카카오 SDK 동적 로드 함수
const loadKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error("브라우저 환경이 아닙니다."));
      return;
    }

    // 이미 로드된 경우
    if (window.Kakao) {
      resolve();
      return;
    }

    // 스크립트가 이미 존재하는지 확인
    const existingScript = document.querySelector('script[src*="kakao.min.js"]');
    if (existingScript) {
      // 기존 스크립트가 있으면 로딩 완료까지 대기
      existingScript.addEventListener('load', () => {
        resolve();
      });
      existingScript.addEventListener('error', () => {
        reject(new Error("카카오 SDK 로드 실패"));
      });
      return;
    }

    // 새 스크립트 생성 및 로드
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error("카카오 SDK 로드 실패"));
    };
    
    document.head.appendChild(script);
  });
};

const useKakaoLogin = () => {
  const router = useRouter();
  const kakaoLoginMutation = useKakaoLoginMutation();

  const handleKakaoLogin = async () => {
    try {
      // 카카오 SDK 동적 로드
      await loadKakaoSDK();

      const kakao = window.Kakao;

      // 카카오 SDK 초기화
      if (!kakao.isInitialized()) {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "d9d6f7271162bd0576c5b0d0baa9de5c";
        kakao.init(kakaoKey);
      }

      // Auth 객체 존재 여부 확인
      if (!kakao.Auth) {
        throw new Error("Kakao.Auth 객체를 찾을 수 없습니다.");
      }
      
      // SDK 2.7.0에서는 authorize 메서드가 Promise를 반환
      await kakao.Auth.authorize({
        redirectUri: window.location.origin + "/login",
      });
      
      // 액세스 토큰 가져오기
      const accessToken = kakao.Auth.getAccessToken();

      if (!accessToken) {
        throw new Error("액세스 토큰을 받지 못했습니다.");
      }

      // React Query mutation으로 백엔드 로그인 처리
      await kakaoLoginMutation.mutateAsync(accessToken);
    } catch (error) {
      throw error;
    }
  };

  return { 
    login: handleKakaoLogin,
    handleKakaoLogin,
    isLoading: kakaoLoginMutation.isPending 
  };
};

export default useKakaoLogin;

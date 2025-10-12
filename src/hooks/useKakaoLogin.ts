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
      console.log("🚀 카카오 로그인 시작");
      
      // 백엔드의 카카오 인증 URL로 리다이렉트
      const authUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/authorization`;
      console.log("🔗 인증 URL:", authUrl);
      
      // 팝업 창으로 카카오 인증 페이지 열기
      console.log("🪟 팝업 창 열기");
      const popup = window.open(
        authUrl,
        'kakaoAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        console.error("❌ 팝업 창 열기 실패");
        throw new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
      }

      console.log("✅ 팝업 창 열기 성공");

      // 팝업에서 메시지를 받을 때까지 대기
      return new Promise<void>((resolve, reject) => {
        console.log("⏳ 팝업에서 메시지 대기 시작");
        
        const messageHandler = (event: MessageEvent) => {
          console.log("📨 메시지 받음:", event);
          console.log("📍 메시지 출처:", event.origin);
          console.log("📄 메시지 데이터:", event.data);
          
          // 보안을 위해 origin 확인 (백엔드에서 보내는 메시지 허용)
          if (event.origin !== window.location.origin && event.origin !== 'http://localhost:8080') {
            console.log("⚠️ 다른 출처에서 온 메시지 무시:", event.origin);
            return;
          }

          if (event.data.accessToken && event.data.refreshToken) {
            // 성공적으로 토큰을 받았을 때
            console.log("✅ 카카오 인증 성공:", event.data);
            
            // 팝업 창 닫기
            popup.close();
            window.removeEventListener('message', messageHandler);
            
            // 백엔드에서 받은 토큰으로 사용자 정보 처리
            console.log("🔄 사용자 정보 처리 시작");
            kakaoLoginMutation.mutateAsync({
              accessToken: event.data.accessToken,
              refreshToken: event.data.refreshToken
            }).then(() => {
              console.log("✅ 사용자 정보 처리 완료");
              resolve();
            }).catch((error) => {
              console.error("❌ 사용자 정보 처리 실패:", error);
              reject(error);
            });
          } else if (event.data.error) {
            // 에러가 발생했을 때
            console.error("❌ 카카오 인증 실패:", event.data.error);
            popup.close();
            window.removeEventListener('message', messageHandler);
            reject(new Error(event.data.error));
          } else {
            console.log("ℹ️ 알 수 없는 메시지:", event.data);
          }
        };

        window.addEventListener('message', messageHandler);

        // 팝업이 닫혔는지 확인 (더 긴 시간 대기)
        const checkClosed = setInterval(() => {
          console.log("🔍 팝업 창 상태 확인 중...");
          if (popup.closed) {
            console.log("❌ 팝업 창이 닫혔습니다");
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            // 팝업이 닫혔을 때 즉시 에러를 발생시키지 않고 잠시 대기
            setTimeout(() => {
              console.log("⏰ 2초 대기 후 에러 발생");
              reject(new Error("사용자가 인증을 취소했습니다."));
            }, 2000);
          }
        }, 2000);
      });

    } catch (error) {
      console.error("❌ 카카오 로그인 오류:", error);
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

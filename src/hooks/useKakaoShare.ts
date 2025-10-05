import { useCallback, useEffect } from "react";
import { KakaoShareData, KakaoShareOptions } from "@/types/journey";

export const useKakaoShare = () => {
  // Kakao SDK 초기화
  useEffect(() => {
    const initKakao = () => {
      if (typeof window === "undefined" || !window.Kakao) return;
      
      const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
      if (!appKey) {
        return;
      }

      if (!window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(appKey);
        } catch (error) {
          // Kakao 초기화 실패 (이미 초기화된 경우 무시)
        }
      }
    };

    // SDK가 로드될 때까지 대기
    if (window.Kakao) {
      initKakao();
    } else {
      const checkKakao = setInterval(() => {
        if (window.Kakao) {
          initKakao();
          clearInterval(checkKakao);
        }
      }, 100);

      return () => clearInterval(checkKakao);
    }
  }, []);

  // 직접 옵션을 받는 공유 함수
  const kakaoShare = useCallback((options: KakaoShareOptions) => {
    if (typeof window === "undefined") return;

    if (!window.Kakao || !window.Kakao.Share) {
      alert("카카오톡 공유 기능을 사용할 수 없습니다.");
      return;
    }

    // 초기화 확인 및 재시도
    const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!window.Kakao.isInitialized() && appKey) {
      try {
        window.Kakao.init(appKey);
      } catch (error) {
        // 이미 초기화된 경우 무시
      }
    }

    try {
      window.Kakao.Share.sendDefault(options);
    } catch (error) {
      alert("카카오톡 공유에 실패했습니다. 다시 시도해주세요.");
    }
  }, []);

  // 간단한 공유 함수 (기존 호환성 유지)
  const shareToKakao = useCallback((data: KakaoShareData) => {
    kakaoShare({
      objectType: "feed",
      content: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        link: {
          mobileWebUrl: data.link,
          webUrl: data.link,
        },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: {
            mobileWebUrl: data.link,
            webUrl: data.link,
          },
        },
      ],
    });
  }, [kakaoShare]);

  return { shareToKakao, kakaoShare };
};


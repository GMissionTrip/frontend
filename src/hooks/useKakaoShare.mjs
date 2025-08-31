import { useEffect } from "react";

export const useKakaoShare = () => {
  useEffect(() => {
    if (!window.Kakao) {
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const share = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      return;
    }

    window.Kakao.Share.sendCustom({
      templateId: 123854,
      templateArgs: {},
    });
  };

  return share;
};

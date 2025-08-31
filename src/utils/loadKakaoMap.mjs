export const loadKakaoMap = () => {
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;

    if (!apiKey) {
      reject(new Error("Kakao API Key 없음"));
      return;
    }
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      resolve();
    };

    script.onerror = (e) => {
      reject(e);
    };
    document.head.appendChild(script);
  });
};

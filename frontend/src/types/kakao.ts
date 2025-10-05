export interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

export interface KakaoAPI {
  Auth: {
    login: (options: {
      success: (authObj: { access_token: string }) => void;
      fail: (err: Error) => void;
    }) => void;
    logout: (callback?: () => void) => void;
  };
  Share: {
    sendCustom: (options: {
      templateId: number;
      templateArgs: Record<string, unknown>;
    }) => void;
    sendDefault: (options: KakaoShareOptions) => void;
  };
  isInitialized: () => boolean;
  init: (key: string) => void;
  cleanup: () => void;
}

declare global {
  interface Window {
    Kakao: KakaoAPI;
  }
}

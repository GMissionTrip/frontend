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
    authorize: (options: {
      redirectUri: string;
      prompt?: string;
    }) => Promise<{ access_token: string; token_type: string; refresh_token?: string; expires_in: number; scope?: string; refresh_token_expires_in?: number }>;
    getAccessToken: () => string | null;
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

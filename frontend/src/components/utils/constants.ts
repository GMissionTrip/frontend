// 상수 정의
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  USER: "/user",
  TRIPS: "/trips",
  ARCHIVE: "/archive",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  MAIN: "/main",
  MY_ARCHIVE: "/my-archive",
  MY_PAGE: "/my-page",
  NOTIFICATION: "/notification",
  OTHERS_JOURNEY: "/others-journey",
} as const;

export const SORT_OPTIONS = {
  LATEST: "latest",
  OLDEST: "oldest",
  TITLE: "title",
} as const;

export const TRIP_STATUS = {
  BEFORE: "before",
  IN_PROGRESS: "in_progress",
  AFTER: "after",
} as const;

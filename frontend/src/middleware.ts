import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 페이지 경로
const protectedRoutes = [
  '/main',
  '/my-archive',
  '/my-page',
  '/input-trip-info1',
  '/input-trip-info2',
  '/current-trip',
  '/notification',
];

// 로그인한 사용자가 접근하면 안 되는 페이지 (비로그인 전용)
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 쿠키에서 사용자 정보 확인
  const userCookie = request.cookies.get('user');
  const isAuthenticated = !!userCookie?.value;

  // 보호된 라우트 체크
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 인증 라우트 체크 (로그인 페이지 등)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // 로그인하지 않았는데 보호된 페이지에 접근하는 경우
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); // 로그인 후 돌아갈 페이지 저장
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인했는데 로그인 페이지에 접근하는 경우
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  // 그 외의 경우 정상 진행
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


import { NextRequest, NextResponse } from 'next/server';
import { isPublicRoute } from './utils/routeAccess';

const IGNORE_EXT = /\.(?:js|css|map|png|jpg|jpeg|gif|svg|webp|ico|ttf|otf|woff|woff2)$/;
export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // 直接放行静态/HMR/常见静态后缀
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    IGNORE_EXT.test(pathname)
  ) {
    return NextResponse.next();
  }

  //   公开路由直接放行
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 用会话 cookie 名
  const sid = req.cookies.get('sid')?.value;
  if (!sid) {
    return NextResponse.redirect(new URL('/login', origin));
  }
  return NextResponse.next();
}

// 只匹配“页面路径”，排除 next 静态资源、HMR、图片、favicon、sitemap/robots、常见静态后缀等
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|assets|.*\\.(?:js|css|map|png|jpg|jpeg|gif|svg|webp|ico|ttf|otf|woff|woff2)).*)',
  ],
};

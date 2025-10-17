const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/root-register'];
const COMPELETE_PROFILE_ROUTE = ['/complete-profile'];
export const isPublicRoute = (pathname: string | undefined | null) => {
  if (typeof pathname === 'string') {
    return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  } else {
    return false;
  }
};

export const isCompeleteProfileRoute = (pathname: string | undefined | null) => {
  if (typeof pathname === 'string') {
    return COMPELETE_PROFILE_ROUTE.some(route => pathname.startsWith(route));
  } else {
    return false;
  }
};

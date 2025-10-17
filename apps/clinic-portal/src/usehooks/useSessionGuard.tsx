import { getSessionAsync, useDispatch, useSelector } from '@/libs/redux';
import { logout } from '@/services/auth.services';
import { isCompeleteProfileRoute, isPublicRoute } from '@/utils/routeAccess';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useSessionGuard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const session = useSelector(state => state.currentUser.session);
  const status = useSelector(state => state.currentUser.status);
  /** 判断是否触发过fetch session */
  const sessionRequested = useSelector(state => state.currentUser.sessionRequested);

  const isPublicPath = isPublicRoute(pathname);
  const isCompleteProfilePath = isCompeleteProfileRoute(pathname);

  // 如果没有session, 触发一次拉取
  useEffect(() => {
    if (session || status === 'loading') return;
    if (sessionRequested) return;
    dispatch(getSessionAsync());
  }, [dispatch, session, status, sessionRequested]);

  // 拉取后无session, 不是public route, 去登录页登陆
  useEffect(() => {
    if (status === 'loading') return;
    if (!sessionRequested) return;
    if (isPublicPath) return;
    if (session) return;
    (async () => {
      await logout();
      router.replace('/login');
    })();
  }, [router, status, sessionRequested, session, isPublicPath]);

  // 有 session 但 profile 未完成, 不是完善资料页 -> 跳到完善资料页
  useEffect(() => {
    if (!session) return;
    if (status === 'loading') return;
    if (!sessionRequested) return;
    if (session.profileCompleted) return;
    if (isCompleteProfilePath) return;
    router.replace('/complete-profile');
  }, [router, status, sessionRequested, session, isCompleteProfilePath]);

  const loading = status === 'loading';
  return { loading, session };
}

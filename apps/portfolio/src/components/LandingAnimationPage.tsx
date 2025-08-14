'use client';

import { systemSlice, useDispatch, useSelector } from '@/libs/redux';
import { FrankLoadingSignature } from '@frankjhub/shared-ui-core';
import { useEffect } from 'react';

export const LandingAnimationPage = () => {
  const isFirstLoad = useSelector(state => state.systemSlice.isFirstLoad);
  const dispatch = useDispatch();
  useEffect(() => {
    let timer = undefined;
    if (isFirstLoad) {
      timer = setTimeout(() => {
        dispatch(systemSlice.actions.markLandingSeen());
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isFirstLoad, dispatch]);

  if (!isFirstLoad) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-[999] bg-white">
      <div className="flex items-center justify-center h-full scale-50 lg:scale-100">
        <FrankLoadingSignature />
      </div>
    </div>
  );
};

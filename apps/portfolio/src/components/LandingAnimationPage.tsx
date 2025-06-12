'use client';

import { FrankLoadingSignature } from '@frankjhub/shared-ui-core';
import { useEffect, useState } from 'react';

export const LandingAnimationPage = () => {
  const [firstTimeLanding, setFirstTimeLanding] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setFirstTimeLanding(false);
    }, 1000);
  }, []);
  switch (firstTimeLanding) {
    case true:
      return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[999] bg-white">
          <div className="flex items-center justify-center h-full">
            <FrankLoadingSignature />
          </div>
        </div>
      );
    case false:
      return null;
  }
};

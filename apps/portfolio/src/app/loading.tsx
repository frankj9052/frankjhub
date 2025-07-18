'use client';
import { FrankSpinner } from '@frankjhub/shared-ui-hero-ssr';

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-[999] bg-white">
      <div className="flex items-center justify-center h-full">
        <FrankSpinner color="primary" />
      </div>
    </div>
  );
};

export default Loading;

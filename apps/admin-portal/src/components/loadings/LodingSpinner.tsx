import { Spinner } from '@heroui/react';

export const LoadingSpinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner color="secondary" />
    </div>
  );
};

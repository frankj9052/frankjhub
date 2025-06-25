'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

export const GoBackButton = () => {
  const router = useRouter();
  return (
    <Button
      className="w-[100px]"
      variant="ghost"
      color="secondary"
      onPress={() => {
        router.back();
      }}
    >
      Go back
    </Button>
  );
};

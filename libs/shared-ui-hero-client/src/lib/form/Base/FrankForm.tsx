import { Form } from '@heroui/react';
import { FormEvent, ReactNode } from 'react';

export interface FrankFormBaseProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const FrankForm = ({ children, className, onSubmit }: FrankFormBaseProps) => {
  return (
    <Form className={className} onSubmit={onSubmit}>
      {children}
    </Form>
  );
};

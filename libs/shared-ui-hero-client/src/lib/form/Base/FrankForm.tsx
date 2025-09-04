import { Children, ClassName, OnSubmit, Style } from '@frankjhub/shared-ui-hero-ssr';
import { Form } from '@heroui/react';

export interface FrankFormBaseProps {
  children: Children;
  className?: ClassName;
  onSubmit?: OnSubmit;
  style?: Style;
}

export const FrankForm = ({ children, className, onSubmit, style }: FrankFormBaseProps) => {
  return (
    <Form className={className} onSubmit={onSubmit} style={style}>
      {children}
    </Form>
  );
};

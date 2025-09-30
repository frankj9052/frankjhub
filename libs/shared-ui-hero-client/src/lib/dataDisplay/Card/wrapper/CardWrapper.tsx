import {
  FrankButton,
  FrankCard,
  FrankCardBody,
  FrankCardFooter,
  FrankCardHeader,
} from '@frankjhub/shared-ui-hero-ssr';
import { ReactNode } from 'react';
import { IconType } from 'react-icons/lib';

export type CardWrapperProps = {
  body?: ReactNode;
  headerIcon: IconType;
  headerText: string;
  subHeaderText?: string;
  action?: () => void;
  actionLabel?: string;
  footer?: ReactNode;
};

export const CardWrapper = ({
  body,
  headerIcon: Icon,
  headerText,
  subHeaderText,
  action,
  actionLabel,
  footer,
}: CardWrapperProps) => {
  return (
    <div className="flex items-center justify-center vertical-center">
      <FrankCard className="mx-auto p-5">
        <FrankCardHeader className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-2 items-center text-primary">
            <div className="flex flex-row items-center gap-3">
              <Icon size={30} />
              <h1 className="text-3xl font-semibold">{headerText}</h1>
            </div>
            {subHeaderText && <p className="text-neutral-500">{subHeaderText}</p>}
          </div>
        </FrankCardHeader>
        {body && <FrankCardBody>{body}</FrankCardBody>}
        {footer && (
          <FrankCardFooter>
            {action && (
              <FrankButton onPress={action} fullWidth color="primary" variant="bordered">
                {actionLabel}
              </FrankButton>
            )}
            {footer}
          </FrankCardFooter>
        )}
      </FrankCard>
    </div>
  );
};

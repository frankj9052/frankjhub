import { Children, FrankCard } from '@frankjhub/shared-ui-hero-ssr';

interface RegisterCardProps {
  children: Children;
}

export const RegisterCard = ({ children }: RegisterCardProps) => {
  return <FrankCard cardBody={children} />;
};

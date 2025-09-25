import { Children, FrankGeneralCard } from '@frankjhub/shared-ui-hero-ssr';

interface RegisterCardProps {
  children: Children;
}

export const RegisterCard = ({ children }: RegisterCardProps) => {
  return <FrankGeneralCard cardBody={children} />;
};

import { FrankProgress } from '@frankjhub/shared-ui-hero-ssr';

type Props = {
  ariaLable: string;
  value: number;
  name: string;
};
export const SkillItem = ({ ariaLable, value, name }: Props) => {
  return (
    <div>
      <div className="flex justify-between">
        <span>{name}</span>
        <span>{value}%</span>
      </div>
      <FrankProgress ariaLabel={ariaLable} value={value} size="md" />
    </div>
  );
};

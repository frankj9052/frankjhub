import { FrankCard } from '@frankjhub/shared-ui';

export type EducationCardProps = {
  year: string;
  program: string;
  school: string;
  location: string;
};

export const EducationCard = ({ year, program, school, location }: EducationCardProps) => {
  return (
    <FrankCard
      className="border-b-3 border-primary hover:scale-[1.02] cursor-default"
      cardHeight={110}
      cardBody={
        <div className="h-full flex flex-col justify-center pl-4">
          <div>{year}</div>
          <div>
            <span className="font-semibold">{program}</span>
            <span> - </span>
            <span className="text-color-text-gray">
              {school}, {location}
            </span>
          </div>
        </div>
      }
    />
  );
};

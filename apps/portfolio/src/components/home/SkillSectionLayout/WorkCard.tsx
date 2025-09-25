import { FrankGeneralCard } from '@frankjhub/shared-ui-hero-ssr';
import { Divider } from '@heroui/react';
export type WorkCardProps = {
  companyName: string;
  workType: string;
  workPeriod: string;
  jobTitle: string;
  jobDescription: string;
};
export const WorkCard = ({
  companyName,
  workType,
  workPeriod,
  jobTitle,
  jobDescription,
}: WorkCardProps) => {
  return (
    <FrankGeneralCard
      className="cursor-default hover:scale-[1.02]"
      cardHeight={240}
      cardBody={
        <div className="h-full flex flex-col justify-center p-3 gap-3">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold">{companyName}</h1>
            <div className="italic">{workType}</div>
            <div className="text-color-text-gray">{workPeriod}</div>
          </div>
          <Divider />
          <div className="w-[194px] min-h-[30px] bg-primary text-white rounded-md flex items-center justify-center">
            {jobTitle}
          </div>
          <p className="text-xs">{jobDescription}</p>
        </div>
      }
    />
  );
};

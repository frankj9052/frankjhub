import { FrankButtonBase, FrankCard } from '@frankjia9052/shared-ui';
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
    <FrankCard
      className="cursor-default hover:scale-[1.02]"
      cardHeight={250}
      cardBody={
        <div className="h-full flex flex-col justify-center p-3 gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">{companyName}</h1>
            <div className="italic">{workType}</div>
            <div className="text-color-text-gray">{workPeriod}</div>
          </div>
          <Divider />
          <div className="w-[194px] min-h-[33px] bg-primary text-white rounded-md flex items-center justify-center">
            {jobTitle}
          </div>
          <p>{jobDescription}</p>
        </div>
      }
    />
  );
};

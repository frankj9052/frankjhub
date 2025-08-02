import { SkillItem } from './SkillItem';

type SkillItemData = {
  name: string;
  value: number;
};

export type SkillGroupData = {
  groupName: string;
  skills: SkillItemData[];
};

type Props = {
  data: SkillGroupData[];
};
export const SkillContent = ({ data }: Props) => {
  return (
    <div className="px-5 pb-4 pt-2 grid grid-cols-2 gap-8">
      {data &&
        data.length > 0 &&
        data.map(item => (
          <div key={item.groupName} className="flex flex-col gap-2">
            <h3 className="font-bold">{item.groupName}</h3>
            {item.skills &&
              item.skills.length > 0 &&
              item.skills.map(skill => (
                <SkillItem
                  key={skill.name}
                  ariaLable={skill.name}
                  value={skill.value}
                  name={skill.name}
                />
              ))}
          </div>
        ))}
    </div>
  );
};

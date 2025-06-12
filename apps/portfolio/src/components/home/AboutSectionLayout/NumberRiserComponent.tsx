import { NumberRiser } from '@frankjhub/shared-ui-client';

type NumberRiserComponentProps = {
  number: number;
  text: string;
};
export const NumberRiserComponent = ({ number, text }: NumberRiserComponentProps) => {
  return (
    <div className="w-24 flex flex-col">
      <div className="flex text-xl font-bold text-color-text-black">
        <NumberRiser number={number} duration={1} />+
      </div>
      <div className="text-color-text-gray text-sm">{text}</div>
    </div>
  );
};

'use client';

type Props = {
  onClose: () => void;
};

export const CreateServiceForm = ({ onClose }: Props) => {
  return <div onClick={onClose}>create service form</div>;
};

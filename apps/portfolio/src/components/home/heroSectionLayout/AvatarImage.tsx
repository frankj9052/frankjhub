import Image from 'next/image';

export const AvatarImage = () => {
  return (
    <div className="flex justify-center items-center">
      <Image height={526} width={535} alt="avatar-01" src={'/images/avatar-01.png'} priority />
    </div>
  );
};

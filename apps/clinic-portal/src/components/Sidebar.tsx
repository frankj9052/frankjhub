import clsx from 'clsx';

export const Sidebar = () => {
  return (
    <div
      className={clsx([
        'bg-blue-200 min-w-[200px] opacity-50',
        'sticky top-0 h-[100svh] border-r',
        'flex justify-center items-center',
      ])}
    >
      clinic portal sidebar
    </div>
  );
};

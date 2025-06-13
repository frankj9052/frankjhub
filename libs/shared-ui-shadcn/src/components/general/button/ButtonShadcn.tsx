import { Button } from '../../../ui/button';

export const ButtonShadcn = () => {
  return (
    <Button
      color="danger"
      variant="ghost"
      className="hover:bg-red-200 bg-green-200 text-white hover:scale-50"
    >
      Test Button
    </Button>
  );
};

import { FrankSpinner } from '@frankjhub/shared-ui-hero-ssr';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen-minus-64">
      <FrankSpinner label={'Loading...'} color="secondary" labelColor="secondary" />
    </div>
  );
}

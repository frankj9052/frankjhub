import { useRuntimeConfig } from '@frankjhub/shared-ui-core';

export const FrankGoogleMap = () => {
  const { googleMapApiKey } = useRuntimeConfig();
  return <div>frank google map: {googleMapApiKey}</div>;
};

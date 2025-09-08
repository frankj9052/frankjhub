'use client';
import { FrankAutocomplete } from '@frankjhub/shared-ui-hero-client';

export const OrganizationSelection = () => {
  return (
    <div>
      <h1>Org:</h1>
      {/* autocomplete */}
      <div>
        <FrankAutocomplete ariaLabel="Add new org" />
      </div>
      {/* org list */}
      <div></div>
    </div>
  );
};

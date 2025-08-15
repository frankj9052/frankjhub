import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
import { FrankGoogleMap, FrankGoogleMapAddress } from './FrankGoogleMap';
import { useState } from 'react';

export interface AddressListMapViewProps {
  addresses: FrankGoogleMapAddress[];
  googleMapApiKey: string;
  googleMapId: string;
}

export const AddressListMapView = ({
  addresses,
  googleMapApiKey,
  googleMapId,
}: AddressListMapViewProps) => {
  const [hoveredAddressId, setHoveredAddressId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  return (
    <div className="w-[1000px] h-[400px] bg-blue-200 flex">
      {/* address list */}
      <div className="bg-red-200 flex-[0.3]">
        {addresses.length > 0 &&
          addresses.map(address => {
            return (
              <div key={address.id} onMouseEnter={() => setHoveredAddressId(address.id)}>
                <FrankButtonBase
                  customizeContent={`${address.label}`}
                  onPress={() => setSelectedAddressId(address.id)}
                />
              </div>
            );
          })}
      </div>
      {/* map */}
      <div className="bg-yellow-200 flex-[0.7]">
        <FrankGoogleMap
          addresses={addresses}
          googleMapApiKey={googleMapApiKey}
          googleMapId={googleMapId}
          hoveredAddressId={hoveredAddressId}
          selectedAddressId={selectedAddressId}
        />
      </div>
    </div>
  );
};

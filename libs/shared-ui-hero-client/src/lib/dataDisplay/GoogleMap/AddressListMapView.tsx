import { FrankGoogleMap, FrankGoogleMapAddress } from './FrankGoogleMap';
import { useState } from 'react';
import { AddressCard } from './AddressCard';

export interface AddressListMapViewProps {
  addresses: FrankGoogleMapAddress[];
  googleMapApiKey: string;
  googleMapId: string;
  width?: number;
  height?: number;
}

export const AddressListMapView = ({
  addresses,
  googleMapApiKey,
  googleMapId,
  width,
  height,
}: AddressListMapViewProps) => {
  const [hoveredAddressId, setHoveredAddressId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedTick, setSelectedTick] = useState(0);

  const hanldeSelect = (id: string) => {
    setSelectedAddressId(id);
    setSelectedTick(t => t + 1);
  };

  return (
    <div
      className="flex outline outline-offset-1 outline-gray-400"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      {/* address list */}
      <div className="flex-[0.3] p-1 overflow-y-scroll">
        {addresses.length > 0 &&
          addresses.map(address => {
            return (
              <div key={address.id} onMouseEnter={() => setHoveredAddressId(address.id)}>
                <AddressCard
                  onPress={() => {
                    hanldeSelect(address.id);
                  }}
                  address={address.address}
                  label={address.label}
                  link={address.link}
                  selected={address.id === selectedAddressId}
                  hovered={address.id === hoveredAddressId}
                />
                {/* <FrankButtonBase
                  customizeContent={`${address.label}`}
                  onPress={() => {
                    hanldeSelect(address.id);
                  }}
                /> */}
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
          selectedTick={selectedTick}
        />
      </div>
    </div>
  );
};

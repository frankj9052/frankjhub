import { FrankGoogleMap, FrankGoogleMapAddress } from './FrankGoogleMap';
import { useState } from 'react';
import { AddressCard } from './AddressCard';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';
import { truncateString } from '@frankjhub/shared-utils';

export interface AddressListMapViewProps {
  addresses: FrankGoogleMapAddress[];
  googleMapApiKey: string;
  googleMapId: string;
  width?: number;
  height?: number;
  popupWindowWidth?: number;
  popupWindowHeight?: number;
  loadMore?: () => void;
  isLoading?: boolean;
  linkLabel?: string;
}

export const AddressListMapView = ({
  addresses,
  googleMapApiKey,
  googleMapId,
  width,
  height,
  popupWindowWidth,
  popupWindowHeight,
  loadMore,
  isLoading,
  linkLabel = 'View Clinic',
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
      className="flex"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      {/* address list */}
      <div className="flex-[0.3] p-1 overflow-y-scroll flex flex-col gap-2">
        {addresses.length > 0 &&
          addresses.map(address => {
            return (
              <div key={address.id} onMouseEnter={() => setHoveredAddressId(address.id)}>
                <AddressCard
                  onPress={() => {
                    hanldeSelect(address.id);
                  }}
                  address={address.address}
                  label={truncateString(address.label, 30) ?? ''}
                  link={address.link}
                  selected={address.id === selectedAddressId}
                  hovered={address.id === hoveredAddressId}
                  rating={address.rating}
                  userRatingsTotal={address.user_ratings_total}
                  linkLabel={linkLabel}
                />
              </div>
            );
          })}
        {loadMore && (
          <div className="mt-1">
            <FrankButtonBase
              variant="ghost"
              height={30}
              radius="none"
              customizeContent={<div>Load More</div>}
              onPress={loadMore}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
      {/* map */}
      <div className="flex-1">
        <FrankGoogleMap
          addresses={addresses}
          googleMapApiKey={googleMapApiKey}
          googleMapId={googleMapId}
          hoveredAddressId={hoveredAddressId}
          selectedAddressId={selectedAddressId}
          selectedTick={selectedTick}
          popupWindowHeight={popupWindowHeight}
          popupWindowWith={popupWindowWidth}
          linkLabel={linkLabel}
        />
      </div>
    </div>
  );
};

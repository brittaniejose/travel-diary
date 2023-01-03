import React from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useMemo } from 'react';

function Entry({isLoaded}) {
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      Entry component showing entry date, title, content, photos, and locations
      <Map />
    </div>
  )
}
// change center to show coordinate values dynamically
function Map() {
  // stops map from recentering itself on each re-render
  const center = useMemo(() => ({lat: 18.5601, lng: -68.3725}), [])
  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
      <Marker position={{lat: 18.5601, lng: -68.3725}} />
    </GoogleMap>
  )
}

export default Entry


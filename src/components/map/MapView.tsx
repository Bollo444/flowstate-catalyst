export const MapView: React.FC<MapProps> = ({ center, zoom, markers }) => {
  return (
    <div className="map-container">
      <MapCanvas center={center} zoom={zoom} />
      <MapMarkers markers={markers} />
      <MapControls />
    </div>
  );
};

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";

function LocationMarker({
  position,
  setPosition
}) {

  useMapEvents({

    click(e) {

      setPosition([
        e.latlng.lat,
        e.latlng.lng
      ]);

    },

  });

  return position ? (
    <Marker position={position} />
  ) : null;
}

function AdminMapPicker({
  position,
  setPosition
}) {

  return (

    <MapContainer
      center={[-16.5, -68.15]}
      zoom={13}

      style={{
        height: "550px",
        width: "100%",
        borderRadius: "20px"
      }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        position={position}
        setPosition={setPosition}
      />

    </MapContainer>

  );
}

export default AdminMapPicker;
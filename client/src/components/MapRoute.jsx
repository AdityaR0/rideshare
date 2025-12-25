import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

export default function MapRoute({ map, from, to }) {
  useEffect(() => {
    if (!map || !from || !to) return;

    const routing = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      addWaypoints: false,
    }).addTo(map);

    return () => map.removeControl(routing);
  }, [map, from, to]);

  return null;
}

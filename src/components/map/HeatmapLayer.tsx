import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface Props {
  points: [number, number, number][]; // [lat, lng, intensity 0-1]
  radius?: number;
  blur?: number;
  maxZoom?: number;
  gradient?: Record<string, string>;
}

export function HeatmapLayer({ points, radius = 40, blur = 30, maxZoom = 6, gradient }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const heat = (L as any).heatLayer(points, {
      radius,
      blur,
      maxZoom,
      gradient: gradient ?? {
        0.0: "#22c55e",
        0.3: "#84cc16",
        0.5: "#eab308",
        0.65: "#f97316",
        0.8: "#ef4444",
        1.0: "#7f1d1d",
      },
      max: 1.0,
    });
    heat.addTo(map);
    return () => { heat.remove(); };
  }, [map, points, radius, blur, maxZoom, gradient]);

  return null;
}

/**
 * Shared geo utilities for distance calculations and coordinate parsing
 */

export type Coords = { lat: number; lon: number };

/**
 * Parse lat/lon from any input (string or number) to Coords object
 * Returns null if coordinates are not valid numbers
 */
export function parseCoords(lat: any, lon: any): Coords | null {
  const latNum =
    typeof lat === "string" ? parseFloat(lat) : (lat as number | undefined);
  const lonNum =
    typeof lon === "string" ? parseFloat(lon) : (lon as number | undefined);

  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
  return { lat: latNum as number, lon: lonNum as number };
}

/**
 * Calculate Haversine distance between two coordinates in kilometers
 */
export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371; // Earth radius in km
  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Find nearest site to an NFO by aerial distance
 * Returns site_id, distance, and parsed coordinates, or null if no valid sites
 */
export function findNearestSite(
  nfo: Coords,
  sites: { site_id: string; latitude: any; longitude: any }[]
): { site_id: string; distanceKm: number; coords: Coords } | null {
  let best: { site_id: string; distanceKm: number; coords: Coords } | null =
    null;

  for (const s of sites) {
    const c = parseCoords(s.latitude, s.longitude);
    if (!c) continue;

    const d = haversineKm(nfo, c);
    if (!best || d < best.distanceKm) {
      best = { site_id: s.site_id, distanceKm: d, coords: c };
    }
  }
  return best;
}

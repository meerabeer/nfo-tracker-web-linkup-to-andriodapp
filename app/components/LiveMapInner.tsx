"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import {
  type NfoStatusRow,
  type SiteRecord,
  hasValidLocation,
  getSiteById,
  findNearestSite,
  formatDistanceLabel,
  isOnline,
  ageMinutes,
} from "../lib/nfoHelpers";

type LiveMapInnerProps = {
  nfos: NfoStatusRow[];
  sites: SiteRecord[];
};

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const siteIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [15, 25],
  iconAnchor: [7.5, 25],
});

export default function LiveMapInner({ nfos, sites }: LiveMapInnerProps) {
  // Filter NFOs with valid coordinates
  const filteredNfos = useMemo(() => {
    return nfos.filter((row) =>
      hasValidLocation({ lat: row.lat, lng: row.lng })
    );
  }, [nfos]);

  // Build connection lines: NFO to site
  const connectionLines = useMemo(() => {
    const lines: Array<{
      from: [number, number];
      to: [number, number];
      nfoId: string;
      siteId: string;
      distanceKm: number;
    }> = [];

    for (const nfo of filteredNfos) {
      if (!hasValidLocation({ lat: nfo.lat, lng: nfo.lng })) continue;

      let targetSite: SiteRecord | null = null;
      let distanceKm = 0;

      // If busy with assigned site, use that
      if (nfo.status === "busy" && nfo.site_id) {
        targetSite = getSiteById(sites, nfo.site_id);
      }

      // Otherwise find nearest site
      if (!targetSite) {
        const nearest = findNearestSite(
          { lat: nfo.lat, lng: nfo.lng },
          sites
        );
        if (nearest) {
          targetSite = nearest.site as SiteRecord;
          distanceKm = nearest.distanceKm;
        }
      } else if (targetSite && hasValidLocation({ lat: targetSite.latitude, lng: targetSite.longitude })) {
        // Calculate distance if we have the busy site
        distanceKm = Math.hypot(
          (nfo.lat! - targetSite.latitude!) * 111, // rough km conversion
          (nfo.lng! - targetSite.longitude!) * 111 * Math.cos(((nfo.lat! + targetSite.latitude!) / 2) * Math.PI / 180)
        );
      }

      if (
        targetSite &&
        hasValidLocation({ lat: targetSite.latitude, lng: targetSite.longitude })
      ) {
        lines.push({
          from: [nfo.lat as number, nfo.lng as number],
          to: [targetSite.latitude as number, targetSite.longitude as number],
          nfoId: nfo.username,
          siteId: targetSite.site_id,
          distanceKm,
        });
      }
    }

    return lines;
  }, [filteredNfos, sites]);

  // Site markers
  const siteMarkers = useMemo(() => {
    return sites.filter((site) =>
      hasValidLocation({ lat: site.latitude, lng: site.longitude })
    );
  }, [sites]);

  // If no points, still render a map centered on Western Region (Saudi)
  const center: [number, number] =
    filteredNfos.length > 0
      ? ([filteredNfos[0].lat as number, filteredNfos[0].lng as number])
      : [21.5, 39.2]; // somewhere between Jeddah/Makkah

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Connection lines from NFOs to sites */}
      {connectionLines.map((line, idx) => (
        <Polyline
          key={`line-${idx}`}
          positions={[line.from, line.to]}
          color="#ccc"
          weight={1}
          opacity={0.5}
        />
      ))}

      {/* NFO markers */}
      {filteredNfos.map((nfo) => {
        const online = isOnline(nfo.last_active_at);
        const minutesSinceActive = ageMinutes(nfo.last_active_at);

        // Determine which site to show
        let nearestSiteId: string | null = null;
        let nearestSiteName: string | null = null;
        let distanceLabel = "N/A";
        let siteLabel = "N/A";

        if (nfo.status === "busy" && nfo.site_id) {
          const activeSite = getSiteById(sites, nfo.site_id);
          if (
            activeSite &&
            hasValidLocation({ lat: activeSite.latitude, lng: activeSite.longitude })
          ) {
            nearestSiteId = activeSite.site_id;
            nearestSiteName = activeSite.name ?? null;
            const dist = Math.hypot(
              (nfo.lat! - activeSite.latitude!) * 111,
              (nfo.lng! - activeSite.longitude!) * 111 * Math.cos(((nfo.lat! + activeSite.latitude!) / 2) * Math.PI / 180)
            );
            distanceLabel = formatDistanceLabel(dist);
            siteLabel = `Busy at site ${nearestSiteId} - ${distanceLabel}`;
          } else {
            siteLabel = `Busy at site ${nfo.site_id} - N/A`;
          }
        } else {
          const nearest = findNearestSite(
            { lat: nfo.lat, lng: nfo.lng },
            sites
          );
          if (nearest) {
            const siteRec = nearest.site as SiteRecord;
            nearestSiteId = siteRec.site_id;
            nearestSiteName = siteRec.name ?? null;
            distanceLabel = formatDistanceLabel(nearest.distanceKm);
            if (nfo.status === "free") {
              siteLabel = `Free near site ${nearestSiteId} - ${distanceLabel}`;
            } else {
              siteLabel = `Nearest site ${nearestSiteId} - ${distanceLabel}`;
            }
          }
        }

        return (
          <Marker
            key={nfo.username}
            position={[nfo.lat as number, nfo.lng as number]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <div>
                  <strong>{nfo.username}</strong> – {nfo.name}
                </div>
                <div>Status: {nfo.status ?? "-"}</div>
                <div>Activity: {nfo.activity ?? "-"}</div>
                <div>Site ID: {nfo.site_id ?? "-"}</div>
                <div>
                  Online: {online ? "Yes (ping < 15 min)" : "No (offline)"}
                </div>
                {minutesSinceActive !== null && (
                  <div>Last active: {Math.round(minutesSinceActive)} min ago</div>
                )}
                <div className="font-semibold text-blue-600">{siteLabel}</div>
                <div>
                  Last updated:{" "}
                  {nfo.last_active_at
                    ? new Date(nfo.last_active_at).toLocaleString()
                    : "-"}
                </div>
                <div>Area: {nfo.home_location ?? "-"}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Site markers */}
      {siteMarkers.map((site) => (
        <Marker
          key={site.site_id}
          position={[site.latitude as number, site.longitude as number]}
          icon={siteIcon}
        >
          <Popup>
            <div className="text-xs space-y-1">
              <div>
                <strong>Site: {site.site_id}</strong>
              </div>
              {site.name && <div>Name: {site.name}</div>}
              {site.area && <div>Area: {site.area}</div>}
              <div>
                Coords: {site.latitude?.toFixed(4)}, {site.longitude?.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

"use client";

import dynamic from "next/dynamic";

type NfoStatusRow = {
  username: string;
  name: string | null;
  status: string | null;
  activity: string | null;
  site_id: string | null;
  lat: number | null;
  lng: number | null;
  logged_in: boolean | null;
  last_active_at: string | null;
  home_location: string | null;
};

type NfoRoutesViewProps = {
  nfos: NfoStatusRow[];
};

const NfoRoutesViewInner = dynamic(() => import("./NfoRoutesViewInner"), {
  ssr: false, // critical: do NOT render leaflet on server
  loading: () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-4 text-slate-900">NFO Route Planning</h2>
        <p className="text-slate-500">Loading routes component…</p>
      </div>
    </div>
  ),
});

export default function NfoRoutesView(props: NfoRoutesViewProps) {
  return <NfoRoutesViewInner {...props} />;
}

"use client";

import dynamic from "next/dynamic";
import type { NfoStatusRow, SiteRecord } from "../lib/nfoHelpers";

type LiveMapProps = {
  nfos: NfoStatusRow[];
  sites: SiteRecord[];
};

const LiveMapInner = dynamic(() => import("./LiveMapInner"), {
  ssr: false, // critical: do NOT render leaflet on server
  loading: () => (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500">Loading map…</p>
    </div>
  ),
});

export default function LiveMap(props: LiveMapProps) {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200">
      <LiveMapInner {...props} />
    </div>
  );
}

'use client'
import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/Maps/MapClient"), { ssr: false });

export default function Maps() {
  return (
    <div>
      <h1>Contoh React-Leaflet di Next.js 16</h1>
      <MapClient />
    </div>
  );
}

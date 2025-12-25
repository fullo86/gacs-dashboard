/* =========================
   RESPONSE & UTIL
========================= */

import { NextResponse } from "next/server";
import GenieacsCredential from "../models/genieacs/GenieACSCredential";
import Configuration from "@/models/configuration/Configuration";
import { GetSessionFromServer } from "./GetSessionfromServer";
import MacVendorCache from "@/models/mac_vendor_cache/MacVendorCache";


// JSON response helper
export function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

// Sanitize input
export function clean(value) {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[<>"'`]/g, '');
}

/* =========================
   CONFIGURATION
========================= */

export async function getConfig(key) {
  const session = await GetSessionFromServer();
  const userId = session?.user?.id;
  
  const config = await Configuration.findOne({
    where: { user_id: userId, 
            config_key: key 
          },
  });

  return config?.config_value ?? null;
}

export async function setConfig(key, value) {
  const session = await GetSessionFromServer();
  const userId = session?.user?.id;

  let cfg = await Configuration.findOne({
        where: {
          user_id: userId,
          config_key: key
        }
      })

  if (cfg) {
    await cfg.update({ config_value: value });
  } else {
    await Configuration.create({
      user_id: userId,
      config_key: key,
      config_value: value,
    });
  }

  return true;
}

/* =========================
   GENIEACS
========================= */

// Check if GenieACS is configured
export async function isGenieACSConfigured() {
  const session = await GetSessionFromServer();
  const userId = session?.user?.id;

  const count = await GenieacsCredential.count({
    where: { user_id: userId, is_connected: true },
  });

  return count > 0;
}

/* =========================
   TIME & FORMAT
========================= */

export function formatTime(timestamp) {
  return new Date(timestamp).toISOString().replace('T', ' ').substring(0, 19);
}

export function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export function formatBytes(bytes, precision = 2) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(precision)} ${units[i]}`;
}

/* =========================
   CSRF (OPTIONAL INTERNAL)
========================= */

export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCSRFToken(token, storedToken) {
  if (!token || !storedToken) return false;
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
}

/* =========================
   MAC VENDOR LOOKUP
========================= */

export async function getMACVendor(macAddress, fallbackName = 'Unknown Device') {
  if (!macAddress || macAddress === 'N/A') return fallbackName;

  const session = await GetSessionFromServer();
  const userId = session?.user?.id;

  const cleaned = macAddress.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  if (cleaned.length < 6) return fallbackName;
  const oui = cleaned.substring(0, 6);

  // Cek cache
  const cached = await MacVendorCache.findOne({ where: { oui, user_id: userId } });
  if (cached) return cached.vendor_name;

  // Fetch API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`https://api.macvendors.com/${encodeURIComponent(macAddress)}`, {
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      const vendor = (await res.text()).trim();
      if (vendor) {
        await MacVendorCache.upsert({ oui, user_id: userId, vendor_name: vendor, cached_at: new Date() });
        return vendor;
      }
    }
  } catch (err) {
    // silent fail
  }

  // Fallback cache
  await MacVendorCache.upsert({
    oui,
    user_id: userId,
    vendor_name: fallbackName,
    cached_at: new Date(),
  });

  return fallbackName;
}

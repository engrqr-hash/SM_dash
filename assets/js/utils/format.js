export function formatTimeRelative(timestamp) {
  const diff = timestamp - Date.now();
  const abs = Math.abs(diff);
  const sign = diff >= 0 ? 1 : -1;
  const unit = abs < 60000 ? "s"
    : abs < 3600000 ? "m"
    : abs < 86400000 ? "h"
    : "d";
  let value;
  if (unit === "s") value = Math.round(abs/1000);
  else if (unit === "m") value = Math.round(abs/60000);
  else if (unit === "h") value = Math.round(abs/3600000);
  else value = Math.round(abs/86400000);
  return sign === 1 ? `in ${value}${unit}` : `${value}${unit} ago`;
}

export function shortNumber(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+"M";
  if (n >= 1_000) return (n/1_000).toFixed(1)+"K";
  return String(n);
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1)+" KB";
  const mb = kb / 1024;
  return mb.toFixed(1)+" MB";
}

export function formatDateShort(d) {
  return d.getDate();
}
const normalizeBaseUrl = (value) => {
  if (!value) return "";

  let normalized = value.trim().replace(/\/+$/, "");

  // Accept values that include /api and normalize to host root.
  if (normalized.endsWith("/api")) {
    normalized = normalized.slice(0, -4);
  }

  return normalized;
};

const processApiUrl =
  typeof process !== "undefined" ? process.env?.REACT_APP_API_URL : undefined;

export const API_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || processApiUrl || ""
);
